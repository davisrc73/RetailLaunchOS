// ==============================================================================
// Controller: Gestão do Feed de Atividades Operacionais e Auditoria
// Gabinete Multimédia (Fnac / Darty)
// ==============================================================================

const ActivityLog = require('../models/ActivityLog');

const activityController = {
  // Retorna as atividades mais recentes
  getRecent: async (req, res) => {
    try {
      const limit = req.query?.limit || 15;
      const activities = await ActivityLog.getRecent(limit);

      return res.status(200).json({
        success: true,
        count: activities.length,
        data: activities
      });
    } catch (error) {
      console.error('[activityController.getRecent]', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // Permite registar manualmente uma atividade caso necessário
  create: async (req, res) => {
    try {
      const { action_type, title, description, project_id, project_name, icon_type } = req.body || {};
      if (!title || !title.trim()) {
        return res.status(400).json({ success: false, message: 'O título da atividade é obrigatório.' });
      }

      const userName = req.user?.name || 'Gabinete Multimédia';
      const userId = req.user?.id || null;

      const newLog = await ActivityLog.log({
        action_type: action_type || 'info',
        title: title.trim(),
        description,
        project_id,
        project_name,
        user_id: userId,
        user_name: userName,
        icon_type: icon_type || 'info'
      });

      return res.status(201).json({
        success: true,
        message: 'Atividade registada com sucesso',
        data: newLog
      });
    } catch (error) {
      console.error('[activityController.create]', error);
      return res.status(400).json({ success: false, message: error.message });
    }
  }
};

module.exports = activityController;
