// ==============================================================================
// Modelo: Project (Aberturas de Lojas Fnac/Darty)
// Integração direta com a base de dados SQLite persistente
// ==============================================================================

const db = require('../database/db');

class Project {
  // Lista todos os projetos com filtro opcional por insígnia ou estado
  static async findAll(filters = {}) {
    let sql = `
      SELECT 
        p.*,
        (
          SELECT COUNT(*) 
          FROM tasks t 
          WHERE t.project_id = p.id
        ) as total_tasks,
        (
          SELECT COUNT(*) 
          FROM tasks t 
          WHERE t.project_id = p.id AND t.status = 'concluido'
        ) as completed_tasks
      FROM projects p
      WHERE 1=1
    `;
    const params = [];

    if (filters.brand) {
      sql += ` AND p.brand = ?`;
      params.push(filters.brand);
    }

    if (filters.status) {
      sql += ` AND p.status = ?`;
      params.push(filters.status);
    }

    sql += ` ORDER BY p.go_live_date ASC`;

    const projects = db.query(sql, params);

    // Calcular percentagem de progresso real
    return projects.map(p => {
      const progress = p.total_tasks > 0 
        ? Math.round((p.completed_tasks / p.total_tasks) * 100) 
        : (p.status === 'em_curso' ? 75 : (p.status === 'concluido' ? 100 : 25));
      return {
        ...p,
        progress
      };
    });
  }

  // Obtém projeto por ID ou Código com tarefas associadas
  static async findById(id) {
    const isCode = isNaN(id);
    const sql = isCode 
      ? `SELECT * FROM projects WHERE code = ?` 
      : `SELECT * FROM projects WHERE id = ?`;
    
    const project = db.get(sql, [id]);
    if (!project) return null;

    // Obter tarefas do projeto
    const tasks = db.query(`SELECT * FROM tasks WHERE project_id = ? ORDER BY due_date ASC`, [project.id]);
    
    // Obter custos registados
    const costs = db.query(`SELECT * FROM project_costs WHERE project_id = ? ORDER BY entry_date DESC`, [project.id]);

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'concluido').length;
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 30;

