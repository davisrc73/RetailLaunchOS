// ==============================================================================
// RetailLaunchOS - Modelo de Parâmetros do Sistema (SystemParameter DAO)
// Gabinete Multimédia | Gestão de Catálogos (Modelos, Zonas, Resoluções)
// ==============================================================================

const db = require('../database/db');

class SystemParameter {
  /**
   * Lista todos os parâmetros, opcionalmente filtrados por categoria ou estado ativo
   */
  static findAll({ category = null, activeOnly = false } = {}) {
    let sql = 'SELECT * FROM system_parameters WHERE 1=1';
    const params = [];

    if (category) {
      sql += ' AND category = ?';
      params.push(category);
    }

    if (activeOnly) {
      sql += ' AND is_active = 1';
    }

    sql += ' ORDER BY category ASC, display_order ASC, name ASC;';
    return db.query(sql, params);
  }

  /**
   * Devolve todos os parâmetros agrupados por entidade para consumo direto na UI e dropdowns
   */
  static findGrouped({ activeOnly = false } = {}) {
    const all = this.findAll({ activeOnly });
    return {
      hardware_models: all.filter(p => p.category === 'hardware_model'),
      zones: all.filter(p => p.category === 'zone_location'),
      resolutions: all.filter(p => p.category === 'resolution')
    };
  }

  /**
   * Procura um parâmetro pelo ID
   */
  static findById(id) {
    return db.get('SELECT * FROM system_parameters WHERE id = ?;', [id]);
  }

  /**
   * Procura por categoria e nome (para evitar duplicados)
   */
  static findByCategoryAndName(category, name) {
    return db.get(
      'SELECT * FROM system_parameters WHERE category = ? AND LOWER(name) = LOWER(?);',
      [category, name.trim()]
    );
  }

  /**
   * Cria um novo parâmetro com validação
   */
  static create({ category, name, description = '', display_order = 0 }) {
    if (!category || !['hardware_model', 'zone_location', 'resolution'].includes(category)) {
      throw new Error('Categoria inválida. Deve ser hardware_model, zone_location ou resolution.');
    }

    if (!name || !name.trim()) {
      throw new Error('O nome do parâmetro é obrigatório.');
    }

    const trimmedName = name.trim();
    const existing = this.findByCategoryAndName(category, trimmedName);
    if (existing) {
      throw new Error(`Já existe um parâmetro com o nome "${trimmedName}" nesta categoria.`);
    }

    const result = db.run(
      `INSERT INTO system_parameters (category, name, description, display_order, is_active)
       VALUES (?, ?, ?, ?, 1);`,
      [category, trimmedName, description ? description.trim() : '', Number(display_order) || 0]
    );

    return this.findById(result.lastInsertRowid);
  }

  /**
   * Atualiza dados de um parâmetro existente
   */
  static update(id, data = {}) {
    const existing = this.findById(id);
    if (!existing) {
      throw new Error('Parâmetro não encontrado.');
    }

    const updates = [];
    const params = [];

    if (data.name !== undefined) {
      const trimmedName = data.name.trim();
      if (!trimmedName) throw new Error('O nome não pode estar vazio.');
      
      const duplicate = db.get(
        'SELECT id FROM system_parameters WHERE category = ? AND LOWER(name) = LOWER(?) AND id != ?;',
        [existing.category, trimmedName, id]
      );
      if (duplicate) {
        throw new Error(`Já existe outro parâmetro com o nome "${trimmedName}" nesta categoria.`);
      }

      updates.push('name = ?');
      params.push(trimmedName);
    }

    if (data.description !== undefined) {
      updates.push('description = ?');
      params.push(data.description ? data.description.trim() : '');
    }

    if (data.display_order !== undefined) {
      updates.push('display_order = ?');
      params.push(Number(data.display_order) || 0);
    }

    if (data.is_active !== undefined) {
      updates.push('is_active = ?');
      params.push(data.is_active ? 1 : 0);
    }

    if (updates.length === 0) return existing;

    updates.push("updated_at = CURRENT_TIMESTAMP");
    params.push(id);

    db.run(
      `UPDATE system_parameters SET ${updates.join(', ')} WHERE id = ?;`,
      params
    );

    return this.findById(id);
  }

  /**
   * Elimina um parâmetro do sistema
   */
  static delete(id) {
    const existing = this.findById(id);
    if (!existing) {
      throw new Error('Parâmetro não encontrado.');
    }

    const result = db.run('DELETE FROM system_parameters WHERE id = ?;', [id]);
    return result.changes > 0;
  }
}

module.exports = SystemParameter;
