// ==============================================================================
// Rotas API: /api/v1/projects
// ==============================================================================

const express = require('express');
const router = express.Router();
const projectController = require('../../controllers/projectController');
const { authenticate, requireRole } = require('../../middleware/authMiddleware');

// Rotas públicas ou autenticadas da API de projetos
router.get('/', authenticate, projectController.getAll);
router.get('/kpis', authenticate, projectController.getDashboardMetrics);
router.get('/:id', authenticate, projectController.getById);

// Rotas restritas para administradores e gestores multimédia
router.post('/', authenticate, requireRole('admin', 'multimedia_user'), projectController.create);

module.exports = router;
