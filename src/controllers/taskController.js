// ==============================================================================
// Controller: Gestão de Tarefas e Marcos Técnicos
// Gabinete Multimédia (Fnac / Darty)
// ==============================================================================

const Task = require('../models/Task');
const Project = require('../models/Project');

const taskController = {
  // Lista todas as tarefas de um projeto
  getByProject: async (req, res) => {
    try {
      const { projectId } = req.params;
      const tasks = await Task.findByProject(projectId);
      const stats = await Task.getStats(projectId);
      return res.status(200).json({
        success: true,
        stats,
        data: tasks
      });
    } catch (error) {
      console.error('[taskController.getByProject]', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // Cria uma nova tarefa / marco técnico
  create: async (req, res) => {
    try {
      const { projectId } = req.params;
      const { title, department, priority, due_date, description } = req.body || {};

      if (!title || !title.trim()) {
        return res.status(400).json({ success: false, message: 'O título do marco técnico é obrigatório.' });
      }

      const newTask = await Task.create({
        project_id: projectId,
        department: department || 'Multimédia & Telas',
        title: title.trim(),
        description,
        priority: priority || 'medium',
        due_date,
        status: 'pendente'
      });

      const stats = await Task.getStats(projectId);

      return res.status(201).json({
        success: true,
        message: 'Marco técnico adicionado com sucesso!',
        stats,
        data: newTask
      });
    } catch (error) {
      console.error('[taskController.create]', error);
      return res.status(400).json({ success: false, message: error.message });
    }
  },

  // Atualiza dados de uma tarefa
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const updated = await Task.update(id, req.body);
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Marco técnico não encontrado' });
      }

      const stats = await Task.getStats(updated.project_id);

      return res.status(200).json({
        success: true,
        message: 'Marco técnico atualizado',
        stats,
        data: updated
      });
    } catch (error) {
      console.error('[taskController.update]', error);
      return res.status(400).json({ success: false, message: error.message });
    }
  },

  // Alterna rapidamente o estado de conclusão da tarefa
  toggle: async (req, res) => {
    try {
      const { id } = req.params;
      const toggled = await Task.toggleStatus(id);
      if (!toggled) {
        return res.status(404).json({ success: false, message: 'Marco técnico não encontrado' });
      }

      const stats = await Task.getStats(toggled.project_id);

      return res.status(200).json({
        success: true,
        message: toggled.status === 'concluido' ? 'Marco concluído com sucesso!' : 'Marco reaberto.',
        stats,
        data: toggled
      });
    } catch (error) {
      console.error('[taskController.toggle]', error);
      return res.status(400).json({ success: false, message: error.message });
    }
  },

  // Remove um marco técnico
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const task = await Task.findById(id);
      if (!task) {
        return res.status(404).json({ success: false, message: 'Marco técnico não encontrado' });
      }

      const projectId = task.project_id;
      await Task.delete(id);
      const stats = await Task.getStats(projectId);

      return res.status(200).json({
        success: true,
        message: 'Marco técnico removido com sucesso',
        stats
      });
    } catch (error) {
      console.error('[taskController.delete]', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }
};

module.exports = taskController;
