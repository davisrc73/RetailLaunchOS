// ==============================================================================
// Middleware: Autenticação e Controlo de Permissões (RBAC)
// ==============================================================================

module.exports = {
  // Verificação de sessão/token do utilizador
  authenticate: (req, res, next) => {
    // Preparado para JWT ou sessão de utilizador
    const authHeader = req.headers.authorization;
    if (process.env.NODE_ENV === 'development' || !authHeader) {
      // Simulação para ambiente de desenvolvimento do piloto interno
      req.user = {
        id: 1,
        name: 'Admin Multimédia',
        role: 'admin',
        department: 'Gabinete Multimédia'
      };
      return next();
    }
    next();
  },

  // Controlo de permissões por papel (ex: 'admin', 'multimedia_user')
  requireRole: (...allowedRoles) => {
    return (req, res, next) => {
      if (!req.user || !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: 'Acesso recusado: Permissões insuficientes para o Gabinete Multimédia.'
        });
      }
      next();
    };
  }
};
