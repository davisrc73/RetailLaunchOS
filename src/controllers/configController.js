// ==============================================================================
// RetailLaunchOS - Controlador de Parâmetros e Catálogos de Configuração
// Gabinete Multimédia | Modelos, Zonas e Resoluções
// ==============================================================================

const SystemParameter = require('../models/SystemParameter');

class ConfigController {
  /**
   * Obtém todos os parâmetros (agrupados por omissão ou filtrados por categoria)
   * GET /api/v1/config/parameters
   */
  static async getParameters(req, res) {
    try {
      const category = req.query?.category;
      const activeOnly = req.query?.active_only === 'true' || req.query?.active_only === '1';

      if (category) {
        const items = SystemParameter.findAll({ category, activeOnly });
        return res.status(200).json({
          success: true,
          count: items.length,
          data: items
        });
      }

      const grouped = SystemParameter.findGrouped({ activeOnly });
      return res.status(200).json({
        success: true,
        data: grouped
      });
    } catch (error) {
      console.error('[ConfigController.getParameters Error]', error.message);
      return res.status(500).json({
        success: false,
        message: 'Erro interno ao obter parâmetros do sistema: ' + error.message
      });
    }
  }

  /**
   * Cria um novo parâmetro numa das categorias permitidas
   * POST /api/v1/config/parameters
   */
  static async createParameter(req, res) {
    try {
      const { category, name, description, display_order } = req.body || {};

      if (!category || !name) {
        return res.status(400).json({
          success: false,
          message: 'Os campos "category" e "name" são de preenchimento obrigatório.'
        });
      }

      const created = SystemParameter.create({
        category,
        name,
        description,
        display_order
      });

      return res.status(201).json({
        success: true,
        message: `Parâmetro "${created.name}" adicionado com sucesso ao catálogo!`,
        data: created
      });
    } catch (error) {
      console.error('[ConfigController.createParameter Error]', error.message);
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Atualiza um parâmetro existente
   * PUT/PATCH /api/v1/config/parameters/:id
   */
  static async updateParameter(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ success: false, message: 'ID de parâmetro inválido.' });
      }

      const updated = SystemParameter.update(id, req.body || {});
      return res.status(200).json({
        success: true,
        message: `Parâmetro "${updated.name}" atualizado com sucesso!`,
        data: updated
      });
    } catch (error) {
      console.error('[ConfigController.updateParameter Error]', error.message);
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Elimina um parâmetro
   * DELETE /api/v1/config/parameters/:id
   */
  static async deleteParameter(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ success: false, message: 'ID de parâmetro inválido.' });
      }

      const param = SystemParameter.findById(id);
      if (!param) {
        return res.status(404).json({ success: false, message: 'Parâmetro não encontrado.' });
      }

      SystemParameter.delete(id);
      return res.status(200).json({
        success: true,
        message: `Parâmetro "${param.name}" removido com sucesso!`
      });
    } catch (error) {
      console.error('[ConfigController.deleteParameter Error]', error.message);
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = ConfigController;
