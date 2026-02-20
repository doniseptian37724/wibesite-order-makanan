const { Pool } = require("pg");
require("dotenv").config();

let pool = null;
let isConnected = false;

// Create pool but don't crash if DB is unavailable
function createPool() {
  const p = new Pool({
    host: process.env.DB_HOST || "10.20.0.7",
    port: parseInt(process.env.DB_PORT) || 25432,
    database: process.env.DB_NAME || "anti_gravity",
    user: process.env.DB_USER || "mkt",
    password: process.env.DB_PASS || "",
    max: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 3000,
  });

  p.on("error", () => {
    // Silent - will be handled gracefully
  });

  return p;
}

// Test connection silently
async function testConnection() {
  try {
    pool = createPool();
    await pool.query("SELECT 1");
    isConnected = true;
    console.log("✅ Database connected successfully");
  } catch (err) {
    isConnected = false;
    console.warn("⚠️  Database tidak tersedia - Mode Demo aktif");
    console.warn("   (Hubungkan ke jaringan kantor/VPN untuk mode penuh)");
    if (pool) {
      pool.end().catch(() => {});
      pool = null;
    }
  }
}

// Run connection test
testConnection();

// Wrapper that gracefully handles DB unavailability
const dbProxy = {
  async query(text, params) {
    if (!isConnected || !pool) {
      throw new Error("DB_UNAVAILABLE");
    }
    try {
      return await pool.query(text, params);
    } catch (err) {
      if (
        err.code === "ECONNREFUSED" ||
        err.code === "ETIMEDOUT" ||
        err.message.includes("timeout")
      ) {
        isConnected = false;
      }
      throw err;
    }
  },

  async connect() {
    if (!isConnected || !pool) {
      throw new Error("DB_UNAVAILABLE");
    }
    return await pool.connect();
  },

  isConnected: () => isConnected,
};

module.exports = dbProxy;
