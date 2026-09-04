// ==============================================================================
// Configuração da Base de Dados (SQLite / PostgreSQL)
// ==============================================================================

const path = require('path');

module.exports = {
  dialect: process.env.DB_DIALECT || 'sqlite',
  sqlite: {
    storage: process.env.DB_STORAGE || path.resolve(__dirname, '../database/retaillaunch.sqlite'),
  },
  postgres: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'retaillaunch_db',
    user: process.env.DB_USER || 'retaillaunch_user',
    password: process.env.DB_PASSWORD || '',
  }
};
