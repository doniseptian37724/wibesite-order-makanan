const app = require("./app");
const config = require("./config/env");

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════╗
  ║                                          ║
  ║   🚀 Anti Gravity API Server             ║
  ║   📡 Port: ${String(PORT).padEnd(28)}║
  ║   🌍 Env: ${String(config.nodeEnv).padEnd(29)}║
  ║   📅 Started: ${new Date().toLocaleString().padEnd(24)}║
  ║                                          ║
  ╚══════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT received. Shutting down gracefully...");
  process.exit(0);
});
