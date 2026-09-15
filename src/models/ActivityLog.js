// ==============================================================================
// Modelo: ActivityLog (Registo e Auditoria de Atividades Operacionais em Tempo Real)
// Gabinete Multimédia (Fnac / Darty)
// ==============================================================================

const db = require('../database/db');

class ActivityLog {
  // Regista uma nova atividade no sistema
  static async log({
    action_type = 'info',
    title,
    description = '',
    project_id = null,
    project_name = null,
    user_id = null,
    user_name = 'Gabinete Multimédia',
    icon_type = 'info'
  }) {
    if (!title || !title.trim()) return null;

    try {
      let finalProjectName = project_name;
      const finalProjectId = (project_id !== null && project_id !== undefined && project_id !== '' && !isNaN(project_id))
        ? parseInt(project_id, 10)
        : null;

      if (finalProjectId && !finalProjectName) {
        const proj = db.get('SELECT name FROM projects WHERE id = ?;', [finalProjectId]);
        if (proj) finalProjectName = proj.name;
      }

      const sql = `
        INSERT INTO activity_logs (
          action_type, title, description, project_id, project_name, user_id, user_name, icon_type, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP);
      `;

      const result = db.run(sql, [
        action_type,
        title.trim(),
        description ? description.trim() : '',
        finalProjectId,
        finalProjectName,
        user_id ? parseInt(user_id, 10) : null,
        user_name || 'Gabinete Multimédia',
        icon_type || 'info'
      ]);

      return this.findById(result.lastInsertRowid);
    } catch (err) {
      console.error('[ActivityLog.log Error]', err.message);
      return null;
    }
  }

  // Procura atividade por ID
  static async findById(id) {
    try {
      return db.get('SELECT * FROM activity_logs WHERE id = ?;', [id]);
    } catch (err) {
      console.error('[ActivityLog.findById Error]', err.message);
      return null;
    }
  }

  // Retorna as atividades mais recentes com limite configurável
  static async getRecent(limit = 15) {
    try {
      const num = Math.min(Math.max(parseInt(limit, 10) || 15, 1), 50);
      const sql = `
        SELECT 
          id,
          action_type,
          title,
          description,
          project_id,
          project_name,
          user_id,
          user_name,
          icon_type,
          created_at,
          strftime('%Y-%m-%dT%H:%M:%SZ', created_at) as created_at_iso
        FROM activity_logs
        ORDER BY id DESC
        LIMIT ?;
      `;
      return db.query(sql, [num]);
    } catch (err) {
      console.error('[ActivityLog.getRecent Error]', err.message);
      return [];
    }
  }
}

module.exports = ActivityLog;
