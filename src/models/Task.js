// ==============================================================================
// Modelo: Task (Marcos e Tarefas Técnicas de Abertura)
// Suporte ao Gabinete Multimédia, Redes/IT e Operações
// ==============================================================================

const db = require('../database/db');

class Task {
  // Lista todas as tarefas de um determinado projeto
  static async findByProject(projectId) {
    const sql = `
      SELECT 
        t.*,
        u.name as assigned_to_name
      FROM tasks t
      LEFT JOIN users u ON t.assigned_to = u.id
      WHERE t.project_id = ?
      ORDER BY 
        CASE t.priority 
          WHEN 'critical' THEN 1 
          WHEN 'high' THEN 2 
          WHEN 'medium' THEN 3 
          ELSE 4 
        END,
        t.due_date ASC,
        t.id ASC
    `;
    return db.query(sql, [projectId]);
  }

  // Obtém uma tarefa específica por ID
  static async findById(id) {
    const sql = `
      SELECT 
        t.*,
        u.name as assigned_to_name
      FROM tasks t
      LEFT JOIN users u ON t.assigned_to = u.id
      WHERE t.id = ?
    `;
    return db.get(sql, [id]);
  }

  // Cria uma nova tarefa associada a um projeto
  static async create(data) {
    const projectId = parseInt(data.project_id, 10);
    const department = data.department || 'Multimédia & Telas';
    const title = data.title.trim();
    const description = data.description ? data.description.trim() : '';
    const priority = data.priority || 'medium';
    const status = data.status || 'pendente';
    const dueDate = data.due_date || null;
    const assignedTo = data.assigned_to ? parseInt(data.assigned_to, 10) : 1;
    const completedAt = status === 'concluido' ? new Date().toISOString() : null;

    const insertSql = `
      INSERT INTO tasks (
        project_id, department, title, description,
        priority, status, due_date, assigned_to, completed_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const result = db.run(insertSql, [
      projectId, department, title, description,
      priority, status, dueDate, assignedTo, completedAt
    ]);

    return this.findById(result.lastInsertRowid);
  }

  // Atualiza os dados ou status de uma tarefa
  static async update(id, data) {
    const fields = [];
    const values = [];

    const allowed = ['department', 'title', 'description', 'priority', 'status', 'due_date', 'assigned_to'];

    for (const key of allowed) {
      if (data[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(data[key]);
      }
    }

    if (data.status !== undefined) {
      fields.push(`completed_at = ?`);
      values.push(data.status === 'concluido' ? new Date().toISOString() : null);
    }

    if (fields.length === 0) return this.findById(id);

    fields.push(`updated_at = ?`);
    values.push(new Date().toISOString());
    values.push(id);

    const updateSql = `UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`;
    db.run(updateSql, values);

    return this.findById(id);
  }

  // Alterna rapidamente o estado entre 'concluido' e 'pendente' / 'em_progresso'
  static async toggleStatus(id) {
    const task = await this.findById(id);
    if (!task) return null;

    const newStatus = task.status === 'concluido' ? 'pendente' : 'concluido';
    return this.update(id, { status: newStatus });
  }

  // Remove uma tarefa
  static async delete(id) {
    const result = db.run(`DELETE FROM tasks WHERE id = ?`, [id]);
    return result.changes > 0;
  }

  // Retorna estatísticas de tarefas de um projeto
  static async getStats(projectId) {
    const tasks = await this.findByProject(projectId);
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'concluido').length;
    const inProgress = tasks.filter(t => t.status === 'em_progresso').length;
    const pending = tasks.filter(t => t.status === 'pendente').length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      inProgress,
      pending,
      progress
    };
  }
}

module.exports = Task;
