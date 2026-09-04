// ==============================================================================
// RetailLaunchOS - Controlador de Autenticação e Perfis (authController.js)
// Gabinete Multimédia | Gestão de Acessos e Sessões RBAC
// ==============================================================================

const User = require('../models/User');
const Role = require('../models/Role');
const AuthMiddleware = require('../middleware/authMiddleware');

class AuthController {
  /**
   * Endpoint de Login (suporta credenciais normais e alternância rápida no piloto)
   * POST /api/v1/auth/login
   */
  static async login(req, res) {
    try {
      const { email, password, role } = req.body || {};

      let user = null;

      // 1. Modo Piloto / Quick Switch por papel
      if (role && !email) {
        user = User.findByRole(role);
        if (!user) {
          return res.status(404).json({
            success: false,
            message: `Nenhum utilizador ativo encontrado para o perfil '${role}'.`
          });
        }
      } 
      // 2. Modo Padrão por Credenciais (Email + Password)
      else if (email) {
        try {
          user = User.verifyCredentials(email, password);
        } catch (err) {
          return res.status(403).json({
            success: false,
            message: err.message
          });
        }

        if (!user) {
          return res.status(401).json({
            success: false,
            message: 'Email ou password incorretos. Tente novamente ou use a troca rápida.'
          });
        }
      } else {
        return res.status(400).json({
          success: false,
          message: 'Parâmetros insuficientes. Forneça email/password ou um papel de demonstração.'
        });
      }

      // 3. Gerar Token JWT nativo
      const token = AuthMiddleware.signToken(user);
      const permissions = Role.getPermissions(user.role);

      return res.status(200).json({
        success: true,
        message: `Sessão iniciada com sucesso como ${user.name} (${user.role}).`,
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          role_description: user.role_description,
          department: user.department
        },
        permissions
      });

    } catch (error) {
      console.error('[AuthController.login Error]', error);
      return res.status(500).json({
        success: false,
        message: 'Erro interno ao processar autenticação: ' + error.message
      });
    }
  }

  /**
   * Retorna os dados do utilizador atualmente autenticado e as suas permissões
   * GET /api/v1/auth/me
   */
  static async getCurrentUser(req, res) {
    try {
      const user = req.user || AuthMiddleware.extractUserFromRequest(req);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Nenhuma sessão ativa encontrada.'
        });
      }

      const freshUser = User.findById(user.id);
      if (!freshUser) {
        return res.status(404).json({
          success: false,
          message: 'Utilizador associado ao token já não existe na base de dados.'
        });
      }

      const permissions = Role.getPermissions(freshUser.role);

      return res.status(200).json({
        success: true,
        user: freshUser,
        permissions
      });
    } catch (error) {
      console.error('[AuthController.getCurrentUser Error]', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao obter dados do utilizador: ' + error.message
      });
    }
  }

  /**
   * Lista todos os utilizadores do sistema
   * GET /api/v1/users
   */
  static async getUsersList(req, res) {
    try {
      const users = User.findAll();
      return res.status(200).json({
        success: true,
        data: users
      });
    } catch (error) {
      console.error('[AuthController.getUsersList Error]', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao listar utilizadores: ' + error.message
      });
    }
  }

  /**
   * Lista todos os papéis e permissões
   * GET /api/v1/roles
   */
  static async getRolesList(req, res) {
    try {
      const roles = Role.findAll();
      return res.status(200).json({
        success: true,
        data: roles
      });
    } catch (error) {
      console.error('[AuthController.getRolesList Error]', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao listar papéis: ' + error.message
      });
    }
  }
}

module.exports = AuthController;
