// ==============================================================================
// RetailLaunchOS - Módulo Central de Base de Dados SQLite
// Utiliza o motor nativo e de alta performance node:sqlite (Node.js 22+)
// ==============================================================================

const { DatabaseSync } = require('node:sqlite');
const fs = require('fs');
const path = require('path');
const config = require('../../config/database');

const dbDir = path.resolve(__dirname, '../../database');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = config.sqlite?.storage || path.join(dbDir, 'retaillaunch.sqlite');
const isNewDb = !fs.existsSync(dbPath);

let db = new DatabaseSync(dbPath);

function applyPragmas(targetDb) {
  try {
    targetDb.exec('PRAGMA foreign_keys = ON;');
    targetDb.exec('PRAGMA journal_mode = WAL;');
  } catch (err) {
    console.warn('[DB Warning] Não foi possível ativar PRAGMAs:', err.message);
  }
}

applyPragmas(db);

// Auto-bootstrap: Se a tabela projects não existir, executa o schema.sql inicial
function initSchema() {
  try {
    const projectsTable = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='projects';").get();
    const playlistsTable = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='playlists';").get();
    const signageTable = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='signage_players';").get();

    if (!projectsTable || !playlistsTable || !signageTable) {
      console.log('🔄 [DB] A sincronizar estrutura de tabelas a partir de database/schema.sql...');
      const schemaPath = path.join(dbDir, 'schema.sql');
      if (fs.existsSync(schemaPath)) {
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        db.exec(schemaSql);
        console.log('✅ [DB] Estrutura e sementes da base de dados sincronizadas com sucesso!');
      } else {
        console.error('❌ [DB] Ficheiro schema.sql não encontrado em:', schemaPath);
      }
    } else {
      // Garantir que todos os 4 utilizadores semente padrão existem
      const userCount = db.prepare("SELECT COUNT(*) as count FROM users;").get()?.count || 0;
      if (userCount < 4) {
        console.log('🔄 [DB] A sincronizar utilizadores semente do sistema...');
        const schemaPath = path.join(dbDir, 'schema.sql');
        if (fs.existsSync(schemaPath)) {
          const schemaSql = fs.readFileSync(schemaPath, 'utf8');
          db.exec(schemaSql);
        }
      }
    }
  } catch (error) {
    console.error('❌ [DB Error] Erro ao inicializar esquema:', error.message);
  }
}

// Migração transparente Fase 8: Torna project_id opcional no catálogo de hardware
function migrateSchema() {
  try {
    const tableCheck = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='signage_players';").get();
    if (!tableCheck) return;

    const tableInfo = db.prepare("PRAGMA table_info(signage_players);").all();
    const projectIdCol = tableInfo.find(c => c.name === 'project_id');
    if (projectIdCol && projectIdCol.notnull === 1) {
      console.log('🔄 [DB Migration] A migrar signage_players: tornando project_id opcional (NULL) para catálogo global...');
      db.exec('PRAGMA foreign_keys = OFF;');
      db.exec(`
        CREATE TABLE signage_players_fase8_tmp (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          project_id INTEGER,
          name VARCHAR(150) NOT NULL,
          device_model VARCHAR(100) DEFAULT 'BrightSign XT1144 4K',
          zone_location VARCHAR(100) NOT NULL,
          resolution VARCHAR(50) DEFAULT '4K UHD',
          ip_address VARCHAR(45),
          mac_address VARCHAR(20),
          status VARCHAR(30) DEFAULT 'online',
          playlist_id INTEGER,
          current_firmware VARCHAR(50) DEFAULT 'v9.0.145',
          last_ping TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,
          FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE SET NULL
        );
        INSERT INTO signage_players_fase8_tmp (id, project_id, name, device_model, zone_location, resolution, ip_address, mac_address, status, playlist_id, current_firmware, last_ping, created_at, updated_at)
          SELECT id, project_id, name, device_model, zone_location, resolution, ip_address, mac_address, status, playlist_id, current_firmware, last_ping, created_at, updated_at FROM signage_players;
        DROP TABLE signage_players;
        ALTER TABLE signage_players_fase8_tmp RENAME TO signage_players;
        CREATE INDEX IF NOT EXISTS idx_signage_project ON signage_players(project_id);
        CREATE INDEX IF NOT EXISTS idx_signage_status ON signage_players(status);
      `);
      db.exec('PRAGMA foreign_keys = ON;');
      console.log('✅ [DB Migration] Migração de signage_players concluída com sucesso!');
    }
  } catch (err) {
    console.error('❌ [DB Migration Error] Erro ao migrar signage_players:', err.message);
  }
}

