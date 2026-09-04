// ==============================================================================
// Modelo: SignagePlayer (Displays, Ecrãs e Media Players das Lojas)
// Gabinete Multimédia (Fnac / Darty)
// ==============================================================================

const db = require('../database/db');

class SignagePlayer {
  // Lista todos os ecrãs/players de uma determinada loja
  static async findByProject(projectId) {
    const sql = `
      SELECT 
        sp.*,
        p.name as store_name,
        p.brand as store_brand,
        pl.name as playlist_name,
        pl.version as playlist_version_code,
        pl.status as playlist_status
      FROM signage_players sp
      LEFT JOIN projects p ON sp.project_id = p.id
      LEFT JOIN playlists pl ON sp.playlist_id = pl.id
      WHERE sp.project_id = ?
      ORDER BY sp.id ASC
    `;
    return db.query(sql, [projectId]);
  }

  // Lista todos os ecrãs do ecossistema global com filtros opcionais
  static async findAll(filters = {}) {
    let sql = `
      SELECT 
        sp.*,
        p.name as store_name,
        p.brand as store_brand,
        p.location as store_location,
        pl.name as playlist_name,
        pl.version as playlist_version_code
      FROM signage_players sp
      LEFT JOIN projects p ON sp.project_id = p.id
      LEFT JOIN playlists pl ON sp.playlist_id = pl.id
    `;
    const params = [];
    const conditions = [];

    if (filters.projectId) {
      conditions.push(`sp.project_id = ?`);
      params.push(filters.projectId);
    }
    if (filters.status && filters.status !== 'all') {
      conditions.push(`sp.status = ?`);
      params.push(filters.status);
    }
    if (filters.brand && filters.brand !== 'all') {
      conditions.push(`p.brand = ?`);
      params.push(filters.brand);
    }

    if (conditions.length > 0) {
      sql += ` WHERE ` + conditions.join(' AND ');
    }

    sql += ` ORDER BY CASE WHEN p.name IS NULL THEN 1 ELSE 0 END, p.name ASC, sp.id ASC`;

    return db.query(sql, params);
  }

  // Procura player por ID
  static async findById(id) {
    const sql = `
      SELECT 
        sp.*,
        p.name as store_name,
        p.brand as store_brand,
        pl.name as playlist_name,
        pl.version as playlist_version_code
      FROM signage_players sp
      LEFT JOIN projects p ON sp.project_id = p.id
      LEFT JOIN playlists pl ON sp.playlist_id = pl.id
      WHERE sp.id = ?
    `;
    return db.get(sql, [id]);
  }

  // Regista um novo display/player (em catálogo global ou associado a uma loja)
  static async create(data) {
    const projectId = (data.project_id !== undefined && data.project_id !== null && data.project_id !== '' && data.project_id !== 'none')
      ? parseInt(data.project_id, 10)
      : null;
    const name = data.name ? data.name.trim() : 'Novo Display';
    const device_model = data.device_model || 'BrightSign XT1144 4K';
    const zone_location = data.zone_location ? data.zone_location.trim() : 'Entrada Principal';
    const resolution = data.resolution || '4K UHD';
    const ip_address = data.ip_address ? data.ip_address.trim() : '192.168.1.100';
    const mac_address = data.mac_address ? data.mac_address.trim() : '00:10:18:00:00:00';
    const status = data.status || 'online';
    const playlist_id = (data.playlist_id !== undefined && data.playlist_id !== null && data.playlist_id !== '' && data.playlist_id !== 'none')
      ? parseInt(data.playlist_id, 10)
      : null;
    const current_firmware = data.current_firmware || 'v9.0.145';

    const sql = `
      INSERT INTO signage_players (
        project_id, name, device_model, zone_location, resolution,
        ip_address, mac_address, status, playlist_id, current_firmware, last_ping
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `;

    const result = db.run(sql, [
      projectId, name, device_model, zone_location, resolution,
      ip_address, mac_address, status, playlist_id, current_firmware
    ]);

    return this.findById(result.lastInsertRowid);
  }

  // Atualiza dados de um player (ex: loja, IP, zona, playlist vinculada, status)
  static async update(id, data) {
    const allowed = ['project_id', 'name', 'device_model', 'zone_location', 'resolution', 'ip_address', 'mac_address', 'status', 'playlist_id', 'current_firmware'];
    const updates = [];
    const params = [];

    for (const key of allowed) {
      if (data[key] !== undefined) {
        updates.push(`${key} = ?`);
        let val = data[key];
        if (key === 'project_id' || key === 'playlist_id') {
          val = (val !== null && val !== '' && val !== 'none' && !isNaN(val)) ? parseInt(val, 10) : null;
        }
        params.push(val);
      }
    }

    if (updates.length === 0) return this.findById(id);

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    params.push(id);

    db.run(`UPDATE signage_players SET ${updates.join(', ')} WHERE id = ?`, params);
    return this.findById(id);
  }

  // Simula um teste de ping / verificação de conectividade ao dispositivo
  static async ping(id) {
    const player = await this.findById(id);
    if (!player) return null;

    // Se estiver offline ou em teste, atualiza o timestamp do ping e marca como online/ativo
    const newStatus = player.status === 'offline' ? 'testing' : 'online';
    db.run(`
      UPDATE signage_players 
      SET last_ping = CURRENT_TIMESTAMP, status = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `, [newStatus, id]);

    return this.findById(id);
  }

  // Remove um player/ecrã
  static async delete(id) {
    const result = db.run(`DELETE FROM signage_players WHERE id = ?`, [id]);
    return result.changes > 0;
  }

  // Estatísticas globais do ecossistema de Digital Signage
  static async getGlobalSignageStats() {
    const stats = db.get(`
      SELECT 
        COUNT(*) as total_players,
        SUM(CASE WHEN status = 'online' THEN 1 ELSE 0 END) as online_players,
        SUM(CASE WHEN status = 'syncing' THEN 1 ELSE 0 END) as syncing_players,
        SUM(CASE WHEN status = 'testing' THEN 1 ELSE 0 END) as testing_players,
        SUM(CASE WHEN status = 'offline' THEN 1 ELSE 0 END) as offline_players
      FROM signage_players
    `);

    const total = stats?.total_players || 0;
    const online = stats?.online_players || 0;
    const syncing = stats?.syncing_players || 0;
    const testing = stats?.testing_players || 0;
    const offline = stats?.offline_players || 0;

    // Readiness: (online + syncing) / total * 100
    const readiness = total > 0 ? Math.round(((online + syncing) / total) * 100) : 100;

    const playlistsStats = db.get(`
      SELECT 
        COUNT(*) as total_playlists,
        SUM(CASE WHEN status = 'publicada' THEN 1 ELSE 0 END) as active_playlists
      FROM playlists
    `);

    const modelDistribution = db.query(`
      SELECT device_model, COUNT(*) as count 
      FROM signage_players 
      GROUP BY device_model 
      ORDER BY count DESC
    `);

    return {
      totalPlayers: total,
      onlinePlayers: online,
      syncingPlayers: syncing,
      testingPlayers: testing,
      offlinePlayers: offline,
      signageReadiness: readiness,
      totalPlaylists: playlistsStats?.total_playlists || 0,
      activePlaylists: playlistsStats?.active_playlists || 0,
      modelDistribution
    };
  }
}

module.exports = SignagePlayer;
