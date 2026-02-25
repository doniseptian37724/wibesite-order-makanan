const express = require("express");
const router = express.Router();

// API version prefix
router.use("/menus", require("./menuRoutes"));
router.use("/orders", require("./orderRoutes"));
router.use("/customers", require("./customerRoutes"));

// Health check
router.get("/health", (req, res) => {
  const pool = require("../config/database");
  const dbConnected = pool.isConnected();
  const config = require("../config/env");
  res.json({
    success: true,
    message: "Order Makanan & Minuman API is healthy 🚀",
    mode: dbConnected
      ? "🟢 Live (Database Connected)"
      : "🟡 Demo (No Database)",
    service: process.env.RAILWAY_SERVICE_NAME || "unknown",
    nodeEnv: process.env.NODE_ENV || "unknown",
    project: process.env.RAILWAY_PROJECT_NAME || "unknown",
    domain: process.env.RAILWAY_PUBLIC_DOMAIN || "unknown",
    commit: process.env.RAILWAY_GIT_COMMIT_SHA || "unknown",
    whatsappConfig: {
      adminNumber: !!config.whatsappAdminNumber,
      apiKey: !!config.waApiKey,
      groupId: !!config.whatsappGroupId,
      keys: Object.keys(process.env).filter(
        (k) => k.startsWith("WA") || k.startsWith("WHATSAPP"),
      ),
      wa_key_exists: !!process.env.WA_API_KEY,
      admin_num_exists: !!process.env.WHATSAPP_ADMIN_NUMBER,
    },
    all_env_keys: Object.keys(process.env).sort(),
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Test WA Connection
router.get("/test-wa", async (req, res) => {
  const whatsappService = require("../services/whatsappService");
  const testMsg =
    "🚀 *TES KONEKSI ORDER MAKANAN & MINUMAN*\n\nJika Anda menerima pesan ini, berarti sistem WhatsApp otomatis Anda sudah AKTIF dan SIAP menerima pesanan! 🔥";

  const result = await whatsappService.sendMessageToAdmin(testMsg);

  if (result.success) {
    res.json({
      success: true,
      message: "Tes terkirim ke WhatsApp Admin!",
      details: result.details,
    });
  } else {
    // If it's a config error, use 400 instead of 500
    const statusCode = result.error ? 400 : 500;
    res.status(statusCode).json({
      success: false,
      message: result.error || "Gagal mengirim tes via Fonnte.",
      details: result.details || result.error || "Konfigurasi tidak valid",
    });
  }
});

module.exports = router;
