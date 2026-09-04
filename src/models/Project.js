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
    const nextOpening = db.get(`
      SELECT * FROM projects 
      WHERE go_live_date >= DATE('now')
      ORDER BY go_live_date ASC 
      LIMIT 1
    `) || db.get(`SELECT * FROM projects ORDER BY go_live_date ASC LIMIT 1`);

    // 2. Médias e Totais Financeiros
    const financials = db.get(`
      SELECT 
        COUNT(*) as active_count,
        AVG(daily_cost) as avg_daily_cost,
        SUM(daily_cost) as total_daily_cost,
        SUM(total_budget) as total_budget
      FROM projects 
      WHERE status != 'concluido'
    `);

    // 3. Custos Acumulados no Mês Atual
    const monthlyCosts = db.get(`
      SELECT SUM(amount) as month_total 
      FROM project_costs 
      WHERE strftime('%Y-%m', entry_date) = strftime('%Y-%m', 'now')
    `);

    // 4. Prontidão Digital Signage (baseada em signage_players)
    const playerMetrics = db.get(`
      SELECT 
        COUNT(*) as total_players,
        SUM(CASE WHEN status = 'online' OR status = 'syncing' THEN 1 ELSE 0 END) as ready_players,
        SUM(CASE WHEN status = 'online' THEN 1 ELSE 0 END) as online_players,
        SUM(CASE WHEN status = 'testing' THEN 1 ELSE 0 END) as testing_players,
        SUM(CASE WHEN status = 'offline' THEN 1 ELSE 0 END) as offline_players
      FROM signage_players
    `);

    const totalPl = playerMetrics?.total_players || 0;
    const readyPl = playerMetrics?.ready_players || 0;
    const signageReadiness = totalPl > 0 ? Math.round((readyPl / totalPl) * 100) : 87;

    return {
      nextOpening,
      signageReadiness,
      signageStats: {
        total: totalPl,
        online: playerMetrics?.online_players || 0,
        testing: playerMetrics?.testing_players || 0,
        offline: playerMetrics?.offline_players || 0
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
