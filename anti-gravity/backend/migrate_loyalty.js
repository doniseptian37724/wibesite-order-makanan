const pool = require("./src/config/database");

const ddl = `
-- Customer Master Table
CREATE TABLE IF NOT EXISTS food_mst_customer (
    customer_id      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name    VARCHAR(100) NOT NULL,
    customer_phone   VARCHAR(20) NOT NULL UNIQUE,
    customer_points  INTEGER DEFAULT 0,
    customer_tier    VARCHAR(20) DEFAULT 'Bronze',
    customer_created_at TIMESTAMP DEFAULT NOW(),
    customer_updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for phone lookup
CREATE INDEX IF NOT EXISTS idx_customer_phone 
    ON food_mst_customer(customer_phone);

-- Voucher Transaction Table
CREATE TABLE IF NOT EXISTS food_trx_voucher (
    voucher_id       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id      UUID NOT NULL,
    voucher_name     VARCHAR(100) NOT NULL,
    voucher_value    DECIMAL(12,2) NOT NULL,
    voucher_type     VARCHAR(20) DEFAULT 'discount',
    voucher_is_used  BOOLEAN DEFAULT FALSE,
    voucher_created_at TIMESTAMP DEFAULT NOW(),
    voucher_used_at    TIMESTAMP,

    -- Foreign Key
    CONSTRAINT fk_voucher_customer
        FOREIGN KEY (customer_id) REFERENCES food_mst_customer(customer_id) ON DELETE CASCADE
);

-- Index for customer voucher lookup
CREATE INDEX IF NOT EXISTS idx_voucher_customer_id 
    ON food_trx_voucher(customer_id);
`;

async function runMigration() {
  try {
    await pool.query(ddl);
    console.log("✅ Loyalty tables created successfully");
  } catch (err) {
    console.error("❌ Error creating loyalty tables:", err);
  } finally {
    process.exit();
  }
}

runMigration();
