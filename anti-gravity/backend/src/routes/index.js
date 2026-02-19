const express = require("express");
const router = express.Router();

// API version prefix
router.use("/menus", require("./menuRoutes"));
router.use("/orders", require("./orderRoutes"));

// Health check
router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Anti Gravity API is healthy 🚀",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

module.exports = router;
