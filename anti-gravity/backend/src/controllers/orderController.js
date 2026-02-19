const orderService = require("../services/orderService");
const { success, error, paginated } = require("../utils/response");
const { sanitizeObject } = require("../utils/sanitize");
const config = require("../config/env");

const orderController = {
  /**
   * POST /api/v1/orders
   */
  async create(req, res, next) {
    try {
      const sanitized = sanitizeObject(req.body);
      const order = await orderService.create(sanitized);

      // Build WhatsApp redirect URL
      const waMessage = buildWhatsAppMessage(order);
      const waUrl = `https://wa.me/${config.whatsappAdminNumber}?text=${encodeURIComponent(waMessage)}`;

      return success(
        res,
        { order, whatsapp_url: waUrl },
        "Order berhasil dibuat",
        201,
      );
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/v1/orders/:id
   */
  async getById(req, res, next) {
    try {
      const order = await orderService.getById(req.params.id);
      if (!order) return error(res, "Order tidak ditemukan", 404);
      return success(res, order, "Detail order berhasil diambil");
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/v1/orders/code/:code
   */
  async getByCode(req, res, next) {
    try {
      const order = await orderService.getByCode(req.params.code);
      if (!order) return error(res, "Order tidak ditemukan", 404);
      return success(res, order, "Detail order berhasil diambil");
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/v1/orders
   */
  async getAll(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const status = req.query.status || null;

      const { orders, total } = await orderService.getAll(page, limit, status);
      return paginated(
        res,
        orders,
        total,
        page,
        limit,
        "Daftar order berhasil diambil",
      );
    } catch (err) {
      next(err);
    }
  },

  /**
   * PATCH /api/v1/orders/:id/status
   */
  async updateStatus(req, res, next) {
    try {
      const order = await orderService.updateStatus(
        req.params.id,
        req.body.order_status,
      );
      return success(res, order, "Status order berhasil diperbarui");
    } catch (err) {
      next(err);
    }
  },
};

/**
 * Build WhatsApp message from order data
 */
function buildWhatsAppMessage(order) {
  let msg = `Halo min, saya sudah selesai order 🍔\n\n`;
  msg += `📋 *Detail Pesanan*\n`;
  msg += `Kode: ${order.order_code}\n`;
  msg += `Nama: ${order.order_customer_name}\n`;
  msg += `No. HP: ${order.order_customer_phone}\n\n`;
  msg += `🛒 *Item Pesanan:*\n`;

  order.items.forEach((item, idx) => {
    msg += `${idx + 1}. ${item.menu_name} x${item.quantity} = Rp ${item.item_subtotal.toLocaleString("id-ID")}\n`;
    if (item.item_notes) msg += `   📝 ${item.item_notes}\n`;
  });

  msg += `\n💰 *Total: Rp ${order.order_total_amount.toLocaleString("id-ID")}*\n`;

  if (order.order_notes) {
    msg += `\n📝 Catatan: ${order.order_notes}`;
  }

  return msg;
}

module.exports = orderController;
