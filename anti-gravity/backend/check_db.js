const pool = require("./src/config/database");

async function checkTables() {
  try {
    const res = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log(
      "Existing tables:",
      res.rows.map((r) => r.table_name),
    );
  } catch (err) {
    console.error("Error checking tables:", err);
  } finally {
    process.exit();
  }
}

checkTables();
