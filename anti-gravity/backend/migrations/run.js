/**
 * Migration Runner
 * Executes DDL.sql and DML.sql against the database
 */
const fs = require("fs");
const path = require("path");
const pool = require("../src/config/database");

async function runMigration() {
  const client = await pool.connect();
  try {
    console.log("🔄 Running DDL migration...");
    const ddl = fs.readFileSync(path.join(__dirname, "DDL.sql"), "utf8");
    await client.query(ddl);
    console.log("✅ DDL migration completed");

    console.log("🔄 Running DML seed...");
    const dml = fs.readFileSync(path.join(__dirname, "DML.sql"), "utf8");
    await client.query(dml);
    console.log("✅ DML seed completed");

    console.log("🎉 All migrations completed successfully!");
  } catch (err) {
    console.error("❌ Migration failed:", err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration();
