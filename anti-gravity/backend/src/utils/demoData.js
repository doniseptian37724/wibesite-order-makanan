/**
 * Demo Data - Digunakan saat database tidak tersedia
 * (misal: bekerja dari rumah tanpa VPN kantor)
 */

let DEMO_MENUS = [
  {
    menu_id: "demo-1",
    menu_name: "Nasi Goreng Spesial",
    menu_price: 25000,
    menu_category: "Makanan",
    menu_description:
      "Nasi goreng dengan telur, ayam, dan sayuran segar pilihan",
    menu_image_url:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400",
    menu_is_available: true,
    is_popular: true,
    rating: 4.8,
    cals: "450 Kcal",
    time: "15 Min",
  },
  {
    menu_id: "demo-2",
    menu_name: "Mie Ayam Bakso",
    menu_price: 20000,
    menu_category: "Makanan",
    menu_description:
      "Mie ayam dengan bakso sapi homemade yang kenyal dan gurih",
    menu_image_url:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400",
    menu_is_available: true,
    is_popular: false,
    rating: 4.5,
    cals: "380 Kcal",
    time: "10 Min",
  },
  {
    menu_id: "demo-3",
    menu_name: "Chicken Burger",
    menu_price: 35000,
    menu_category: "Makanan",
    menu_description: "Burger ayam krispi dengan keju dan saus rahasia",
    menu_image_url:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
    menu_is_available: true,
    is_popular: true,
    rating: 4.7,
    cals: "520 Kcal",
    time: "12 Min",
  },
  {
    menu_id: "demo-4",
    menu_name: "Es Teh Manis",
    menu_price: 5000,
    menu_category: "Minuman",
    menu_description: "Teh manis segar yang melegakan dahaga",
    menu_image_url:
      "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400",
    menu_is_available: true,
    is_popular: true,
    rating: 4.9,
    cals: "80 Kcal",
    time: "2 Min",
  },
  {
    menu_id: "demo-5",
    menu_name: "Jus Alpukat",
    menu_price: 15000,
    menu_category: "Minuman",
    menu_description: "Jus alpukat segar dengan susu kental manis",
    menu_image_url:
      "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400",
    menu_is_available: true,
    is_popular: false,
    rating: 4.6,
    cals: "220 Kcal",
    time: "5 Min",
  },
  {
    menu_id: "demo-6",
    menu_name: "Pisang Goreng Coklat",
    menu_price: 12000,
    menu_category: "Snack",
    menu_description: "Pisang goreng renyah dengan topping coklat dan keju",
    menu_image_url:
      "https://images.unsplash.com/photo-1534482421-64566f976cfa?w=400",
    menu_is_available: true,
    is_popular: false,
    rating: 4.4,
    cals: "310 Kcal",
    time: "8 Min",
  },
];

// In-memory order store for demo mode
let demoOrders = [];

function getDemoMenus(category = null, includeHidden = false) {
  let menus = [...DEMO_MENUS];
  if (!includeHidden) {
    menus = menus.filter((m) => m.menu_is_available);
  }
  if (category) {
    menus = menus.filter((m) => m.menu_category === category);
  }
  return menus;
}

function getDemoMenu(id) {
  return DEMO_MENUS.find((m) => m.menu_id === id) || null;
}

function createDemoMenu(data) {
  const newMenu = {
    menu_id: `demo-${Date.now()}`,
    ...data,
    menu_is_available:
      data.menu_is_available !== undefined ? data.menu_is_available : true,
    menu_created_at: new Date().toISOString(),
    menu_updated_at: new Date().toISOString(),
  };
  DEMO_MENUS.push(newMenu);
  return newMenu;
}

function updateDemoMenu(id, data) {
  const idx = DEMO_MENUS.findIndex((m) => m.menu_id === id);
  if (idx === -1) return null;

  DEMO_MENUS[idx] = {
    ...DEMO_MENUS[idx],
    ...data,
    menu_updated_at: new Date().toISOString(),
  };
  return DEMO_MENUS[idx];
}

function deleteDemoMenu(id) {
  const idx = DEMO_MENUS.findIndex((m) => m.menu_id === id);
  if (idx === -1) return null;

  // Soft delete for demo (mark as unavailable)
  DEMO_MENUS[idx].menu_is_available = false;
  DEMO_MENUS[idx].menu_updated_at = new Date().toISOString();
  return DEMO_MENUS[idx];
}

function getDemoCategories() {
  return [...new Set(DEMO_MENUS.map((m) => m.menu_category))].sort();
}

function createDemoOrder(data) {
  // Calculate total from items if not explicitly provided
  let total = data.order_total_amount;
  if (!total) {
    total = (data.items || []).reduce(
      (sum, item) => sum + (item.menu_price || 0) * (item.quantity || 1),
      0,
    );
  }

  const order = {
    order_id: `demo-order-${Date.now()}`,
    order_code: `OM-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    order_customer_name: data.order_customer_name,
    order_customer_phone: data.order_customer_phone,
    order_total_amount: total,
    order_notes: data.order_notes || null,
    order_status: "pending",
    order_created_at: new Date().toISOString(),
    order_updated_at: new Date().toISOString(),
    items: (data.items || []).map((item) => ({
      menu_id: item.menu_id,
      menu_name: item.menu_name || "Item",
      order_item_quantity: item.quantity,
      quantity: item.quantity,
      order_item_notes: item.notes || item.item_notes || null,
      item_subtotal: (item.menu_price || 0) * (item.quantity || 1),
      item_price: item.menu_price || 0,
    })),
  };
  demoOrders.unshift(order);
  return order;
}

function getDemoOrders(status = null) {
  if (status && status !== "all") {
    return demoOrders.filter((o) => o.order_status === status);
  }
  return demoOrders;
}

function updateDemoOrderStatus(id, status) {
  const order = demoOrders.find((o) => o.order_id === id);
  if (order) order.order_status = status;
  return order;
}

module.exports = {
  getDemoMenus,
  getDemoMenu,
  createDemoMenu,
  updateDemoMenu,
  deleteDemoMenu,
  getDemoCategories,
  createDemoOrder,
  getDemoOrders,
  updateDemoOrderStatus,
  isDemoMode: () => true,
};
