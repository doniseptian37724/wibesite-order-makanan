const menuService = require("../services/menuService");
const { success, error } = require("../utils/response");
const { sanitizeObject } = require("../utils/sanitize");

const menuController = {
  /**
   * GET /api/v1/menus
   */
  async getAll(req, res, next) {
    try {
      const { category, admin_view } = req.query;
      const includeHidden = admin_view === "true";
      const menus = await menuService.getAll(category, includeHidden);
      return success(res, menus, "Daftar menu berhasil diambil");
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/v1/menus/categories
   */
  async getCategories(req, res, next) {
    try {
      const categories = await menuService.getCategories();
      return success(res, categories, "Kategori berhasil diambil");
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/v1/menus/:id
   */
  async getById(req, res, next) {
    try {
      const menu = await menuService.getById(req.params.id);
      if (!menu) return error(res, "Menu tidak ditemukan", 404);
      return success(res, menu, "Detail menu berhasil diambil");
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/v1/menus (Admin only)
   */
  async create(req, res, next) {
    try {
      const sanitized = sanitizeObject(req.body);
      const menu = await menuService.create(sanitized);
      return success(res, menu, "Menu berhasil ditambahkan", 201);
    } catch (err) {
      next(err);
    }
  },

  /**
   * PUT /api/v1/menus/:id (Admin only)
   */
  async update(req, res, next) {
    try {
      const sanitized = sanitizeObject(req.body);
      const menu = await menuService.update(req.params.id, sanitized);
      if (!menu) return error(res, "Menu tidak ditemukan", 404);
      return success(res, menu, "Menu berhasil diperbarui");
    } catch (err) {
      next(err);
    }
  },

  /**
   * DELETE /api/v1/menus/:id (Admin only)
   */
  async delete(req, res, next) {
    try {
      const menu = await menuService.delete(req.params.id);
      if (!menu) return error(res, "Menu tidak ditemukan", 404);
      return success(res, menu, "Menu berhasil dihapus");
    } catch (err) {
      next(err);
    }
  },
};

module.exports = menuController;
