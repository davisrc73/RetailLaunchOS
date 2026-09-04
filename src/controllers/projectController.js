// ==============================================================================
// Controller: Gestão de Projetos e Aberturas (Fnac/Darty)
// Gabinete Multimédia - Camada de Controlo REST
// ==============================================================================

const Project = require('../models/Project');

const projectController = {
  // Lista todos os projetos piloto e aberturas em curso
  getAll: async (req, res) => {
    try {
      const { brand, status } = req.query || {};
      const projects = await Project.findAll({ brand, status });
      return res.status(200).json({
        success: true,
        count: projects.length,
        data: projects
      });
    } catch (error) {
      console.error('[projectController.getAll]', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // Obtém detalhes de um projeto específico por ID ou código (ex: FNAC-CAS-2026)
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const project = await Project.findById(id);
      if (!project) {
        return res.status(404).json({ success: false, message: 'Projeto de abertura não encontrado' });
      }
      return res.status(200).json({ success: true, data: project });
    } catch (error) {
      console.error('[projectController.getById]', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // Criação de nova abertura de loja
  create: async (req, res) => {
    try {
      const { name, go_live_date } = req.body || {};
      if (!name || !name.trim()) {
        return res.status(400).json({ success: false, message: 'O nome da loja é obrigatório.' });
      }
      if (!go_live_date) {
        return res.status(400).json({ success: false, message: 'A data prevista de go-live é obrigatória.' });
      }

      const newProject = await Project.create(req.body);
      return res.status(201).json({
        success: true,
        message: 'Abertura de loja criada com sucesso!',
        data: newProject
      });
    } catch (error) {
      console.error('[projectController.create]', error);
      return res.status(400).json({ success: false, message: error.message });
    }
  },

  // Atualização de abertura de loja
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const updated = await Project.update(id, req.body);
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Projeto não encontrado' });
      }
      return res.status(200).json({ success: true, message: 'Abertura atualizada com sucesso', data: updated });
    } catch (error) {
      console.error('[projectController.update]', error);
      return res.status(400).json({ success: false, message: error.message });
    }
  },

  // Remoção de projeto de abertura
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await Project.delete(id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Projeto não encontrado' });
      }
      return res.status(200).json({ success: true, message: 'Projeto removido com sucesso' });
    } catch (error) {
      console.error('[projectController.delete]', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // Retorna métricas agregadas em tempo real para os KPIs do Dashboard
  getDashboardMetrics: async (req, res) => {
    try {
      const metrics = await Project.getKpis();
      return res.status(200).json({ success: true, data: metrics });
    } catch (error) {
      console.error('[projectController.getDashboardMetrics]', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // Atualização rápida de Signage e Playlist de uma loja
  updateSignage: async (req, res) => {
    try {
      const { id } = req.params;
      const { signage_status, playlist_version } = req.body || {};
      const updated = await Project.update(id, { signage_status, playlist_version });
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Projeto não encontrado' });
      }
      return res.status(200).json({
        success: true,
        message: 'Configuração de Digital Signage atualizada com sucesso!',
        data: updated
      });
    } catch (error) {
      console.error('[projectController.updateSignage]', error);
      return res.status(400).json({ success: false, message: error.message });
    }
  }
};

module.exports = projectController;

