// ==============================================================================
// Modelo: Playlist (Catálogo e Versionamento de Conteúdos Digital Signage)
// Gabinete Multimédia (Fnac / Darty)
// ==============================================================================

const db = require('../database/db');

class Playlist {
  // Lista todas as playlists com contagem de ecrãs/players associados
  static async findAll(filters = {}) {
    let sql = `
      SELECT 
        p.*,
        u.name as created_by_name,
        COUNT(sp.id) as linked_players_count
      FROM playlists p
      LEFT JOIN users u ON p.created_by = u.id
      LEFT JOIN signage_players sp ON sp.playlist_id = p.id
    `;
    const params = [];
    const conditions = [];

    if (filters.brand && filters.brand !== 'all') {
      conditions.push(`(p.brand = ? OR p.brand = 'Todas')`);
      params.push(filters.brand);
    }
    if (filters.status && filters.status !== 'all') {
      conditions.push(`p.status = ?`);
      params.push(filters.status);
    }

    if (conditions.length > 0) {
      sql += ` WHERE ` + conditions.join(' AND ');
    }

    sql += ` GROUP BY p.id ORDER BY p.id DESC`;

    return db.query(sql, params);
  }

  // Obtém uma playlist específica por ID com seus players vinculados
  static async findById(id) {
    const sql = `
      SELECT 
        p.*,
        u.name as created_by_name
      FROM playlists p
      LEFT JOIN users u ON p.created_by = u.id
      WHERE p.id = ?
    `;
    const playlist = db.get(sql, [id]);
    if (!playlist) return null;

    // Obter players associados
    const playersSql = `
      SELECT sp.*, pr.name as store_name, pr.brand as store_brand
      FROM signage_players sp
      LEFT JOIN projects pr ON sp.project_id = pr.id
      WHERE sp.playlist_id = ?
    `;
    playlist.players = db.query(playersSql, [id]);

    return playlist;
  }

  // Criação de nova versão de playlist no catálogo
  static async create(data) {
    const brand = data.brand || 'Fnac';
    const version = data.version ? data.version.trim() : 'v1.0';
    const prefix = brand.toUpperCase().slice(0, 4);
    const code = data.code || `PL-${prefix}-${Date.now().toString().slice(-4)}`;
    const name = data.name ? data.name.trim() : `${brand} Playlist ${version}`;
    const resolution = data.resolution || '3840x2160 (4K)';
    const duration_seconds = parseInt(data.duration_seconds, 10) || 180;
    const status = data.status || 'draft';
    const file_size_mb = parseFloat(data.file_size_mb) || 0;
    const media_count = parseInt(data.media_count, 10) || 10;
    const notes = data.notes ? data.notes.trim() : '';
    const created_by = data.created_by ? parseInt(data.created_by, 10) : 1;

    const sql = `
      INSERT INTO playlists (
        code, name, brand, version, resolution, duration_seconds,
        status, file_size_mb, media_count, notes, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const result = db.run(sql, [
      code, name, brand, version, resolution, duration_seconds,
      status, file_size_mb, media_count, notes, created_by
    ]);

    return this.findById(result.lastInsertRowid);
  }

  // Atualização de playlist
  static async update(id, data) {
    const allowed = ['name', 'brand', 'version', 'resolution', 'duration_seconds', 'status', 'file_size_mb', 'media_count', 'notes'];
    const updates = [];
    const params = [];

    for (const key of allowed) {
      if (data[key] !== undefined) {
        updates.push(`${key} = ?`);
        params.push(data[key]);
      }
    }

    if (updates.length === 0) return this.findById(id);

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    params.push(id);

    db.run(`UPDATE playlists SET ${updates.join(', ')} WHERE id = ?`, params);
    return this.findById(id);
  }

  // Atualização rápida de estado (draft, em_validacao, publicada, arquivada)
  static async updateStatus(id, status) {
    return this.update(id, { status });
  }

  // Eliminação de playlist (apenas se não estiver vinculada a ecrãs ativos)
  static async delete(id) {
    // Desassociar dos players antes de remover
    db.run(`UPDATE signage_players SET playlist_id = NULL WHERE playlist_id = ?`, [id]);
    const result = db.run(`DELETE FROM playlists WHERE id = ?`, [id]);
    return result.changes > 0;
  }

  // Estatísticas agregadas do catálogo de playlists
  static async getStats() {
    const totals = db.get(`
      SELECT 
        COUNT(*) as total_playlists,
        SUM(CASE WHEN status = 'publicada' THEN 1 ELSE 0 END) as published_count,
        SUM(CASE WHEN status = 'em_validacao' THEN 1 ELSE 0 END) as review_count,
        SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) as draft_count,
        SUM(media_count) as total_media_assets
      FROM playlists
    `);

    const byBrand = db.query(`
      SELECT brand, COUNT(*) as count 
      FROM playlists 
      GROUP BY brand
    `);

    return {
      totals: totals || {},
      byBrand
    };
  }
}

module.exports = Playlist;
