-- ============================================
-- Anti Gravity - Food Order Application
-- DML (Data Manipulation Language) - Seed Data
-- ============================================

-- ============================================
-- General Parameters (No hardcoded values)
-- ============================================

-- Order Status Options
INSERT INTO food_mst_general_param (param_id, param_group, param_key, param_value, param_description, param_order)
VALUES
    (uuid_generate_v4(), 'ORDER_STATUS', 'pending', 'Menunggu Konfirmasi', 'Order baru masuk', 1),
    (uuid_generate_v4(), 'ORDER_STATUS', 'confirmed', 'Dikonfirmasi', 'Order dikonfirmasi admin', 2),
    (uuid_generate_v4(), 'ORDER_STATUS', 'preparing', 'Sedang Disiapkan', 'Merchant sedang menyiapkan', 3),
    (uuid_generate_v4(), 'ORDER_STATUS', 'ready', 'Siap Diambil', 'Pesanan siap diambil', 4),
    (uuid_generate_v4(), 'ORDER_STATUS', 'picked_up', 'Sudah Diambil', 'Admin sudah pickup', 5),
    (uuid_generate_v4(), 'ORDER_STATUS', 'delivered', 'Terkirim', 'Pesanan sudah sampai', 6),
    (uuid_generate_v4(), 'ORDER_STATUS', 'cancelled', 'Dibatalkan', 'Order dibatalkan', 7)
ON CONFLICT DO NOTHING;

-- Menu Categories
INSERT INTO food_mst_general_param (param_id, param_group, param_key, param_value, param_description, param_order)
VALUES
    (uuid_generate_v4(), 'MENU_CATEGORY', 'makanan', 'Makanan', 'Kategori makanan utama', 1),
    (uuid_generate_v4(), 'MENU_CATEGORY', 'minuman', 'Minuman', 'Kategori minuman', 2),
    (uuid_generate_v4(), 'MENU_CATEGORY', 'snack', 'Snack', 'Kategori makanan ringan', 3),
    (uuid_generate_v4(), 'MENU_CATEGORY', 'dessert', 'Dessert', 'Kategori makanan penutup', 4)
ON CONFLICT DO NOTHING;

-- WhatsApp Config
INSERT INTO food_mst_general_param (param_id, param_group, param_key, param_value, param_description, param_order)
VALUES
    (uuid_generate_v4(), 'WHATSAPP', 'admin_number', '6281234567890', 'Nomor WhatsApp Admin', 1),
    (uuid_generate_v4(), 'WHATSAPP', 'greeting_message', 'Halo min, saya sudah selesai order', 'Pesan default WhatsApp', 2)
ON CONFLICT DO NOTHING;

-- App Config
INSERT INTO food_mst_general_param (param_id, param_group, param_key, param_value, param_description, param_order)
VALUES
    (uuid_generate_v4(), 'APP_CONFIG', 'app_name', 'Anti Gravity', 'Nama aplikasi', 1),
    (uuid_generate_v4(), 'APP_CONFIG', 'app_tagline', 'Order Makanan Mudah & Cepat', 'Tagline aplikasi', 2),
    (uuid_generate_v4(), 'APP_CONFIG', 'currency', 'IDR', 'Mata uang', 3),
    (uuid_generate_v4(), 'APP_CONFIG', 'min_order', '10000', 'Minimum order amount', 4)
ON CONFLICT DO NOTHING;

-- ============================================
-- Sample Menu Data
-- ============================================

INSERT INTO food_mst_menu (menu_id, menu_name, menu_code, menu_price, menu_category, menu_description, menu_image_url, menu_is_available)
VALUES
    -- Makanan
    (uuid_generate_v4(), 'Nasi Goreng Spesial', 'MKN-001', 25000, 'Makanan', 'Nasi goreng dengan telur, ayam, dan sayuran segar', 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400', true),
    (uuid_generate_v4(), 'Mie Ayam Bakso', 'MKN-002', 20000, 'Makanan', 'Mie ayam dengan bakso sapi homemade', 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400', true),
    (uuid_generate_v4(), 'Ayam Geprek', 'MKN-003', 18000, 'Makanan', 'Ayam crispy dengan sambal geprek level 1-5', 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400', true),
    (uuid_generate_v4(), 'Sate Ayam', 'MKN-004', 22000, 'Makanan', '10 tusuk sate ayam dengan bumbu kacang', 'https://images.unsplash.com/photo-1529563021893-cc83c992d75d?w=400', true),
    (uuid_generate_v4(), 'Burger Daging Premium', 'MKN-005', 35000, 'Makanan', 'Beef burger dengan cheese, lettuce, dan special sauce', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', true),
    (uuid_generate_v4(), 'Chicken Wings', 'MKN-006', 28000, 'Makanan', '6 pcs chicken wings BBQ / spicy', 'https://images.unsplash.com/photo-1608039755401-742074f0548d?w=400', true),

    -- Minuman
    (uuid_generate_v4(), 'Es Teh Manis', 'MNM-001', 5000, 'Minuman', 'Teh manis dingin segar', 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400', true),
    (uuid_generate_v4(), 'Es Jeruk', 'MNM-002', 8000, 'Minuman', 'Jeruk peras segar dengan es', 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400', true),
    (uuid_generate_v4(), 'Kopi Susu Gula Aren', 'MNM-003', 18000, 'Minuman', 'Es kopi susu dengan gula aren premium', 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400', true),
    (uuid_generate_v4(), 'Matcha Latte', 'MNM-004', 22000, 'Minuman', 'Matcha premium dari Jepang dengan susu segar', 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=400', true),

    -- Snack
    (uuid_generate_v4(), 'French Fries', 'SNK-001', 15000, 'Snack', 'Kentang goreng crispy dengan saus', 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400', true),
    (uuid_generate_v4(), 'Tahu Crispy', 'SNK-002', 10000, 'Snack', 'Tahu goreng crispy dengan cabai rawit', 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400', true),
    (uuid_generate_v4(), 'Risol Mayo', 'SNK-003', 12000, 'Snack', '4 pcs risol isi mayo dan smoked beef', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400', true),

    -- Dessert
    (uuid_generate_v4(), 'Es Krim Sundae', 'DST-001', 15000, 'Dessert', 'Ice cream dengan topping coklat dan kacang', 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400', true),
    (uuid_generate_v4(), 'Pancake', 'DST-002', 20000, 'Dessert', 'Pancake fluffy dengan maple syrup dan butter', 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400', true)
ON CONFLICT DO NOTHING;
