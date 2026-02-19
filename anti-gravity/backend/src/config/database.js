const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST || "10.20.0.7",
  port: parseInt(process.env.DB_PORT) || 25432,
  database: process.env.DB_NAME || "anti_gravity",
  user: process.env.DB_USER || "mkt",
  password: process.env.DB_PASS || "JRAEm66Ytw9H4HX9xoDV",
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
});

// Test connection
pool
  .query("SELECT NOW()")
  .then(() => console.log("✅ Database connected successfully"))
  .catch((err) => console.error("❌ Database connection failed:", err.message));

module.exports = pool;