// Migração transparente Fase 11: Criação e sementes da tabela system_parameters
function migrateSystemParameters() {
  try {
    const tableCheck = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='system_parameters';").get();
    if (!tableCheck) {
      console.log('🔄 [DB Migration] A criar tabela system_parameters para gestão de modelos, zonas e resoluções...');
      db.exec(`
        CREATE TABLE IF NOT EXISTS system_parameters (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            category VARCHAR(50) NOT NULL,
            name VARCHAR(150) NOT NULL,
            description VARCHAR(255),
            display_order INTEGER DEFAULT 0,
            is_active INTEGER DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(category, name)
        );
        CREATE INDEX IF NOT EXISTS idx_sys_params_cat ON system_parameters(category);
        CREATE INDEX IF NOT EXISTS idx_sys_params_active ON system_parameters(is_active);

        INSERT OR IGNORE INTO system_parameters (category, name, description, display_order) VALUES
        ('hardware_model', 'BrightSign XT1144 4K', 'Player Industrial UHD com suporte a dual video decoding e HTML5 avançado', 1),
        ('hardware_model', 'BrightSign HD224', 'Player Full HD de entrada para totens e displays pontuais', 2),
        ('hardware_model', 'Samsung SSP (Tizen 6.5)', 'SoC Integrado em telas profissionais Samsung SMART Signage', 3),
        ('hardware_model', 'LG webOS Signage 6.0', 'SoC Integrado em painéis e monitores comerciais LG', 4),
        ('hardware_model', 'Philips D-Line Android', 'Display profissional com Android OS integrado', 5),
        ('hardware_model', 'Display Android Genérico', 'Player ou TV Box Android para projetos pilotos e sinalética auxiliar', 6),
        ('hardware_model', 'Mini PC Windows / Linux', 'Computador compacto dedicado para renderização de aplicações interativas', 7),
        
        ('zone_location', 'Entrada Principal', 'Área nobre de acesso e impacto visual imediato do cliente', 1),
        ('zone_location', 'Montra Lateral', 'Exposição para o exterior ou corredor do centro comercial', 2),
        ('zone_location', 'Fachada Principal', 'Painel ou ecrã de grande formato visível no exterior', 3),
        ('zone_location', 'Linha de Caixas', 'Telas de comunicação de campanhas, fidelização e Clube Fnac', 4),
        ('zone_location', 'Balcão de Apoio / Serviços', 'Atendimento pós-venda, entregas e suporte técnico', 5),
        ('zone_location', 'Fórum Cultural / Bilheteira', 'Divulgação de eventos, lançamentos de livros e bilheteira', 6),
        ('zone_location', 'Zona Café / Lounge', 'Área de permanência e degustação dentro do espaço de loja', 7),

        ('resolution', '4K UHD (3840x2160)', 'Ultra Alta Definição 16:9 para video walls e telas principais', 1),
        ('resolution', 'FHD 1080p (1920x1080)', 'Full HD Horizontal padrão para montras e displays interativos', 2),
        ('resolution', 'HD 720p (1280x720)', 'Alta Definição para displays compactos de balcão', 3),
        ('resolution', 'Video Wall LED', 'Painel modular LED com resolução e proporção personalizadas', 4),
        ('resolution', 'Formato Vertical 9:16 (1080x1920)', 'Orientação Portrait para totens e colunas de loja', 5),
        ('resolution', 'Ultra-Stretch (3840x600)', 'Display panorâmico esticado para topos de gôndola e caixas', 6);
      `);
      console.log('✅ [DB Migration] Tabela system_parameters e sementes iniciais criadas com sucesso!');
    }
  } catch (err) {
    console.error('❌ [DB Migration Error] Erro ao criar system_parameters:', err.message);
  }
}

