// ==============================================================================
// RetailLaunchOS - Controlador de Base de Dados & Migração (Backup & Restore)
// Gabinete Multimédia | Fnac & Darty
// ==============================================================================

const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');
const dbModule = require('../database/db');

class DatabaseController {
  /**
   * Retorna estatísticas operacionais da base de dados ativa
   * GET /api/v1/database/info
   */
  static async getInfo(req, res) {
    try {
      const stats = dbModule.getDatabaseStats();
      return res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('[DatabaseController.getInfo Error]', error.message);
      return res.status(500).json({
        success: false,
        message: 'Erro ao obter estatísticas da base de dados: ' + error.message
      });
    }
  }

  /**
   * Descarrega o ficheiro SQLite consolidado para backup ou migração
   * GET /api/v1/database/backup
   */
  static async backup(req, res) {
    try {
      dbModule.checkpointWal();
      const dbPath = dbModule.dbPath;

      if (!fs.existsSync(dbPath)) {
        return res.status(404).json({
          success: false,
          message: 'Ficheiro de base de dados não encontrado no servidor.'
        });
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `retaillaunch_backup_${timestamp}.sqlite`;

      res.setHeader('Content-Type', 'application/vnd.sqlite3');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');

      const stream = fs.createReadStream(dbPath);
      stream.on('error', (err) => {
        console.error('[DatabaseController.backup Stream Error]', err.message);
        if (!res.headersSent) {
          res.status(500).json({ success: false, message: 'Erro ao transferir ficheiro: ' + err.message });
        }
      });

      return stream.pipe(res);
    } catch (error) {
      console.error('[DatabaseController.backup Error]', error.message);
      return res.status(500).json({
        success: false,
        message: 'Erro ao processar backup da base de dados: ' + error.message
      });
    }
  }

  /**
   * Restaura/Migra um ficheiro SQLite enviado pelo utilizador
   * POST /api/v1/database/restore
   */
  static async restore(req, res) {
    let tempPath = null;
    try {
      let rawBuffer = req.bodyBuffer;

      if (!rawBuffer || rawBuffer.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Nenhum ficheiro recebido no pedido de restauro.'
        });
      }

      // Suporte a multipart/form-data ou octet-stream direto:
      // Procurar pela assinatura SQLite nos primeiros bytes
      const sqliteMagic = Buffer.from('SQLite format 3\0');
      let sqliteStartIndex = rawBuffer.indexOf(sqliteMagic);

      if (sqliteStartIndex === -1) {
        return res.status(400).json({
          success: false,
          message: 'Ficheiro inválido: Não foi detetado o cabeçalho oficial de base de dados SQLite 3.'
        });
      }

      let sqliteData = rawBuffer;
      if (sqliteStartIndex > 0) {
        // Foi enviado via multipart/form-data com headers antes do binário
        const boundaryIndex = rawBuffer.indexOf('\r\n--', sqliteStartIndex);
        if (boundaryIndex !== -1) {
          sqliteData = rawBuffer.subarray(sqliteStartIndex, boundaryIndex);
        } else {
          sqliteData = rawBuffer.subarray(sqliteStartIndex);
        }
      }

      if (sqliteData.length < 512) {
        return res.status(400).json({
          success: false,
          message: 'Ficheiro demasiado pequeno para ser uma base de dados SQLite válida.'
        });
      }

      const dbPath = dbModule.dbPath;
      const dbDir = dbModule.dbDir;
      tempPath = path.join(dbDir, `retaillaunch_restore_${Date.now()}.tmp`);

      // Escrever temporariamente para validação prévia
      fs.writeFileSync(tempPath, sqliteData);

      // Validação de Integridade estrutural da base de dados enviada
      let testDb = null;
      try {
        testDb = new DatabaseSync(tempPath);
        const projectsTable = testDb.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='projects';").get();
        const usersTable = testDb.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='users';").get();

        if (!projectsTable || !usersTable) {
          throw new Error('A base de dados enviada não contém as tabelas essenciais (projects e users).');
        }
        testDb.close();
        testDb = null;
      } catch (validationErr) {
        if (testDb) {
          try { testDb.close(); } catch (e) {}
        }
        if (fs.existsSync(tempPath)) {
          fs.unlinkSync(tempPath);
        }
        return res.status(400).json({
          success: false,
          message: 'Falha na validação da base de dados: ' + validationErr.message
        });
      }

      // Criar cópia de segurança de segurança (.bak) da base de dados atual antes de substituir
      if (fs.existsSync(dbPath)) {
        try {
          dbModule.checkpointWal();
          fs.copyFileSync(dbPath, dbPath + '.bak');
        } catch (bakErr) {
          console.warn('[DB Backup Warning] Não foi possível criar .bak antes do restauro:', bakErr.message);
        }
      }

      // Fechar ligação atual e remover ficheiros auxiliares WAL/SHM
      const walPath = dbPath + '-wal';
      const shmPath = dbPath + '-shm';

      if (fs.existsSync(walPath)) {
        try { fs.unlinkSync(walPath); } catch (e) {}
      }
      if (fs.existsSync(shmPath)) {
        try { fs.unlinkSync(shmPath); } catch (e) {}
      }

      // Substituir ficheiro principal pelo temporário validado
      fs.copyFileSync(tempPath, dbPath);
      fs.unlinkSync(tempPath);
      tempPath = null;

      // Recarregar ligação e esquemas
      dbModule.reloadConnection();
      const newStats = dbModule.getDatabaseStats();

      console.log(`🎉 [DB Migration] Base de dados restaurada com sucesso! Lojas: ${newStats.projectsCount}, Tarefas: ${newStats.tasksCount}`);

      return res.status(200).json({
        success: true,
        message: 'Base de dados restaurada e sincronizada com sucesso!',
        data: newStats
      });
    } catch (error) {
      console.error('[DatabaseController.restore Error]', error.message);
      if (tempPath && fs.existsSync(tempPath)) {
        try { fs.unlinkSync(tempPath); } catch (e) {}
      }
      try {
        dbModule.reloadConnection();
      } catch (e) {}

      return res.status(500).json({
        success: false,
        message: 'Erro interno durante o restauro da base de dados: ' + error.message
      });
    }
  }
}

module.exports = DatabaseController;
