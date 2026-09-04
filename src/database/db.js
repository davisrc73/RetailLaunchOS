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

initSchema();

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
