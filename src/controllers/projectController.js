// ==============================================================================
// Controller: Gestão de Projetos e Aberturas (Fnac/Darty)
// Gabinete Multimédia - Camada de Controlo REST
// ==============================================================================

const fs = require('fs');
const path = require('path');
const Project = require('../models/Project');
const SignagePlayer = require('../models/SignagePlayer');
const ActivityLog = require('../models/ActivityLog');

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

      ActivityLog.log({
        action_type: 'project_created',
        title: `Nova Loja em Planeamento: ${newProject.name}`,
        description: `Abertura ${newProject.name} (${newProject.brand}) registada. Previsão de inauguração: ${newProject.go_live_date}.`,
        project_id: newProject.id,
        project_name: newProject.name,
        user_name: req.user?.name || 'Direção de Expansão',
        icon_type: 'project'
      });

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

      ActivityLog.log({
        action_type: 'project_updated',
        title: `Loja Atualizada: ${updated.name}`,
        description: `Parâmetros de abertura alterados (Estado: ${updated.status}, Go-Live: ${updated.go_live_date}).`,
        project_id: updated.id,
        project_name: updated.name,
        user_name: req.user?.name || 'Gabinete Multimédia',
        icon_type: 'project'
      });

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

      ActivityLog.log({
        action_type: 'project_updated',
        title: `Digital Signage Atualizado: ${updated.name}`,
        description: `Estado de signage: ${updated.signage_status} • Playlist: ${updated.playlist_version || 'Pendente'}.`,
        project_id: updated.id,
        project_name: updated.name,
        user_name: req.user?.name || 'Gabinete Multimédia',
        icon_type: 'hardware'
      });

      return res.status(200).json({
        success: true,
        message: 'Configuração de Digital Signage atualizada com sucesso!',
        data: updated
      });
    } catch (error) {
      console.error('[projectController.updateSignage]', error);
      return res.status(400).json({ success: false, message: error.message });
    }
  },

  // Upload e associação de planta arquitetónica de loja (Fase 17)
  uploadFloorPlan: async (req, res) => {
    try {
      const { id } = req.params;
      const { image_data, filename } = req.body || {};

      if (!image_data) {
        return res.status(400).json({ success: false, message: 'Dados da imagem não fornecidos.' });
      }

      const project = await Project.findById(id);
      if (!project) {
        return res.status(404).json({ success: false, message: 'Projeto de abertura não encontrado.' });
      }

      // Processar Data URL base64
      const matches = image_data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      let buffer;
      let ext = '.png';

      if (matches && matches.length === 3) {
        const mimeType = matches[1];
        buffer = Buffer.from(matches[2], 'base64');
        if (mimeType.includes('jpeg') || mimeType.includes('jpg')) ext = '.jpg';
        else if (mimeType.includes('webp')) ext = '.webp';
        else if (mimeType.includes('svg')) ext = '.svg';
        else if (mimeType.includes('gif')) ext = '.gif';
        else ext = '.png';
      } else {
        buffer = Buffer.from(image_data, 'base64');
      }

      const uploadsDir = path.resolve(__dirname, '../../database/uploads/floor_plans');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const safeName = `floorplan_proj_${id}_${Date.now()}${ext}`;
      const targetPath = path.join(uploadsDir, safeName);
      fs.writeFileSync(targetPath, buffer);

      const publicUrl = `/uploads/floor_plans/${safeName}`;

      // Remover imagem antiga do disco se for personalizada
      if (project.floor_plan_image && project.floor_plan_image.startsWith('/uploads/floor_plans/floorplan_proj_')) {
        try {
          const oldPath = path.join(uploadsDir, path.basename(project.floor_plan_image));
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        } catch (e) {
          console.warn('[uploadFloorPlan] Aviso ao limpar imagem antiga:', e.message);
        }
      }

      const updated = await Project.update(id, { floor_plan_image: publicUrl });

      ActivityLog.log({
        action_type: 'project_updated',
        title: `Planta de Loja Carregada: ${project.name}`,
        description: `Nova planta arquitetónica associada à loja ${project.name}.`,
        project_id: project.id,
        project_name: project.name,
        user_name: req.user?.name || 'Gabinete Multimédia',
        icon_type: 'project'
      });

      return res.status(200).json({
        success: true,
        message: 'Planta arquitetónica carregada com sucesso!',
        data: updated
      });
    } catch (error) {
      console.error('[projectController.uploadFloorPlan]', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // Remoção de planta arquitetónica de loja (Fase 17)
  deleteFloorPlan: async (req, res) => {
    try {
      const { id } = req.params;
      const project = await Project.findById(id);
      if (!project) {
        return res.status(404).json({ success: false, message: 'Projeto não encontrado.' });
      }

      if (project.floor_plan_image && project.floor_plan_image.startsWith('/uploads/floor_plans/floorplan_proj_')) {
        try {
          const uploadsDir = path.resolve(__dirname, '../../database/uploads/floor_plans');
          const filePath = path.join(uploadsDir, path.basename(project.floor_plan_image));
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        } catch (e) {
          console.warn('[deleteFloorPlan] Aviso ao remover ficheiro:', e.message);
        }
      }

      const updated = await Project.update(id, { floor_plan_image: null });

      ActivityLog.log({
        action_type: 'project_updated',
        title: `Planta de Loja Removida: ${project.name}`,
        description: `A planta da loja ${project.name} foi desassociada.`,
        project_id: project.id,
        project_name: project.name,
        user_name: req.user?.name || 'Gabinete Multimédia',
        icon_type: 'project'
      });

      return res.status(200).json({
        success: true,
        message: 'Planta de loja desassociada com sucesso!',
        data: updated
      });
    } catch (error) {
      console.error('[projectController.deleteFloorPlan]', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // Atualização em lote de coordenadas de ecrãs na planta (Fase 17)
  updateFloorPlanPositions: async (req, res) => {
    try {
      const { id } = req.params;
      const { positions } = req.body || {};

      if (!Array.isArray(positions)) {
        return res.status(400).json({ success: false, message: 'O array "positions" é obrigatório.' });
      }

      await SignagePlayer.updatePositions(positions);

      return res.status(200).json({
        success: true,
        message: 'Posições dos ecrãs na planta atualizadas com sucesso!'
      });
    } catch (error) {
      console.error('[projectController.updateFloorPlanPositions]', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }
};

module.exports = projectController;

