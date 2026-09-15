// ==============================================================================
// Controller: Gestão de Digital Signage, Displays e Catálogo de Playlists
// Gabinete Multimédia (Fnac / Darty)
// ==============================================================================

const Playlist = require('../models/Playlist');
const SignagePlayer = require('../models/SignagePlayer');
const Project = require('../models/Project');
const ActivityLog = require('../models/ActivityLog');

const signageController = {
  // ===========================================================================
  // 1. ENDPOINTS DE PLAYLISTS
  // ===========================================================================

  // Lista playlists com filtros opcionais (brand, status)
  getPlaylists: async (req, res) => {
    try {
      const { brand, status } = req.query || {};
      const playlists = await Playlist.findAll({ brand, status });
      return res.status(200).json({
        success: true,
        count: playlists.length,
        data: playlists
      });
    } catch (error) {
      console.error('[signageController.getPlaylists]', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // Obtém detalhes de uma playlist específica
  getPlaylistById: async (req, res) => {
    try {
      const { id } = req.params;
      const playlist = await Playlist.findById(id);
      if (!playlist) {
        return res.status(404).json({ success: false, message: 'Playlist não encontrada' });
      }
      return res.status(200).json({ success: true, data: playlist });
    } catch (error) {
      console.error('[signageController.getPlaylistById]', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // Cria uma nova versão de playlist no catálogo
  createPlaylist: async (req, res) => {
    try {
      const { name, brand, version, resolution, duration_seconds } = req.body || {};
      if (!name || !name.trim()) {
        return res.status(400).json({ success: false, message: 'O nome da playlist é obrigatório.' });
      }
      if (!version || !version.trim()) {
        return res.status(400).json({ success: false, message: 'A versão da playlist é obrigatória.' });
      }

      const newPlaylist = await Playlist.create(req.body);
      return res.status(201).json({
        success: true,
        message: 'Versão de playlist criada com sucesso!',
        data: newPlaylist
      });
    } catch (error) {
      console.error('[signageController.createPlaylist]', error);
      return res.status(400).json({ success: false, message: error.message });
    }
  },

  // Atualiza estado da playlist (draft, em_validacao, publicada, arquivada)
  updatePlaylistStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body || {};
      if (!status) {
        return res.status(400).json({ success: false, message: 'Estado não fornecido.' });
      }

      const updated = await Playlist.updateStatus(id, status);
      return res.status(200).json({
        success: true,
        message: `Estado da playlist atualizado para: ${status}`,
        data: updated
      });
    } catch (error) {
      console.error('[signageController.updatePlaylistStatus]', error);
      return res.status(400).json({ success: false, message: error.message });
    }
  },

  // Remove playlist do catálogo
  deletePlaylist: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await Playlist.delete(id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Playlist não encontrada' });
      }
      return res.status(200).json({
        success: true,
        message: 'Playlist removida com sucesso do catálogo'
      });
    } catch (error) {
      console.error('[signageController.deletePlaylist]', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },


  // ===========================================================================
  // 2. ENDPOINTS DE PLAYERS / DISPLAYS
  // ===========================================================================

  // Lista ecrãs/players globais ou filtrados
  getPlayers: async (req, res) => {
    try {
      const { projectId, status, brand } = req.query || {};
      const players = await SignagePlayer.findAll({ projectId, status, brand });
      return res.status(200).json({
        success: true,
        count: players.length,
        data: players
      });
    } catch (error) {
      console.error('[signageController.getPlayers]', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // Lista ecrãs de uma loja específica
  getByProject: async (req, res) => {
    try {
      const { projectId } = req.params;
      const players = await SignagePlayer.findByProject(projectId);
      return res.status(200).json({
        success: true,
        count: players.length,
        data: players
      });
    } catch (error) {
      console.error('[signageController.getByProject]', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // Regista um novo ecrã/player (no catálogo global ou numa loja)
  createPlayer: async (req, res) => {
    try {
      const { name } = req.body || {};
      if (!name || !name.trim()) {
        return res.status(400).json({ success: false, message: 'O nome do ecrã/display é obrigatório.' });
      }

      const newPlayer = await SignagePlayer.create(req.body);

      // Registo de auditoria operacional
      const serialLabel = newPlayer.serial_number ? ` [ID/Serial: ${newPlayer.serial_number}]` : '';
      const storeText = newPlayer.store_name ? ` para ${newPlayer.store_name}` : ' no Catálogo Global';
      ActivityLog.log({
        action_type: 'player_created',
        title: `Novo Hardware Registado: ${newPlayer.name}`,
        description: `Ecrã ${newPlayer.name}${serialLabel} (${newPlayer.device_model || 'Hardware'}) registado${storeText}.`,
        project_id: newPlayer.project_id,
        project_name: newPlayer.store_name,
        user_name: req.user?.name || 'Gabinete Multimédia',
        icon_type: 'hardware'
      });

      return res.status(201).json({
        success: true,
        message: 'Registo de ecrã/player gravado com sucesso no catálogo!',
        data: newPlayer
      });
    } catch (error) {
      console.error('[signageController.createPlayer]', error);
      return res.status(400).json({ success: false, message: error.message });
    }
  },

  // Atualiza dados de um player
  updatePlayer: async (req, res) => {
    try {
      const { id } = req.params;
      const updated = await SignagePlayer.update(id, req.body || {});
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Ecrã/Player não encontrado' });
      }

      const serialLabel = updated.serial_number ? ` [ID/Serial: ${updated.serial_number}]` : '';
      ActivityLog.log({
        action_type: 'player_updated',
        title: `Hardware Atualizado: ${updated.name}`,
        description: `Configurações de ${updated.name}${serialLabel} (${updated.status}) atualizadas no ecossistema.`,
        project_id: updated.project_id,
        project_name: updated.store_name,
        user_name: req.user?.name || 'Gabinete Multimédia',
        icon_type: 'hardware'
      });

      return res.status(200).json({
        success: true,
        message: 'Configurações do ecrã atualizadas com sucesso!',
        data: updated
      });
    } catch (error) {
      console.error('[signageController.updatePlayer]', error);
      return res.status(400).json({ success: false, message: error.message });
    }
  },

  // Executa teste de conectividade (ping)
  pingPlayer: async (req, res) => {
    try {
      const { id } = req.params;
      const player = await SignagePlayer.ping(id);
      if (!player) {
        return res.status(404).json({ success: false, message: 'Ecrã/Player não encontrado' });
      }

      ActivityLog.log({
        action_type: 'player_ping',
        title: `Teste de Ping Estabelecido: ${player.name}`,
        description: `Comunicação bidirecional validada via IP ${player.ip_address || 'DHCP'} com estado ${player.status}.`,
        project_id: player.project_id,
        project_name: player.store_name,
        user_name: req.user?.name || 'Gabinete Multimédia',
        icon_type: 'info'
      });

      return res.status(200).json({
        success: true,
        message: `Comunicação estabelecida com ${player.name} (${player.ip_address})`,
        data: player
      });
    } catch (error) {
      console.error('[signageController.pingPlayer]', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // Remove um ecrã
  deletePlayer: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await SignagePlayer.delete(id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Ecrã/Player não encontrado' });
      }
      return res.status(200).json({
        success: true,
        message: 'Ecrã/Player removido com sucesso'
      });
    } catch (error) {
      console.error('[signageController.deletePlayer]', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },


  // ===========================================================================
  // 3. ESTATÍSTICAS GLOBAIS DE DIGITAL SIGNAGE
  // ===========================================================================

  getStats: async (req, res) => {
    try {
      const stats = await SignagePlayer.getGlobalSignageStats();
      return res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('[signageController.getStats]', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }
};

module.exports = signageController;
