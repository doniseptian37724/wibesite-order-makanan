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
  res.json({
    success: true,
    message: "Anti Gravity API is healthy 🚀",
    mode: dbConnected
      ? "🟢 Live (Database Connected)"
      : "🟡 Demo (No Database)",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Test WA Connection
router.get("/test-wa", async (req, res) => {
  const whatsappService = require("../services/whatsappService");
  const testMsg =
    "🚀 *TES KONEKSI ANTI GRAVITY*\n\nJika Anda menerima pesan ini, berarti sistem WhatsApp otomatis Anda sudah AKTIF dan SIAP menerima pesanan! 🔥";

  const result = await whatsappService.sendMessageToAdmin(testMsg);

  if (result.success) {
    res.json({
      success: true,
      message: "Tes terkirim ke WhatsApp Admin!",
      details: result.details,
    });
  } else {
    res.status(500).json({
      success: false,
      message: "Gagal mengirim tes via Fonnte.",
      details: result.details || "Konfigurasi tidak valid",
    });
  }
});

module.exports = router;
