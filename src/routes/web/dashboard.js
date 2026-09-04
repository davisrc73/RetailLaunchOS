// ==============================================================================
// Rotas Web: Navegação da Interface e Páginas HTML
// ==============================================================================

const express = require('express');
const path = require('path');
const router = express.Router();
const { authenticate } = require('../../middleware/authMiddleware');

// Rota principal: Dashboard do Gabinete Multimédia
router.get('/', authenticate, (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../views/pages/dashboard.html'));
});

// Alias para /dashboard
router.get('/dashboard', authenticate, (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../views/pages/dashboard.html'));
});

module.exports = router;
