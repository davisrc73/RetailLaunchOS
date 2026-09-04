// ==============================================================================
// Controller: Gestão de Custos e Diárias Técnicas
// Gabinete Multimédia (Fnac / Darty)
// ==============================================================================

const Cost = require('../models/Cost');
const Project = require('../models/Project');

const costController = {
  // Lista todos os custos e sumário orçamental de um projeto
  getByProject: async (req, res) => {
    try {
      const { projectId } = req.params;
      const summary = await Cost.getProjectFinancialSummary(projectId);
      if (!summary) {
        return res.status(404).json({ success: false, message: 'Projeto não encontrado' });
      }
      return res.status(200).json({
        success: true,
        data: summary
      });
    } catch (error) {
      console.error('[costController.getByProject]', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // Regista uma nova despesa ou diária técnica
  create: async (req, res) => {
    try {
      const { projectId } = req.params;
      const { entry_date, cost_type, amount, description } = req.body || {};

      if (!amount || parseFloat(amount) <= 0) {
        return res.status(400).json({ success: false, message: 'O valor do custo deve ser superior a zero.' });
      }

      const newCost = await Cost.create({
        project_id: projectId,
        entry_date: entry_date || new Date().toISOString().split('T')[0],
        cost_type: cost_type || 'outro',
        amount: parseFloat(amount),
        description: description || ''
      });

      const updatedSummary = await Cost.getProjectFinancialSummary(projectId);

      return res.status(201).json({
        success: true,
        message: 'Custo registado com sucesso!',
        summary: updatedSummary,
        data: newCost
      });
    } catch (error) {
      console.error('[costController.create]', error);
      return res.status(400).json({ success: false, message: error.message });
    }
  },

  // Remove um registo de custo
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const cost = await Cost.findById(id);
      if (!cost) {
        return res.status(404).json({ success: false, message: 'Registo de custo não encontrado' });
      }

      const projectId = cost.project_id;
      await Cost.delete(id);
      const updatedSummary = await Cost.getProjectFinancialSummary(projectId);

      return res.status(200).json({
        success: true,
        message: 'Registo de custo removido com sucesso',
        summary: updatedSummary
      });
    } catch (error) {
      console.error('[costController.delete]', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // Retorna sumário financeiro global consolidado
  getGlobalSummary: async (req, res) => {
    try {
      const summary = await Cost.getGlobalSummary();
      return res.status(200).json({ success: true, data: summary });
    } catch (error) {
      console.error('[costController.getGlobalSummary]', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }
};

module.exports = costController;
