// ==============================================================================
// Modelo: Cost (Registo de Custos e Diárias de Projetos)
// Acompanhamento financeiro para o Gabinete Multimédia
// ==============================================================================

const db = require('../database/db');

class Cost {
  // Lista todos os custos de um determinado projeto
  static async findByProject(projectId) {
    const sql = `
      SELECT 
        c.*,
        u.name as logged_by_name
      FROM project_costs c
      LEFT JOIN users u ON c.logged_by = u.id
      WHERE c.project_id = ?
      ORDER BY c.entry_date DESC, c.id DESC
    `;
    return db.query(sql, [projectId]);
  }

  // Obtém um custo específico por ID
  static async findById(id) {
    const sql = `
      SELECT 
        c.*,
        u.name as logged_by_name
      FROM project_costs c
      LEFT JOIN users u ON c.logged_by = u.id
      WHERE c.id = ?
    `;
    return db.get(sql, [id]);
  }

  // Cria um novo registo de custo / diária
  static async create(data) {
    const projectId = parseInt(data.project_id, 10);
    const entryDate = data.entry_date || new Date().toISOString().split('T')[0];
    const costType = data.cost_type || 'outro';
    const amount = parseFloat(data.amount) || 0;
    const description = data.description ? data.description.trim() : '';
    const loggedBy = data.logged_by ? parseInt(data.logged_by, 10) : 1;

    const insertSql = `
      INSERT INTO project_costs (
        project_id, entry_date, cost_type, amount, description, logged_by
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;

    const result = db.run(insertSql, [
      projectId, entryDate, costType, amount, description, loggedBy
    ]);

    return this.findById(result.lastInsertRowid);
  }

  // Remove um registo de custo
  static async delete(id) {
    const result = db.run(`DELETE FROM project_costs WHERE id = ?`, [id]);
    return result.changes > 0;
  }

  // Retorna o sumário financeiro detalhado de uma loja específica
  static async getProjectFinancialSummary(projectId) {
    const project = db.get(`SELECT id, name, brand, total_budget, daily_cost FROM projects WHERE id = ?`, [projectId]);
    if (!project) return null;

    const costs = await this.findByProject(projectId);
    const totalSpent = costs.reduce((acc, c) => acc + (c.amount || 0), 0);
    const totalBudget = project.total_budget || 0;
    const remainingBudget = totalBudget - totalSpent;
    const budgetExecutionPercent = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

    // Agrupamento por tipo de custo
    const costsByType = {};
    costs.forEach(c => {
      costsByType[c.cost_type] = (costsByType[c.cost_type] || 0) + c.amount;
    });

    return {
      projectId: project.id,
      projectName: project.name,
      totalBudget,
      totalSpent,
      remainingBudget,
      budgetExecutionPercent,
      dailyCostConfigured: project.daily_cost,
      entriesCount: costs.length,
      costsByType,
      costs
    };
  }

  // Retorna o sumário financeiro consolidado de todo o sistema
  static async getGlobalSummary() {
    const totals = db.get(`
      SELECT 
        COUNT(DISTINCT project_id) as projects_with_costs,
        SUM(amount) as total_spent,
        AVG(amount) as avg_cost_entry
      FROM project_costs
    `);

    const monthlyCosts = db.get(`
      SELECT SUM(amount) as month_total 
      FROM project_costs 
      WHERE strftime('%Y-%m', entry_date) = strftime('%Y-%m', 'now')
    `);

    const typeDistribution = db.query(`
      SELECT cost_type, SUM(amount) as total_amount, COUNT(*) as entries_count
      FROM project_costs
      GROUP BY cost_type
      ORDER BY total_amount DESC
    `);

    return {
      totalSpent: totals?.total_spent || 0,
      monthlyTotal: monthlyCosts?.month_total || 0,
      typeDistribution
    };
  }
}

module.exports = Cost;