// Migração transparente Fase 14: Adiciona coluna serial_number em signage_players
function migrateSignageSerial() {
  try {
    const tableCheck = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='signage_players';").get();
    if (!tableCheck) return;

    const tableInfo = db.prepare("PRAGMA table_info(signage_players);").all();
    const hasSerial = tableInfo.some(c => c.name === 'serial_number');

    if (!hasSerial) {
      console.log('🔄 [DB Migration] A adicionar coluna serial_number em signage_players...');
      db.exec('ALTER TABLE signage_players ADD COLUMN serial_number VARCHAR(100);');
      db.exec('CREATE INDEX IF NOT EXISTS idx_signage_serial ON signage_players(serial_number);');

      // Preencher seriais nos equipamentos semente caso estejam a NULL
      db.exec(`
        UPDATE signage_players SET serial_number = 'SN-BS4K-2026-001' WHERE id = 1 AND (serial_number IS NULL OR serial_number = '');
        UPDATE signage_players SET serial_number = 'SN-SMG-TIZ-881' WHERE id = 2 AND (serial_number IS NULL OR serial_number = '');
        UPDATE signage_players SET serial_number = 'SN-BSHD-2026-042' WHERE id = 3 AND (serial_number IS NULL OR serial_number = '');
        UPDATE signage_players SET serial_number = 'SN-SMG-TIZ-902' WHERE id = 4 AND (serial_number IS NULL OR serial_number = '');
        UPDATE signage_players SET serial_number = 'SN-BS4K-2026-015' WHERE id = 5 AND (serial_number IS NULL OR serial_number = '');
        UPDATE signage_players SET serial_number = 'SN-LGW-2026-104' WHERE id = 6 AND (serial_number IS NULL OR serial_number = '');
      `);
      console.log('✅ [DB Migration] Coluna serial_number criada e sementes atualizadas com sucesso!');
    }
  } catch (err) {
    console.error('❌ [DB Migration Error] Erro ao migrar serial_number:', err.message);
  }
}

