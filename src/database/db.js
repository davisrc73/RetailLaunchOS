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

const db = new DatabaseSync(dbPath);

// Ativar suporte a chaves estrangeiras e modo WAL para concorrência
try {
  db.exec('PRAGMA foreign_keys = ON;');
  db.exec('PRAGMA journal_mode = WAL;');
} catch (err) {
  console.warn('[DB Warning] Não foi possível ativar PRAGMAs:', err.message);
}

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

initSchema();
migrateSchema();
migrateSystemParameters();


module.exports = {
  db,
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