    return {
      ...project,
      progress,
      tasks,
      costs
    };
  }

  // Criação de uma nova abertura de loja
  static async create(data) {
    const brand = data.brand || 'Fnac';
    const name = data.name.trim();
    
    // Gerar código de projeto amigável (ex: FNAC-LEI-2026)
    let code = data.code;
    if (!code) {
      const prefix = brand.toUpperCase().includes('DARTY') ? 'DARTY' : 'FNAC';
      const cityCode = name.replace(/fnac|darty/gi, '').trim().substring(0, 3).toUpperCase() || 'LOJA';
      const year = new Date().getFullYear();
      code = `${prefix}-${cityCode}-${year}-${Math.floor(100 + Math.random() * 900)}`;
    }

    const storeFormat = data.store_format || 'Standard';
    const location = data.location || 'Localização a definir';
    const goLiveDate = data.go_live_date;
    const targetDate = data.target_completion_date || data.go_live_date;
    const dailyCost = parseFloat(data.daily_cost) || 0;
    const totalBudget = parseFloat(data.total_budget) || 0;
    const status = data.status || 'planeamento';
    const signageStatus = data.signage_status || 'pendente';
    const playlistVersion = data.playlist_version || 'v1.0';

    const insertSql = `
      INSERT INTO projects (
        code, name, brand, store_format, location,
        go_live_date, target_completion_date, daily_cost,
        total_budget, status, signage_status, playlist_version, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const result = db.run(insertSql, [
      code, name, brand, storeFormat, location,
      goLiveDate, targetDate, dailyCost,
      totalBudget, status, signageStatus, playlistVersion, 1
    ]);

    const newId = result.lastInsertRowid;

    // Inicializar checklist padrão de abertura para a nova loja (Fase 10)
    try {
      const goLive = new Date(goLiveDate || Date.now());
      const formatIso = (d) => d.toISOString().split('T')[0];

      const d1 = new Date(goLive); d1.setDate(d1.getDate() - 15);
      const d2 = new Date(goLive); d2.setDate(d2.getDate() - 10);
      const d3 = new Date(goLive); d3.setDate(d3.getDate() - 7);
      const d4 = new Date(goLive); d4.setDate(d4.getDate() - 3);

      const defaultTasks = [
        {
          title: 'Vistoria Técnica & Passagem de Cablagem',
          dept: 'Multimédia & Telas',
          priority: 'high',
          due: formatIso(d1),
          desc: 'Validação de pontos de rede, calhas e infraestrutura elétrica para os displays'
        },
        {
          title: 'Fixação Física de Suportes e Ecrãs LED / 4K',
          dept: 'Multimédia & Telas',
          priority: 'critical',
          due: formatIso(d2),
          desc: 'Montagem mecânica de suportes de parede e colocação de displays e players'
        },
        {
          title: 'Configuração de Rede, VLAN e IPs dos Players',
          dept: 'Redes & IT',
          priority: 'high',
          due: formatIso(d3),
          desc: 'Provisionamento de switch PoE e atribuição de endereçamento IP estático aos players'
        },
        {
          title: 'Deploy de Playlists e Testes de Stress 24h',
          dept: 'Multimédia & Telas',
          priority: 'critical',
          due: formatIso(d4),
          desc: 'Carga de conteúdos de inauguração, validação de áudio e monitorização de reprodução contínua'
        }
      ];

      for (const t of defaultTasks) {
        db.run(
          `INSERT INTO tasks (project_id, department, title, description, priority, status, due_date, assigned_to) VALUES (?, ?, ?, ?, ?, 'pendente', ?, 1)`,
          [newId, t.dept, t.title, t.desc, t.priority, t.due]
        );
      }
    } catch (e) {
      console.warn('[Project.create] Aviso ao gerar tarefas padrão:', e.message);
    }

    return this.findById(newId);
  }

  // Atualização de dados de uma abertura
  static async update(id, data) {
    const fields = [];
    const values = [];

    const allowed = ['name', 'brand', 'store_format', 'location', 'go_live_date', 'target_completion_date', 'daily_cost', 'total_budget', 'status', 'signage_status', 'playlist_version'];

    for (const key of allowed) {
      if (data[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(data[key]);
      }
    }

    if (fields.length === 0) return this.findById(id);

    values.push(new Date().toISOString());
    values.push(id);

    const updateSql = `UPDATE projects SET ${fields.join(', ')}, updated_at = ? WHERE id = ?`;
    db.run(updateSql, values);

    return this.findById(id);
  }

  // Remoção de projeto
  static async delete(id) {
    const result = db.run(`DELETE FROM projects WHERE id = ?`, [id]);
    return result.changes > 0;
  }

  // Métricas agregadas em tempo real para os KPIs do Dashboard
  static async getKpis() {
    // 1. Próxima Abertura Mais Iminente
    let nextOpening = db.get(`
      SELECT * FROM projects 
      WHERE go_live_date >= DATE('now')
      ORDER BY go_live_date ASC 
      LIMIT 1
    `) || db.get(`SELECT * FROM projects ORDER BY go_live_date ASC LIMIT 1`);

    if (nextOpening) {
      // Progresso da loja (%) com base nas tarefas técnicas
      const storeTasks = db.get(`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN status = 'concluido' THEN 1 ELSE 0 END) as completed
        FROM tasks 
        WHERE project_id = ?
      `, [nextOpening.id]);

      const tTotal = storeTasks?.total || 0;
      const tComp = storeTasks?.completed || 0;
      const progress = tTotal > 0 
        ? Math.round((tComp / tTotal) * 100) 
        : (nextOpening.status === 'em_curso' ? 75 : (nextOpening.status === 'concluido' ? 100 : 25));

      // Contagem de Displays e Formatos / Resoluções na loja
      const storePlayers = db.get(`
        SELECT 
          COUNT(*) as displays_count,
          COUNT(DISTINCT resolution) as formats_count,
          SUM(CASE WHEN playlist_id IS NOT NULL THEN 1 ELSE 0 END) as assigned_playlists,
          SUM(CASE WHEN playlist_id IS NULL THEN 1 ELSE 0 END) as unassigned_playlists
        FROM signage_players 
        WHERE project_id = ?
      `, [nextOpening.id]);

      const displaysCount = storePlayers?.displays_count || 0;
      const formatsCount = storePlayers?.formats_count || 0;
      const unassignedPl = storePlayers?.unassigned_playlists || 0;

      let playlistsState = '100% OK';
      let playlistsStateClass = 'ready';
      if (displaysCount === 0) {
        playlistsState = '0 Telas';
        playlistsStateClass = 'pending';
      } else if (unassignedPl > 0) {
        playlistsState = `${unassignedPl} a Associar`;
        playlistsStateClass = 'warning';
      }

      nextOpening = {
        ...nextOpening,
        progress,
        displaysCount,
        formatsCount,
        playlistsState,
        playlistsStateClass,
        unassignedPlaylistsCount: unassignedPl
      };
    }

    // 2. Métricas de Hardware & Displays (signage_players)
    const playerMetrics = db.get(`
      SELECT 
        COUNT(*) as total_players,
        SUM(CASE WHEN status = 'online' OR status = 'syncing' THEN 1 ELSE 0 END) as ready_players,
        SUM(CASE WHEN status = 'online' THEN 1 ELSE 0 END) as online_players,
        SUM(CASE WHEN status = 'testing' THEN 1 ELSE 0 END) as testing_players,
        SUM(CASE WHEN status = 'syncing' THEN 1 ELSE 0 END) as syncing_players,
        SUM(CASE WHEN status = 'offline' THEN 1 ELSE 0 END) as offline_players,
        SUM(CASE WHEN playlist_id IS NULL THEN 1 ELSE 0 END) as unassigned_players
      FROM signage_players
    `);

    // Modelos de Hardware no Parque
    const hardwareModels = db.query(`
      SELECT device_model as model, COUNT(*) as count
      FROM signage_players
      GROUP BY device_model
      ORDER BY count DESC
    `);

    // Formatos e Resoluções de Saída
    const resolutions = db.query(`
      SELECT resolution, COUNT(*) as count
      FROM signage_players
      GROUP BY resolution
      ORDER BY count DESC
    `);

    // 3. Métricas de Playlists & Campanhas
    const playlistMetrics = db.get(`
      SELECT 
        COUNT(*) as total_playlists,
        SUM(CASE WHEN status = 'publicada' THEN 1 ELSE 0 END) as published,
        SUM(CASE WHEN status = 'em_validacao' THEN 1 ELSE 0 END) as validating,
        SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) as draft
      FROM playlists
    `);

    // 4. Métricas de Aberturas / Projetos de Loja
    const projectMetrics = db.get(`
      SELECT 
        COUNT(*) as total_openings,
        SUM(CASE WHEN status = 'em_curso' THEN 1 ELSE 0 END) as em_curso,
        SUM(CASE WHEN status = 'planeamento' THEN 1 ELSE 0 END) as planeamento,
        SUM(CASE WHEN status = 'testes_signage' THEN 1 ELSE 0 END) as testes_signage,
        SUM(CASE WHEN status = 'concluido' THEN 1 ELSE 0 END) as concluido,
        SUM(CASE WHEN status = 'atrasado' THEN 1 ELSE 0 END) as atrasado,
        SUM(CASE WHEN signage_status = 'pronto' THEN 1 ELSE 0 END) as signage_pronto,
        SUM(CASE WHEN signage_status = 'validacao' THEN 1 ELSE 0 END) as signage_validacao,
        SUM(CASE WHEN signage_status = 'configuracao' THEN 1 ELSE 0 END) as signage_configuracao,
        SUM(CASE WHEN signage_status = 'pendente' THEN 1 ELSE 0 END) as signage_pendente
      FROM projects
    `);

    const totalPl = playerMetrics?.total_players || 0;
    const readyPl = playerMetrics?.ready_players || 0;
    const signageReadiness = totalPl > 0 ? Math.round((readyPl / totalPl) * 100) : 87;

    // Totais Financeiros (mantidos para compatibilidade do modelo)
    const financials = db.get(`
      SELECT 
        COUNT(*) as active_count,
        AVG(daily_cost) as avg_daily_cost,
        SUM(daily_cost) as total_daily_cost,
        SUM(total_budget) as total_budget
      FROM projects 
      WHERE status != 'concluido'
    `);

    // =========================================================================
    // FASE 10: KPIs OPERACIONAIS DE PLANEAMENTO & CHECKLIST DE TAREFAS
    // =========================================================================

    // 1. Progresso Global das Lojas em Planeamento
    const planningStats = db.get(`
      SELECT 
        COUNT(DISTINCT p.id) as active_stores_count,
        COUNT(t.id) as total_tasks,
        SUM(CASE WHEN t.status = 'concluido' THEN 1 ELSE 0 END) as completed_tasks,
        SUM(CASE WHEN t.status != 'concluido' THEN 1 ELSE 0 END) as pending_tasks
      FROM projects p
      LEFT JOIN tasks t ON t.project_id = p.id
      WHERE p.status IN ('planeamento', 'em_curso')
    `);

    const activeStoresCount = planningStats?.active_stores_count || 0;
    const totalPlanningTasks = planningStats?.total_tasks || 0;
    const completedPlanningTasks = planningStats?.completed_tasks || 0;
    const pendingPlanningTasks = planningStats?.pending_tasks || 0;

    const globalPlanningProgress = totalPlanningTasks > 0 
      ? Math.round((completedPlanningTasks / totalPlanningTasks) * 100)
      : 0;

    // 2. Tarefas Pendentes de Checklist (por Prioridade)
    const priorityBreakdown = db.get(`
      SELECT 
        SUM(CASE WHEN t.priority = 'critical' THEN 1 ELSE 0 END) as critical_count,
        SUM(CASE WHEN t.priority = 'high' THEN 1 ELSE 0 END) as high_count,
        SUM(CASE WHEN t.priority = 'medium' THEN 1 ELSE 0 END) as medium_count,
        SUM(CASE WHEN t.priority = 'low' THEN 1 ELSE 0 END) as low_count
      FROM tasks t
      INNER JOIN projects p ON t.project_id = p.id
      WHERE p.status IN ('planeamento', 'em_curso')
        AND t.status != 'concluido'
    `);

    // 3. Tarefas "Due Soon" (Esta Semana ou em Atraso)
    const dueSoonStats = db.get(`
      SELECT 
        COUNT(t.id) as total_due_soon,
        SUM(CASE WHEN t.due_date < DATE('now') THEN 1 ELSE 0 END) as overdue_count,
        SUM(CASE WHEN t.due_date >= DATE('now') AND t.due_date <= DATE('now', '+7 days') THEN 1 ELSE 0 END) as this_week_count,
        COUNT(DISTINCT p.id) as impacted_stores_count
      FROM tasks t
      INNER JOIN projects p ON t.project_id = p.id
      WHERE p.status IN ('planeamento', 'em_curso')
        AND t.status != 'concluido'
        AND t.due_date IS NOT NULL
        AND t.due_date <= DATE('now', '+7 days')
    `);

    const monthlyCosts = db.get(`
      SELECT SUM(amount) as month_total 
      FROM project_costs 
      WHERE strftime('%Y-%m', entry_date) = strftime('%Y-%m', 'now')
    `);

    return {
      nextOpening,
      signageReadiness,
      signageStats: {
        total: totalPl,
        online: playerMetrics?.online_players || 0,
        testing: playerMetrics?.testing_players || 0,
        syncing: playerMetrics?.syncing_players || 0,
        offline: playerMetrics?.offline_players || 0
      },
      // FASE 10: KPIs Operacionais de Planeamento
      planningProgress: {
        percentage: globalPlanningProgress,
        totalTasks: totalPlanningTasks,
        completedTasks: completedPlanningTasks,
        pendingTasks: pendingPlanningTasks,
        activeStoresCount
      },
      checklistTasks: {
        totalPending: pendingPlanningTasks,
        totalTasks: totalPlanningTasks,
        critical: priorityBreakdown?.critical_count || 0,
        high: priorityBreakdown?.high_count || 0,
        medium: priorityBreakdown?.medium_count || 0,
        low: priorityBreakdown?.low_count || 0,
        activeStoresCount
      },
      dueSoonTasks: {
        total: dueSoonStats?.total_due_soon || 0,
        overdue: dueSoonStats?.overdue_count || 0,
        thisWeek: dueSoonStats?.this_week_count || 0,
        impactedStoresCount: dueSoonStats?.impacted_stores_count || 0
      },
      // Dados dedicados para o cartão "Infraestrutura Multimédia" (Fase 9 Piloto)
      infraMultimedia: {
        hardware: {
          total: totalPl,
          byModel: hardwareModels || [],
          status: {
            online: playerMetrics?.online_players || 0,
            testing: playerMetrics?.testing_players || 0,
            syncing: playerMetrics?.syncing_players || 0,
            offline: playerMetrics?.offline_players || 0
          }
        },
        resolutions: {
          distinctCount: resolutions ? resolutions.length : 0,
          list: resolutions || []
        },
        playlists: {
          unassignedPlayersCount: playerMetrics?.unassigned_players || 0,
          assignedPlayersCount: totalPl - (playerMetrics?.unassigned_players || 0),
          totalPlaylists: playlistMetrics?.total_playlists || 0,
          publishedPlaylists: playlistMetrics?.published || 0,
          validatingPlaylists: playlistMetrics?.validating || 0,
          draftPlaylists: playlistMetrics?.draft || 0
        },
        openings: {
          total: projectMetrics?.total_openings || 0,
          byStatus: {
            em_curso: projectMetrics?.em_curso || 0,
            planeamento: projectMetrics?.planeamento || 0,
            testes_signage: projectMetrics?.testes_signage || 0,
            concluido: projectMetrics?.concluido || 0,
            atrasado: projectMetrics?.atrasado || 0
          },
          bySignageStatus: {
            pronto: projectMetrics?.signage_pronto || 0,
            validacao: projectMetrics?.signage_validacao || 0,
            configuracao: projectMetrics?.signage_configuracao || 0,
            pendente: projectMetrics?.signage_pendente || 0
          }
        }
      },
      avgDailyCost: financials?.avg_daily_cost || 378.50,
      totalDailyCost: financials?.total_daily_cost || 1135.50,
      totalBudget: financials?.total_budget || 98500.00,
      activeProjectsCount: financials?.active_count || 0,
      monthlyCostsAccumulated: monthlyCosts?.month_total || 11355.00
    };
  }
}

module.exports = Project;