// Migração transparente Fase 14: Criação da tabela activity_logs e sementes iniciais
function migrateActivityLogs() {
  try {
    const tableCheck = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='activity_logs';").get();
    if (!tableCheck) {
      console.log('🔄 [DB Migration] A criar tabela activity_logs para auditoria de atividade em tempo real...');
      db.exec(`
        CREATE TABLE IF NOT EXISTS activity_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            action_type VARCHAR(50) NOT NULL,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            project_id INTEGER,
            project_name VARCHAR(150),
            user_id INTEGER,
            user_name VARCHAR(150) DEFAULT 'Gabinete Multimédia',
            icon_type VARCHAR(50) DEFAULT 'info',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
        );
        CREATE INDEX IF NOT EXISTS idx_activity_created ON activity_logs(created_at DESC);
        CREATE INDEX IF NOT EXISTS idx_activity_action ON activity_logs(action_type);
        CREATE INDEX IF NOT EXISTS idx_activity_project ON activity_logs(project_id);
      `);
      console.log('✅ [DB Migration] Tabela activity_logs criada com sucesso!');
    }

    // Inicializar registos históricos se estiver vazia
    const count = db.prepare('SELECT COUNT(*) as count FROM activity_logs;').get()?.count || 0;
    if (count === 0) {
      console.log('🔄 [DB Seed] A inicializar registos históricos de atividade recente...');
      const insertStmt = db.prepare(`
        INSERT INTO activity_logs (action_type, title, description, project_id, project_name, user_name, icon_type, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?);
      `);

      // 1. Players instalados
      const players = db.prepare(`
        SELECT sp.name, sp.device_model, sp.zone_location, sp.serial_number, p.id as project_id, p.name as project_name
        FROM signage_players sp
        JOIN projects p ON sp.project_id = p.id
        ORDER BY sp.id ASC LIMIT 3;
      `).all() || [];

      for (const p of players) {
        const serialTag = p.serial_number ? ` [ID/Serial: ${p.serial_number}]` : '';
        insertStmt.run(
          'player_created',
          `Equipamento Multimédia Instalado: ${p.name}`,
          `${p.name}${serialTag} (${p.device_model}) operacional na zona ${p.zone_location}.`,
          p.project_id,
          p.project_name,
          'Gabinete Multimédia',
          'hardware',
          new Date(Date.now() - 25 * 60 * 1000).toISOString()
        );
      }

      // 2. Custos recentes
      const costs = db.prepare(`
        SELECT c.amount, c.description, c.entry_date, p.id as project_id, p.name as project_name
        FROM project_costs c
        JOIN projects p ON c.project_id = p.id
        ORDER BY c.id DESC LIMIT 2;
      `).all() || [];

      for (const c of costs) {
        insertStmt.run(
          'cost_logged',
          `Lançamento Orçamental: € ${parseFloat(c.amount).toFixed(2).replace('.', ',')}`,
          `${c.description || 'Despesa técnica'} imputada ao projeto ${c.project_name}.`,
          c.project_id,
          c.project_name,
          'Admin Multimédia',
          'cost',
          new Date(Date.now() - 2 * 3600 * 1000).toISOString()
        );
      }

      // 3. Tarefas concluídas
      const tasks = db.prepare(`
        SELECT t.title, t.department, p.id as project_id, p.name as project_name
        FROM tasks t
        JOIN projects p ON t.project_id = p.id
        WHERE t.status = 'concluido'
        LIMIT 2;
      `).all() || [];

      for (const t of tasks) {
        insertStmt.run(
          'task_completed',
          `Marco Concluído: ${t.title}`,
          `Validação técnica do departamento ${t.department} finalizada em ${t.project_name}.`,
          t.project_id,
          t.project_name,
          'Técnico Digital Signage',
          'success',
          new Date(Date.now() - 18 * 3600 * 1000).toISOString()
        );
      }

      // 4. Criação de Lojas
      const projects = db.prepare(`
        SELECT id, name, brand, store_format FROM projects ORDER BY id ASC LIMIT 2;
      `).all() || [];

      for (const pr of projects) {
        insertStmt.run(
          'project_created',
          `Nova Abertura em Planeamento: ${pr.name}`,
          `Abertura de loja formato ${pr.store_format} da insígnia ${pr.brand} registada no ecossistema.`,
          pr.id,
          pr.name,
          'Direção de Expansão',
          'project',
          new Date(Date.now() - 48 * 3600 * 1000).toISOString()
        );
      }

      console.log('✅ [DB Seed] Feed inicial de atividade recente populado com sucesso!');
    }
  } catch (err) {
    console.error('❌ [DB Migration Error] Erro ao criar activity_logs:', err.message);
  }
}

// Migração transparente Fase 16: Remove colunas legadas ip_address e mac_address de signage_players
function migrateRemoveNetworkFields() {
  try {
    const tableCheck = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='signage_players';").get();
    if (!tableCheck) return;

    const tableInfo = db.prepare("PRAGMA table_info(signage_players);").all();
    const hasIp = tableInfo.some(c => c.name === 'ip_address');
    const hasMac = tableInfo.some(c => c.name === 'mac_address');

    if (hasIp) {
      console.log('🔄 [DB Migration] A remover coluna legada ip_address de signage_players...');
      try {
        db.exec('ALTER TABLE signage_players DROP COLUMN ip_address;');
        console.log('✅ [DB Migration] Coluna ip_address removida com sucesso!');
      } catch (dropErr) {
        console.warn('[DB Migration Warning] Não foi possível executar DROP COLUMN ip_address:', dropErr.message);
      }
    }

    if (hasMac) {
      console.log('🔄 [DB Migration] A remover coluna legada mac_address de signage_players...');
      try {
        db.exec('ALTER TABLE signage_players DROP COLUMN mac_address;');
        console.log('✅ [DB Migration] Coluna mac_address removida com sucesso!');
      } catch (dropErr) {
        console.warn('[DB Migration Warning] Não foi possível executar DROP COLUMN mac_address:', dropErr.message);
      }
    }
  } catch (err) {
    console.error('❌ [DB Migration Error] Erro ao remover colunas legadas de rede:', err.message);
  }
}

