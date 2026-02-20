-- ============================================
-- Anti Gravity - Food Order Application
-- DDL (Data Definition Language)
-- Database Convention:
--   Table: {modul}_mst_{fitur}, {modul}_trx_{fitur}, {modul}_log_{fitur}
--   Column: {fitur}_{jenis}
--   PK/FK: UUID
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- MASTER TABLES
-- ============================================

-- General Parameter Table (No hardcoded values)
CREATE TABLE IF NOT EXISTS food_mst_general_param (
    param_id        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    param_group     VARCHAR(50) NOT NULL,
    param_key       VARCHAR(100) NOT NULL,
    param_value     TEXT NOT NULL,
    param_description TEXT,
    param_order     INTEGER DEFAULT 0,
    param_is_active BOOLEAN DEFAULT TRUE,
    param_created_at TIMESTAMP DEFAULT NOW(),
    param_updated_at TIMESTAMP DEFAULT NOW()
);

-- Unique constraint: group + key combination
CREATE UNIQUE INDEX IF NOT EXISTS idx_param_group_key 
    ON food_mst_general_param(param_group, param_key);

-- Index for frequently queried columns
CREATE INDEX IF NOT EXISTS idx_param_group 
    ON food_mst_general_param(param_group);

-- ============================================
-- Menu Master Table
-- ============================================
CREATE TABLE IF NOT EXISTS food_mst_menu (
    menu_id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    menu_name        VARCHAR(100) NOT NULL,
    menu_code        VARCHAR(20),
    menu_price       DECIMAL(12,2) NOT NULL DEFAULT 0,
    menu_category    VARCHAR(50) NOT NULL,
    menu_description TEXT,
    menu_image_url   TEXT,
    menu_is_available BOOLEAN DEFAULT TRUE,
    menu_options     JSONB DEFAULT '[]',
    menu_created_at  TIMESTAMP DEFAULT NOW(),
    menu_updated_at  TIMESTAMP DEFAULT NOW()
);

-- Unique constraint for menu name within category
CREATE UNIQUE INDEX IF NOT EXISTS idx_menu_name_category 
    ON food_mst_menu(menu_name, menu_category);

-- Index for category filtering
CREATE INDEX IF NOT EXISTS idx_menu_category 
    ON food_mst_menu(menu_category);

-- Index for availability filtering
CREATE INDEX IF NOT EXISTS idx_menu_available 
    ON food_mst_menu(menu_is_available);

-- ============================================
-- TRANSACTION TABLES
-- ============================================

-- Order Transaction Table
CREATE TABLE IF NOT EXISTS food_trx_order (
    order_id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_code          VARCHAR(30) NOT NULL,
    order_customer_name VARCHAR(100) NOT NULL,
    order_customer_phone VARCHAR(20) NOT NULL,
    order_notes         TEXT,
    order_total_amount  DECIMAL(12,2) NOT NULL DEFAULT 0,
    order_status        VARCHAR(20) NOT NULL DEFAULT 'pending',
    order_created_at    TIMESTAMP DEFAULT NOW(),
    order_updated_at    TIMESTAMP DEFAULT NOW()
);

-- Unique constraint for order code
CREATE UNIQUE INDEX IF NOT EXISTS idx_order_code 
    ON food_trx_order(order_code);

-- Index for status filtering
CREATE INDEX IF NOT EXISTS idx_order_status 
    ON food_trx_order(order_status);

-- Index for date-based queries
CREATE INDEX IF NOT EXISTS idx_order_created_at 
    ON food_trx_order(order_created_at DESC);

-- Index for customer phone lookup
CREATE INDEX IF NOT EXISTS idx_order_customer_phone 
    ON food_trx_order(order_customer_phone);

-- ============================================
-- Order Item Transaction Table
-- ============================================
CREATE TABLE IF NOT EXISTS food_trx_order_item (
    order_item_id       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id            UUID NOT NULL,
    menu_id             UUID NOT NULL,
    order_item_quantity INTEGER NOT NULL DEFAULT 1,
    order_item_price    DECIMAL(12,2) NOT NULL DEFAULT 0,
    order_item_subtotal DECIMAL(12,2) NOT NULL DEFAULT 0,
    order_item_notes    TEXT,
    order_item_created_at TIMESTAMP DEFAULT NOW(),

    -- Foreign Keys
    CONSTRAINT fk_order_item_order 
        FOREIGN KEY (order_id) REFERENCES food_trx_order(order_id) ON DELETE CASCADE,
    CONSTRAINT fk_order_item_menu 
        FOREIGN KEY (menu_id) REFERENCES food_mst_menu(menu_id) ON DELETE RESTRICT
);

-- Index for order lookup
CREATE INDEX IF NOT EXISTS idx_order_item_order_id 
    ON food_trx_order_item(order_id);

-- Index for menu lookup
CREATE INDEX IF NOT EXISTS idx_order_item_menu_id 
    ON food_trx_order_item(menu_id);

-- ============================================
-- LOG TABLES
-- ============================================

-- Order Log Table
CREATE TABLE IF NOT EXISTS food_log_order (
    log_id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id        UUID NOT NULL,
    log_action      VARCHAR(50) NOT NULL,
    log_description TEXT,
    log_created_at  TIMESTAMP DEFAULT NOW(),
    log_created_by  VARCHAR(100),

    -- Foreign Key
    CONSTRAINT fk_log_order 
        FOREIGN KEY (order_id) REFERENCES food_trx_order(order_id) ON DELETE CASCADE
);

-- Index for order log lookup
CREATE INDEX IF NOT EXISTS idx_log_order_id 
    ON food_log_order(order_id);

-- Index for action filtering
CREATE INDEX IF NOT EXISTS idx_log_action 
    ON food_log_order(log_action);

-- Index for date-based queries
CREATE INDEX IF NOT EXISTS idx_log_created_at 
    ON food_log_order(log_created_at DESC);

-- ============================================
-- LOYALTY TABLES
-- ============================================

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

