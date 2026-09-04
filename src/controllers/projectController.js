// ==============================================================================
// Controller: Gestão de Projetos e Aberturas (Fnac/Darty)
// ==============================================================================

const Project = require('../models/Project');

const projectController = {
  // Lista todos os projetos piloto e aberturas em curso
  getAll: async (req, res) => {
    try {
      const projects = await Project.findAll();
      return res.status(200).json({
        success: true,
        count: projects.length,
        data: projects
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // Obtém detalhes de um projeto específico por ID ou código (ex: FNAC-CAS-2026)
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const project = await Project.findById(id);
      if (!project) {
        return res.status(404).json({ success: false, message: 'Projeto não encontrado' });
      }
      return res.status(200).json({ success: true, data: project });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // Criação de nova abertura de loja
  create: async (req, res) => {
    try {
      const newProject = await Project.create(req.body);
      return res.status(201).json({ success: true, data: newProject });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  },

  // Retorna métricas agregadas para os KPIs do Dashboard
  getDashboardMetrics: async (req, res) => {
    try {
      const metrics = await Project.getKpis();
      return res.status(200).json({ success: true, data: metrics });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
};

module.exports = projectController;