initSchema();
migrateSchema();
migrateSystemParameters();
migrateSignageSerial();
migrateActivityLogs();
migrateRemoveNetworkFields();


function checkpointWal() {
  try {
    db.exec('PRAGMA wal_checkpoint(TRUNCATE);');
    return true;
  } catch (err) {
    console.error('[DB Checkpoint Error]', err.message);
    return false;
  }
}

function reloadConnection() {
  try {
    try {
      db.close();
    } catch (closeErr) {
      // Ignorar se a ligação já estiver fechada
    }
    db = new DatabaseSync(dbPath);
    applyPragmas(db);
    initSchema();
    migrateSchema();
    migrateSystemParameters();
    migrateSignageSerial();
    migrateActivityLogs();
    migrateRemoveNetworkFields();
    console.log('✅ [DB] Ligação à base de dados recarregada e esquemas verificados com sucesso!');
    return true;
  } catch (err) {
    console.error('[DB Reload Connection Error]', err.message);
    throw err;
  }
}

function getDatabaseStats() {
  checkpointWal();
  const exists = fs.existsSync(dbPath);
  const stats = exists ? fs.statSync(dbPath) : { size: 0, mtime: new Date() };
  let projectsCount = 0;
  let tasksCount = 0;
  let playersCount = 0;
  let usersCount = 0;

  try {
    projectsCount = db.prepare('SELECT COUNT(*) as c FROM projects').get()?.c || 0;
    tasksCount = db.prepare('SELECT COUNT(*) as c FROM tasks').get()?.c || 0;
    playersCount = db.prepare('SELECT COUNT(*) as c FROM signage_players').get()?.c || 0;
    usersCount = db.prepare('SELECT COUNT(*) as c FROM users').get()?.c || 0;
  } catch (e) {
    // Ignorar erro se tabelas estiverem em transição
  }

  return {
    path: dbPath,
    filename: path.basename(dbPath),
    sizeBytes: stats.size,
    sizeFormatted: (stats.size / 1024).toFixed(1) + ' KB',
    lastModified: stats.mtime,
    projectsCount,
    tasksCount,
    playersCount,
    usersCount
  };
}

module.exports = {
  get db() {
    return db;
  },
  dbPath,
  dbDir,
  checkpointWal,
  reloadConnection,
  getDatabaseStats,
  // Executa uma consulta que retorna múltiplos registos
  query: (sql, params = []) => {
    try {
      const stmt = db.prepare(sql);
      return params.length > 0 ? stmt.all(...params) : stmt.all();
    } catch (error) {
      console.error('[DB Query Error]', sql, error.message);
      throw error;
    }
  },
  // Executa uma consulta que retorna um único registo
  get: (sql, params = []) => {
    try {
      const stmt = db.prepare(sql);
      return params.length > 0 ? stmt.get(...params) : stmt.get();
    } catch (error) {
      console.error('[DB Get Error]', sql, error.message);
      throw error;
    }
  },
  // Executa um comando INSERT/UPDATE/DELETE e retorna { changes, lastInsertRowid }
  run: (sql, params = []) => {
    try {
      const stmt = db.prepare(sql);
      return params.length > 0 ? stmt.run(...params) : stmt.run();
    } catch (error) {
      console.error('[DB Run Error]', sql, error.message);
      throw error;
    }
  },
  // Executa um bloco de comandos SQL sem parâmetros
  exec: (sql) => {
    return db.exec(sql);
  }
};
