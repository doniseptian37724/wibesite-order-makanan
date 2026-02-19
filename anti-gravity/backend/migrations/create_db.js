const { Pool } = require("pg");
require("dotenv").config();

async function createDatabase() {
  // Connect to default 'postgres' database first
  const pool = new Pool({
    host: process.env.DB_HOST || "10.20.0.7",
    port: parseInt(process.env.DB_PORT) || 25432,
    database: "postgres",
    user: process.env.DB_USER || "mkt",
    password: process.env.DB_PASS || "JRAEm66Ytw9H4HX9xoDV",
    connectionTimeoutMillis: 10000,
  });

  try {
    console.log("🔄 Connecting to PostgreSQL server...");
    await pool.query("SELECT 1");
    console.log("✅ Connected to PostgreSQL");

    // Check if database exists
    const dbName = process.env.DB_NAME || "anti_gravity";
    const result = await pool.query(
      `SELECT datname FROM pg_database WHERE datname = $1`,
      [dbName],
    );

    if (result.rows.length === 0) {
      console.log(`🔄 Creating database "${dbName}"...`);
      await pool.query(`CREATE DATABASE ${dbName}`);
      console.log(`✅ Database "${dbName}" created successfully!`);
    } else {
      console.log(`ℹ️  Database "${dbName}" already exists`);
    }
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

createDatabase();
