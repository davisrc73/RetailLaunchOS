// ==============================================================================
// RetailLaunchOS - Modelo de Utilizadores (User DAO)
// Gabinete Multimédia | Gestão de Acessos e Perfis RBAC
// ==============================================================================

const db = require('../database/db');
const crypto = require('node:crypto');

class User {
  /**
   * Gera hash seguro de password utilizando PBKDF2 nativo
   */
  static hashPassword(password) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return `${salt}:${hash}`;
  }

  /**
   * Verifica a password fornecida contra a hash armazenada
   */
  static verifyPassword(password, storedHash) {
    if (!storedHash || !password) return false;

    // Suporte às contas semente do piloto
    if (storedHash.startsWith('$2b$10$demo')) {
      const allowedDemoPasswords = ['fnac2026', 'admin', '123456', 'fnacdarty'];
      return allowedDemoPasswords.includes(password.toLowerCase().trim());
    }

    const parts = storedHash.split(':');
    if (parts.length !== 2) return false;

    const [salt, hash] = parts;
    const verifyHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');

    try {
      return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(verifyHash, 'hex'));
    } catch {
      return false;
    }
  }

  /**
   * Procura utilizador por ID com detalhes do papel
   */
  static findById(id) {
    const sql = `
      SELECT 
        u.id,
        u.role_id,
        r.name AS role,
        r.description AS role_description,
        u.name,
        u.email,
        u.department,
        u.status,
        u.created_at,
        u.updated_at
      FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE u.id = ?;
    `;
    return db.get(sql, [id]);
  }

  /**
   * Procura utilizador por Email (inclui password_hash para autenticação)
   */
  static findByEmail(email) {
    const sql = `
      SELECT 
        u.id,
        u.role_id,
        r.name AS role,
        r.description AS role_description,
        u.name,
        u.email,
        u.password_hash,
        u.department,
        u.status,
        u.created_at
      FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE LOWER(u.email) = LOWER(?);
    `;
    return db.get(sql, [email.trim()]);
  }

  /**
   * Procura utilizador por papel (ex: 'admin', 'multimedia_user') para login rápido de demonstração
   */
  static findByRole(roleName) {
    const sql = `
      SELECT 
        u.id,
        u.role_id,
        r.name AS role,
        r.description AS role_description,
        u.name,
        u.email,
        u.department,
        u.status,
        u.created_at
      FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE r.name = ? AND u.status = 'active'
      ORDER BY u.id ASC
      LIMIT 1;
    `;
    return db.get(sql, [roleName]);
  }

  /**
   * Lista todos os utilizadores com filtros opcionais
   */
  static findAll({ role, status } = {}) {
    let sql = `
      SELECT 
        u.id,
        u.role_id,
        r.name AS role,
        r.description AS role_description,
        u.name,
        u.email,
        u.department,
        u.status,
        u.created_at
      FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE 1=1
    `;
    const params = [];

    if (role) {
      sql += ' AND r.name = ?';
      params.push(role);
    }

    if (status) {
      sql += ' AND u.status = ?';
      params.push(status);
    }

    sql += ' ORDER BY u.id ASC;';
    return db.query(sql, params);
  }

  /**
   * Autentica utilizador por credenciais (email e password)
   */
  static verifyCredentials(email, password) {
    const user = this.findByEmail(email);
    if (!user) return null;

    if (user.status !== 'active') {
      throw new Error('Esta conta de utilizador encontra-se inativa ou suspensa.');
    }

    const isValid = this.verifyPassword(password, user.password_hash);
    if (!isValid) return null;

    // Remover password_hash antes de retornar
    const { password_hash, ...sanitizedUser } = user;
    return sanitizedUser;
  }

  /**
   * Criação de novo utilizador
   */
  static create(data) {
    const { role_id, name, email, password, department = 'Gabinete Multimédia', status = 'active' } = data;

    const existing = this.findByEmail(email);
    if (existing) {
      throw new Error(`Já existe um utilizador registado com o email: ${email}`);
    }

    const password_hash = this.hashPassword(password || 'fnac2026');

    const sql = `
      INSERT INTO users (role_id, name, email, password_hash, department, status)
      VALUES (?, ?, ?, ?, ?, ?);
    `;

    const result = db.run(sql, [role_id, name, email.trim(), password_hash, department, status]);
    return this.findById(result.lastInsertRowid);
  }

  /**
   * Atualização de utilizador
   */
  static update(id, data) {
    const user = this.findById(id);
    if (!user) throw new Error(`Utilizador #${id} não encontrado.`);

    const fields = [];
    const params = [];

    if (data.name) { fields.push('name = ?'); params.push(data.name); }
    if (data.role_id) { fields.push('role_id = ?'); params.push(data.role_id); }
    if (data.department) { fields.push('department = ?'); params.push(data.department); }
    if (data.status) { fields.push('status = ?'); params.push(data.status); }
    if (data.password) {
      fields.push('password_hash = ?');
      params.push(this.hashPassword(data.password));
    }

    if (fields.length === 0) return user;

    fields.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);

    const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?;`;
    db.run(sql, params);

    return this.findById(id);
  }
}

module.exports = User;
