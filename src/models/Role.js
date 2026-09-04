// ==============================================================================
// RetailLaunchOS - Modelo de Papéis e Permissões (Role DAO)
// Gabinete Multimédia | Gestão de Acessos RBAC
// ==============================================================================

const db = require('../database/db');

// Matriz de Permissões Granulares por Papel
const ROLE_PERMISSIONS = {
  admin: {
    canCreateProject: true,
    canEditProject: true,
    canDeleteProject: true,
    canManagePlaylists: true,
    canManageSignagePlayers: true,
    canManageTasks: true,
    canManageCosts: true,
    canManageUsers: true,
    canViewFinancials: true
  },
  multimedia_user: {
    canCreateProject: false,
    canEditProject: true,
    canDeleteProject: false,
    canManagePlaylists: true,
    canManageSignagePlayers: true,
    canManageTasks: true,
    canManageCosts: true,
    canManageUsers: false,
    canViewFinancials: true
  },
  store_manager: {
    canCreateProject: false,
    canEditProject: false,
    canDeleteProject: false,
    canManagePlaylists: false,
    canManageSignagePlayers: false,
    canManageTasks: true,
    canManageCosts: false,
    canManageUsers: false,
    canViewFinancials: true
  },
  viewer: {
    canCreateProject: false,
    canEditProject: false,
    canDeleteProject: false,
    canManagePlaylists: false,
    canManageSignagePlayers: false,
    canManageTasks: false,
    canManageCosts: false,
    canManageUsers: false,
    canViewFinancials: true
  }
};

class Role {
  /**
   * Lista todos os papéis registados na base de dados com contagem de utilizadores
   */
  static findAll() {
    const sql = `
      SELECT 
        r.id,
        r.name,
        r.description,
        COUNT(u.id) AS users_count,
        r.created_at
      FROM roles r
      LEFT JOIN users u ON r.id = u.role_id
      GROUP BY r.id
      ORDER BY r.id ASC;
    `;
    const roles = db.query(sql);
    return roles.map(role => ({
      ...role,
      permissions: ROLE_PERMISSIONS[role.name] || {}
    }));
  }

  /**
   * Procura papel por ID
   */
  static findById(id) {
    const sql = `SELECT * FROM roles WHERE id = ?;`;
    const role = db.get(sql, [id]);
    if (!role) return null;
    return {
      ...role,
      permissions: ROLE_PERMISSIONS[role.name] || {}
    };
  }

  /**
   * Procura papel por Nome
   */
  static findByName(name) {
    const sql = `SELECT * FROM roles WHERE name = ?;`;
    const role = db.get(sql, [name]);
    if (!role) return null;
    return {
      ...role,
      permissions: ROLE_PERMISSIONS[role.name] || {}
    };
  }

  /**
   * Obtém a lista de permissões associada a um determinado papel
   */
  static getPermissions(roleName) {
    return ROLE_PERMISSIONS[roleName] || ROLE_PERMISSIONS.viewer;
  }
}

module.exports = Role;
