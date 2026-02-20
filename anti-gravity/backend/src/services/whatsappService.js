const axios = require("axios");

/**
 * Service to handle WhatsApp notifications via 3rd party Gateway (e.g. Fonnte)
 */
class WhatsAppService {
  constructor() {
    this.apiKey = process.env.WA_API_KEY || "";
    this.adminNumber = process.env.WHATSAPP_ADMIN_NUMBER || "";
    this.groupId = process.env.WHATSAPP_GROUP_ID || "";
  }

  /**
   * Universal send message
   */
  async sendMessage(target, message) {
    if (!this.apiKey || !target) return false;

    try {
      const response = await axios.post(
        "https://api.fonnte.com/send",
        {
          target: target,
          message: message,
          countryCode: "62",
          delay: "2",
          typing: true,
        },
        {
          headers: { Authorization: this.apiKey },
          timeout: 10000,
        },
      );
      return response.data;
    } catch (err) {
      const errMsg = err.response?.data?.reason || err.message;
      console.error(`Fonnte Error [${target}]:`, errMsg);
      return { status: false, error: errMsg };
    }
  }

  /**
   * Send message to Admin
   */
  async sendMessageToAdmin(message) {
    if (!this.apiKey || !this.adminNumber || this.apiKey.includes("DISINI")) {
      return {
        success: false,
        error: "Konfigurasi WhatsApp belum lengkap di file .env",
      };
    }

    const targets = [this.adminNumber];
    if (this.groupId) targets.push(this.groupId);

    const results = [];
    for (const target of targets) {
      const res = await this.sendMessage(target, message);
      results.push({ target, data: res });
    }

    const anySuccess = results.some(
      (r) => r.data && (r.data.status === true || r.data.status === "true"),
    );
    return {
      success: anySuccess,
      details: results,
    };
  }

  /**
   * Send message to Customer (Confirmation)
   */
  async sendMessageToCustomer(target, message) {
    return await this.sendMessage(target, message);
  }

  /**
   * Build Order Message for WhatsApp
   */
  buildOrderMessage(order, items) {
    let msg = `🚨 *ADA PESANAN BARU!* 🚨\n`;
    msg += `--------------------------------\n`;
    msg += `📦 *KODE:* [${order.order_code}]\n`;
    msg += `👤 *Customer:* ${order.order_customer_name}\n`;
    msg += `📞 *WA:* ${order.order_customer_phone}\n\n`;

    msg += `🛒 *PESANAN:* \n`;
    items.forEach((it, idx) => {
      // Support both live DB fields and demo mode fields
      const qty = it.order_item_quantity || it.quantity || 1;
      const notes = it.order_item_notes || it.notes || it.item_notes;
      const name = it.menu_name || "Item";
      msg += `${idx + 1}. ${name} (x${qty})\n`;
      if (notes) msg += `   └─ 📝 Ket: ${notes}\n`;
    });

    msg += `\n💰 *TOTAL:* *Rp ${order.order_total_amount.toLocaleString()}*\n`;
    if (order.order_notes) msg += `\n📝 *CATATAN:* ${order.order_notes}\n`;

    msg += `\n--------------------------------\n`;
    msg += `🔔 *Segera cek dashboard admin!* 🚀\n`;
    msg += `_Dering & Getar Aktif!_`;
    return msg;
  }

  /**
   * Build Confirmation Message for Customer
   */
  buildCustomerMessage(order) {
    let msg = `Halo *${order.order_customer_name}*! 👋\n\n`;
    msg += `Terima kasih! Pesanan Anda telah diterima oleh *Anti Gravity*.\n\n`;
    msg += `🆔 *Kode:* [${order.order_code}]\n`;
    msg += `💰 *Total:* *Rp ${order.order_total_amount.toLocaleString()}*\n\n`;
    msg += `Sistem sedang meneruskan pesanan Anda ke dapur. Kami akan segera memprosesnya! 👨‍🍳\n\n`;
    msg += `--------------------------------\n`;
    msg += `Ada kendala? Hubungi Admin kami:\n`;
    msg += `wa.me/${this.adminNumber.replace(/\D/g, "")}\n\n`;
    msg += `_Terima kasih sudah memesan!_ 🚀`;
    return msg;
  }
}

module.exports = new WhatsAppService();
