/**
 * Anti Gravity - Food Order App
 * Frontend JavaScript - Enhanced Version
 */

// ============================================
// Configuration
// ============================================
const CONFIG = {
  API_BASE:
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
      ? "http://localhost:3000/api/v1"
      : "/api/v1",
  WA_ADMIN_NUMBER: "6281234567890",
  CURRENCY: "IDR",
  APP_NAME: "Anti Gravity",
  // Operational hours (24h format)
  OPEN_HOUR: 8,
  CLOSE_HOUR: 22,
};

// ============================================
// State Management
// ============================================
const state = {
  menus: [],
  filteredMenus: [],
  cart: JSON.parse(localStorage.getItem("ag_cart") || "[]"),
  activeCategory: "all",
  searchQuery: "",
  sortMode: "default", // default | price-asc | price-desc | name
  theme: localStorage.getItem("ag_theme") || "dark",
  // Detail modal state
  detailMenu: null,
  detailQty: 1,
  detailNote: "",
};

// ============================================
// Sample Menu Data (Fallback when API unavailable)
// ============================================
const SAMPLE_MENUS = [
  {
    menu_id: "1",
    menu_name: "Nasi Goreng Spesial",
    menu_price: 25000,
    menu_category: "Makanan",
    menu_description:
      "Nasi goreng dengan telur, ayam, dan sayuran segar pilihan",
    menu_image_url:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400",
    is_popular: true,
  },
  {
    menu_id: "2",
    menu_name: "Mie Ayam Bakso",
    menu_price: 20000,
    menu_category: "Makanan",
    menu_description:
      "Mie ayam dengan bakso sapi homemade yang kenyal dan gurih",
    menu_image_url:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400",
    is_popular: false,
  },
  {
    menu_id: "3",
    menu_name: "Ayam Geprek",
    menu_price: 18000,
    menu_category: "Makanan",
    menu_description:
      "Ayam crispy dengan sambal geprek level 1-5, dijamin nagih!",
    menu_image_url:
      "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400",
    is_popular: true,
  },
  {
    menu_id: "4",
    menu_name: "Sate Ayam",
    menu_price: 22000,
    menu_category: "Makanan",
    menu_description: "10 tusuk sate ayam dengan bumbu kacang spesial",
    menu_image_url:
      "https://images.unsplash.com/photo-1529563021893-cc83c992d75d?w=400",
    is_popular: false,
  },
  {
    menu_id: "5",
    menu_name: "Burger Daging Premium",
    menu_price: 35000,
    menu_category: "Makanan",
    menu_description:
      "Beef burger dengan double patty, cheese slice, dan special sauce",
    menu_image_url:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
    is_popular: true,
  },
  {
    menu_id: "6",
    menu_name: "Chicken Wings",
    menu_price: 28000,
    menu_category: "Makanan",
    menu_description: "6 pcs chicken wings pilihan BBQ atau spicy buffalo",
    menu_image_url:
      "https://images.unsplash.com/photo-1608039755401-742074f0548d?w=400",
    is_popular: false,
  },
  {
    menu_id: "7",
    menu_name: "Es Teh Manis",
    menu_price: 5000,
    menu_category: "Minuman",
    menu_description: "Teh manis dingin segar, cocok menemani makan siangmu",
    menu_image_url:
      "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400",
    is_popular: false,
  },
  {
    menu_id: "8",
    menu_name: "Es Jeruk",
    menu_price: 8000,
    menu_category: "Minuman",
    menu_description: "Jeruk peras segar dengan es batu, tanpa pengawet",
    menu_image_url:
      "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400",
    is_popular: false,
  },
  {
    menu_id: "9",
    menu_name: "Kopi Susu Gula Aren",
    menu_price: 18000,
    menu_category: "Minuman",
    menu_description: "Es kopi susu dengan gula aren premium dari Jawa",
    menu_image_url:
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400",
    is_popular: true,
  },
  {
    menu_id: "10",
    menu_name: "Matcha Latte",
    menu_price: 22000,
    menu_category: "Minuman",
    menu_description: "Matcha premium dari Jepang dengan susu segar pilihan",
    menu_image_url:
      "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=400",
    is_popular: false,
  },
  {
    menu_id: "11",
    menu_name: "French Fries",
    menu_price: 15000,
    menu_category: "Snack",
    menu_description: "Kentang goreng crispy dengan saos tomat dan mayo",
    menu_image_url:
      "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400",
    is_popular: true,
  },
  {
    menu_id: "12",
    menu_name: "Tahu Crispy",
    menu_price: 10000,
    menu_category: "Snack",
    menu_description: "Tahu goreng crispy dengan cabai rawit dan kecap",
    menu_image_url:
      "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400",
    is_popular: false,
  },
  {
    menu_id: "13",
    menu_name: "Risol Mayo",
    menu_price: 12000,
    menu_category: "Snack",
    menu_description: "4 pcs risol isi mayo, keju, dan smoked beef",
    menu_image_url:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400",
    is_popular: false,
  },
  {
    menu_id: "14",
    menu_name: "Es Krim Sundae",
    menu_price: 15000,
    menu_category: "Dessert",
    menu_description:
      "Ice cream 2 scoop dengan topping coklat dan kacang tanah",
    menu_image_url:
      "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400",
    is_popular: false,
  },
  {
    menu_id: "15",
    menu_name: "Pancake Stack",
    menu_price: 20000,
    menu_category: "Dessert",
    menu_description:
      "3 lapis pancake fluffy dengan maple syrup, butter, dan buah",
    menu_image_url:
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400",
    is_popular: true,
  },
];

// ============================================
// DOM Elements
// ============================================
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const DOM = {
  splash: $("#splash-screen"),
  app: $("#app"),
  menuGrid: $("#menu-grid"),
  menuEmpty: $("#menu-empty"),
  sectionTitle: $("#section-title"),
  itemCount: $("#item-count"),
  searchInput: $("#search-menu"),
  searchClear: $("#search-clear"),
  cartBtn: $("#cart-btn"),
  cartBadge: $("#cart-badge"),
  cartOverlay: $("#cart-overlay"),
  cartSheet: $("#cart-sheet"),
  cartItems: $("#cart-items"),
  cartFooter: $("#cart-footer"),
  cartCountText: $("#cart-count-text"),
  totalAmount: $("#total-amount"),
  clearCart: $("#clear-cart"),
  checkoutBtn: $("#checkout-btn"),
  checkoutModal: $("#checkout-modal"),
  closeCheckout: $("#close-checkout"),
  summaryItems: $("#summary-items"),
  summaryTotal: $("#summary-total"),
  waOrderBtn: $("#wa-order-btn"),
  floatingCart: $("#floating-cart"),
  floatingCount: $("#floating-count"),
  floatingTotal: $("#floating-total"),
  themeToggle: $("#theme-toggle"),
  toastContainer: $("#toast-container"),
  categoryScroll: $("#category-scroll"),
  // Detail modal
  detailModal: $("#detail-modal"),
  closeDetail: $("#close-detail"),
  detailImg: $("#detail-img"),
  detailBadge: $("#detail-badge"),
  detailCategory: $("#detail-category"),
  detailPopular: $("#detail-popular"),
  detailName: $("#detail-name"),
  detailDesc: $("#detail-desc"),
  detailPrice: $("#detail-price"),
  detailQtyMinus: $("#detail-qty-minus"),
  detailQtyPlus: $("#detail-qty-plus"),
  detailQtyValue: $("#detail-qty-value"),
  detailNote: $("#detail-note"),
  detailAddBtn: $("#detail-add-btn"),
  detailAddPrice: $("#detail-add-price"),
  // Confirm modal
  confirmModal: $("#confirm-modal"),
  confirmOrderCode: $("#confirm-order-code"),
  confirmName: $("#confirm-name"),
  confirmTotal: $("#confirm-total"),
  copyCodeBtn: $("#copy-code-btn"),
  confirmCloseBtn: $("#confirm-close-btn"),
  // History panel
  historyBtn: $("#history-btn"),
  historyOverlay: $("#history-overlay"),
  historyPanel: $("#history-panel"),
  closeHistory: $("#close-history"),
  historyList: $("#history-list"),
  clearHistoryBtn: $("#clear-history-btn"),
  // Status bar
  statusDot: $("#status-dot"),
  statusText: $("#status-text"),
  statusTime: $("#status-time"),
};

// ============================================
// Utility Functions
// ============================================
function formatCurrency(amount) {
  return "Rp " + Number(amount).toLocaleString("id-ID");
}

function saveCart() {
  localStorage.setItem("ag_cart", JSON.stringify(state.cart));
}

function getCartItem(menuId) {
  return state.cart.find((item) => item.menu_id === menuId);
}

function getCartTotal() {
  return state.cart.reduce(
    (sum, item) => sum + item.menu_price * item.quantity,
    0,
  );
}

function getCartCount() {
  return state.cart.reduce((sum, item) => sum + item.quantity, 0);
}

function generateOrderCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "AG-";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function formatDateShort(isoString) {
  const d = new Date(isoString);
  return (
    d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }) +
    " " +
    d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
  );
}

// ============================================
// Operational Status
// ============================================
function initStatusBar() {
  const now = new Date();
  const hour = now.getHours();
  const isOpen = hour >= CONFIG.OPEN_HOUR && hour < CONFIG.CLOSE_HOUR;

  // Live clock
  function updateClock() {
    const t = new Date();
    DOM.statusTime.textContent = t.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  updateClock();
  setInterval(updateClock, 60000);

  if (isOpen) {
    DOM.statusDot.className = "status-dot open";
    const closeIn = CONFIG.CLOSE_HOUR - hour;
    DOM.statusText.textContent = `Sedang Buka · Tutup ${closeIn}jam lagi`;
  } else {
    DOM.statusDot.className = "status-dot closed";
    DOM.statusText.textContent = `Tutup · Buka pukul ${String(CONFIG.OPEN_HOUR).padStart(2, "0")}.00`;
  }
}

// ============================================
// Toast System
// ============================================
function showToast(message, type = "success") {
  const icons = { success: "fa-check", error: "fa-xmark", info: "fa-info" };
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <div class="toast-icon"><i class="fas ${icons[type] || "fa-info"}"></i></div>
    <span class="toast-message">${message}</span>
  `;
  DOM.toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.classList.add("removing");
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// ============================================
// Theme Management
// ============================================
function initTheme() {
  document.documentElement.setAttribute("data-theme", state.theme);
  updateThemeIcon();
}

function toggleTheme() {
  state.theme = state.theme === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", state.theme);
  localStorage.setItem("ag_theme", state.theme);
  updateThemeIcon();
}

function updateThemeIcon() {
  const icon = DOM.themeToggle.querySelector("i");
  icon.className = state.theme === "dark" ? "fas fa-sun" : "fas fa-moon";
}

// ============================================
// Menu Loading
// ============================================
async function loadMenus() {
  try {
    const res = await fetch(`${CONFIG.API_BASE}/menus`, {
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error("API Error");
    const data = await res.json();
    state.menus = data.data || [];
  } catch {
    console.log("📌 Using sample menu data (API not available)");
    state.menus = SAMPLE_MENUS;
  }
  buildCategoryTabs();
  filterAndSort();
}

// ============================================
// Dynamic Category Tabs
// ============================================
function buildCategoryTabs() {
  const categories = [
    ...new Set(state.menus.map((m) => m.menu_category)),
  ].sort();
  const catIcons = {
    Makanan: "fa-utensils",
    Minuman: "fa-glass-water",
    Snack: "fa-cookie-bite",
    Dessert: "fa-ice-cream",
  };

  // Keep "Semua" tab, add dynamic ones
  const existingTabs = $$(".category-tab");
  existingTabs.forEach((t, i) => {
    if (i > 0) t.remove();
  });

  categories.forEach((cat) => {
    const count = state.menus.filter((m) => m.menu_category === cat).length;
    const icon = catIcons[cat] || "fa-circle";
    const tab = document.createElement("button");
    tab.className = "category-tab";
    tab.dataset.category = cat;
    tab.innerHTML = `<i class="fas ${icon}"></i><span>${cat}</span><span class="cat-count">${count}</span>`;
    DOM.categoryScroll.appendChild(tab);
  });

  // Update "Semua" count
  const allBtn = $(".category-tab[data-category='all']");
  if (allBtn) {
    allBtn.innerHTML = `<i class="fas fa-fire"></i><span>Semua</span><span class="cat-count">${state.menus.length}</span>`;
  }

  // Re-attach events
  initCategoryNav();
}

// ============================================
// Menu Filtering & Sorting
// ============================================
function filterAndSort() {
  let filtered = [...state.menus];

  // Category filter
  if (state.activeCategory !== "all") {
    filtered = filtered.filter((m) => m.menu_category === state.activeCategory);
  }

  // Search filter
  if (state.searchQuery) {
    const q = state.searchQuery.toLowerCase();
    filtered = filtered.filter(
      (m) =>
        m.menu_name.toLowerCase().includes(q) ||
        m.menu_description?.toLowerCase().includes(q) ||
        m.menu_category.toLowerCase().includes(q),
    );
  }

  // Sort
  switch (state.sortMode) {
    case "price-asc":
      filtered.sort((a, b) => a.menu_price - b.menu_price);
      break;
    case "price-desc":
      filtered.sort((a, b) => b.menu_price - a.menu_price);
      break;
    case "name":
      filtered.sort((a, b) => a.menu_name.localeCompare(b.menu_name, "id"));
      break;
    default:
      // Popular first
      filtered.sort((a, b) => (b.is_popular ? 1 : 0) - (a.is_popular ? 1 : 0));
  }

  state.filteredMenus = filtered;
  renderMenus();
}

function renderMenus() {
  const { filteredMenus } = state;

  if (filteredMenus.length === 0) {
    DOM.menuGrid.innerHTML = "";
    DOM.menuEmpty.style.display = "block";
    DOM.itemCount.textContent = "0 item";
    return;
  }

  DOM.menuEmpty.style.display = "none";
  DOM.itemCount.textContent = `${filteredMenus.length} item`;

  const titles = { all: "Menu Populer" };
  DOM.sectionTitle.textContent =
    titles[state.activeCategory] || state.activeCategory;

  DOM.menuGrid.innerHTML = filteredMenus
    .map((menu, idx) => {
      const cartItem = getCartItem(menu.menu_id);
      const inCart = cartItem && cartItem.quantity > 0;
      const popularBadge = menu.is_popular
        ? `<span class="card-popular-badge">🔥 Populer</span>`
        : "";

      return `
        <div class="menu-card" style="animation-delay:${idx * 0.04}s" data-id="${menu.menu_id}" onclick="openDetailModal('${menu.menu_id}')">
          <div class="card-image">
            <img src="${menu.menu_image_url || "https://placehold.co/400x300?text=No+Image"}"
                 alt="${menu.menu_name}" loading="lazy"
                 onerror="this.src='https://placehold.co/400x300?text=No+Image'">
            <span class="card-category-badge">${menu.menu_category}</span>
            ${popularBadge}
          </div>
          <div class="card-body">
            <div class="card-name">${menu.menu_name}</div>
            <div class="card-desc">${menu.menu_description || ""}</div>
          </div>
          <div class="card-footer">
            <div class="card-price">${formatCurrency(menu.menu_price)}</div>
            ${
              inCart
                ? `<div class="qty-control" onclick="event.stopPropagation()">
                     <button class="qty-btn minus" onclick="updateCartQty('${menu.menu_id}',-1)"><i class="fas fa-minus"></i></button>
                     <span class="qty-value">${cartItem.quantity}</span>
                     <button class="qty-btn plus" onclick="updateCartQty('${menu.menu_id}',1)"><i class="fas fa-plus"></i></button>
                   </div>`
                : `<button class="add-btn" onclick="event.stopPropagation();quickAddToCart('${menu.menu_id}')" aria-label="Tambah">
                     <i class="fas fa-plus"></i>
                   </button>`
            }
          </div>
        </div>
      `;
    })
    .join("");
}

// ============================================
// Cart Operations
// ============================================
function quickAddToCart(menuId) {
  const menu = state.menus.find((m) => m.menu_id === menuId);
  if (!menu) return;

  const existing = getCartItem(menuId);
  if (existing) {
    existing.quantity += 1;
  } else {
    state.cart.push({
      menu_id: menu.menu_id,
      menu_name: menu.menu_name,
      menu_price: menu.menu_price,
      menu_image_url: menu.menu_image_url,
      menu_category: menu.menu_category,
      quantity: 1,
      note: "",
    });
  }

  saveCart();
  updateCartUI();
  renderMenus();
  showToast(`${menu.menu_name} ditambahkan! 🛒`, "success");
}

function addToCartFromDetail(menuId, qty, note) {
  const menu = state.menus.find((m) => m.menu_id === menuId);
  if (!menu) return;

  const existing = getCartItem(menuId);
  if (existing) {
    existing.quantity += qty;
    if (note) existing.note = note; // update note
  } else {
    state.cart.push({
      menu_id: menu.menu_id,
      menu_name: menu.menu_name,
      menu_price: menu.menu_price,
      menu_image_url: menu.menu_image_url,
      menu_category: menu.menu_category,
      quantity: qty,
      note: note || "",
    });
  }

  saveCart();
  updateCartUI();
  renderMenus();
  closeDetailModal();
  showToast(`${qty}x ${menu.menu_name} ditambahkan! 🛒`, "success");
}

function updateCartQty(menuId, delta) {
  const item = getCartItem(menuId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    state.cart = state.cart.filter((i) => i.menu_id !== menuId);
    showToast("Item dihapus dari keranjang", "info");
  }

  saveCart();
  updateCartUI();
  renderMenus();
}

function clearCartAll() {
  if (state.cart.length === 0) return;
  state.cart = [];
  saveCart();
  updateCartUI();
  renderMenus();
  showToast("Keranjang dikosongkan", "info");
}

function updateCartUI() {
  const count = getCartCount();
  const total = getCartTotal();

  // Badge
  DOM.cartBadge.textContent = count;
  DOM.cartBadge.style.display = count > 0 ? "flex" : "none";

  // Floating cart
  if (count > 0) {
    DOM.floatingCart.style.display = "flex";
    DOM.floatingCount.textContent = `${count} item`;
    DOM.floatingTotal.textContent = formatCurrency(total);
  } else {
    DOM.floatingCart.style.display = "none";
  }

  // Cart sheet content
  if (DOM.cartCountText) DOM.cartCountText.textContent = count;

  if (count === 0) {
    DOM.cartFooter.style.display = "none";
    DOM.cartItems.innerHTML = `
      <div class="cart-empty">
        <i class="fas fa-shopping-bag"></i>
        <p>Keranjang masih kosong</p>
        <span>Yuk pilih menu favoritmu!</span>
      </div>
    `;
  } else {
    DOM.cartFooter.style.display = "block";
    DOM.totalAmount.textContent = formatCurrency(total);

    DOM.cartItems.innerHTML = state.cart
      .map(
        (item) => `
        <div class="cart-item">
          <div class="cart-item-img">
            <img src="${item.menu_image_url || "https://placehold.co/120?text=No+Image"}" alt="${item.menu_name}">
          </div>
          <div class="cart-item-info">
            <div class="cart-item-name">${item.menu_name}</div>
            ${item.note ? `<div class="cart-item-note">📝 ${item.note}</div>` : ""}
            <div class="cart-item-price">${formatCurrency(item.menu_price * item.quantity)}</div>
            <div class="cart-item-controls">
              <button class="qty-btn minus" onclick="updateCartQty('${item.menu_id}',-1)"><i class="fas fa-minus"></i></button>
              <span class="qty-value">${item.quantity}</span>
              <button class="qty-btn plus" onclick="updateCartQty('${item.menu_id}',1)"><i class="fas fa-plus"></i></button>
            </div>
          </div>
        </div>
      `,
      )
      .join("");
  }
}

// ============================================
// Detail Modal
// ============================================
function openDetailModal(menuId) {
  const menu = state.menus.find((m) => m.menu_id === menuId);
  if (!menu) return;

  state.detailMenu = menu;
  state.detailQty = 1;
  state.detailNote = "";

  // Populate
  DOM.detailImg.src =
    menu.menu_image_url || "https://placehold.co/400x300?text=No+Image";
  DOM.detailImg.alt = menu.menu_name;
  DOM.detailBadge.textContent = menu.menu_category;
  DOM.detailCategory.textContent = menu.menu_category;
  DOM.detailPopular.style.display = menu.is_popular ? "inline-flex" : "none";
  DOM.detailName.textContent = menu.menu_name;
  DOM.detailDesc.textContent =
    menu.menu_description || "Menu pilihan terbaik kami";
  DOM.detailPrice.textContent = formatCurrency(menu.menu_price);
  DOM.detailQtyValue.textContent = "1";
  DOM.detailNote.value = "";
  DOM.detailAddPrice.textContent = formatCurrency(menu.menu_price);

  // Show
  DOM.detailModal.style.display = "flex";
  requestAnimationFrame(() => DOM.detailModal.classList.add("show"));
  document.body.style.overflow = "hidden";
}

function closeDetailModal() {
  DOM.detailModal.classList.remove("show");
  setTimeout(() => {
    DOM.detailModal.style.display = "none";
    document.body.style.overflow = "";
  }, 300);
}

function updateDetailQty(delta) {
  state.detailQty = Math.max(1, state.detailQty + delta);
  DOM.detailQtyValue.textContent = state.detailQty;
  DOM.detailAddPrice.textContent = formatCurrency(
    state.detailMenu.menu_price * state.detailQty,
  );
}

// ============================================
// Cart Sheet
// ============================================
function openCartSheet() {
  DOM.cartOverlay.style.display = "block";
  DOM.cartSheet.classList.add("open");
  requestAnimationFrame(() => DOM.cartOverlay.classList.add("show"));
  document.body.style.overflow = "hidden";
}

function closeCartSheet() {
  DOM.cartOverlay.classList.remove("show");
  DOM.cartSheet.classList.remove("open");
  setTimeout(() => {
    DOM.cartOverlay.style.display = "none";
    document.body.style.overflow = "";
  }, 300);
}

// ============================================
// Checkout
// ============================================
function openCheckout() {
  if (state.cart.length === 0) {
    showToast("Keranjang masih kosong", "error");
    return;
  }
  closeCartSheet();

  // Restore saved customer info
  const savedName = localStorage.getItem("ag_customer_name") || "";
  const savedPhone = localStorage.getItem("ag_customer_phone") || "";
  if (savedName) $("#customer-name").value = savedName;
  if (savedPhone) $("#customer-phone").value = savedPhone;

  setTimeout(() => {
    // Populate summary
    DOM.summaryItems.innerHTML = state.cart
      .map(
        (item) => `
        <div class="summary-item">
          <div>
            <span class="summary-item-name">${item.menu_name}</span>
            ${item.note ? `<div class="summary-item-note">📝 ${item.note}</div>` : ""}
          </div>
          <span class="summary-item-qty">x${item.quantity}</span>
          <span class="summary-item-price">${formatCurrency(item.menu_price * item.quantity)}</span>
        </div>
      `,
      )
      .join("");

    DOM.summaryTotal.textContent = formatCurrency(getCartTotal());
    DOM.checkoutModal.style.display = "flex";
    requestAnimationFrame(() => DOM.checkoutModal.classList.add("show"));
    document.body.style.overflow = "hidden";
  }, 350);
}

function closeCheckoutModal() {
  DOM.checkoutModal.classList.remove("show");
  setTimeout(() => {
    DOM.checkoutModal.style.display = "none";
    document.body.style.overflow = "";
  }, 300);
}

// ============================================
// WhatsApp Order
// ============================================
function sendWhatsAppOrder() {
  const name = $("#customer-name").value.trim();
  const phone = $("#customer-phone").value.trim();
  const notes = $("#order-notes").value.trim();

  if (!name) {
    showToast("Mohon isi nama lengkap", "error");
    $("#customer-name").focus();
    return;
  }
  if (!phone || phone.replace(/\D/g, "").length < 8) {
    showToast("Mohon isi nomor WhatsApp yang valid", "error");
    $("#customer-phone").focus();
    return;
  }

  // Save customer info for next time
  localStorage.setItem("ag_customer_name", name);
  localStorage.setItem("ag_customer_phone", phone);

  const orderCode = generateOrderCode();
  const total = getCartTotal();

  // Build message
  let msg = `Halo Admin Anti Gravity! 🚀\n\n`;
  msg += `📋 *DETAIL PESANAN*\n`;
  msg += `Kode: *${orderCode}*\n`;
  msg += `Nama: ${name}\n`;
  msg += `No. WA: ${phone}\n\n`;
  msg += `🛒 *Item Pesanan:*\n`;

  state.cart.forEach((item, idx) => {
    msg += `${idx + 1}. ${item.menu_name} x${item.quantity} = ${formatCurrency(item.menu_price * item.quantity)}`;
    if (item.note) msg += `\n   📝 Catatan: ${item.note}`;
    msg += `\n`;
  });

  msg += `\n💰 *Total: ${formatCurrency(total)}*\n`;
  if (notes) msg += `\n📝 Catatan Order: ${notes}\n`;
  msg += `\nDikirim via Anti Gravity 🚀`;

  const waUrl = `https://wa.me/${CONFIG.WA_ADMIN_NUMBER}?text=${encodeURIComponent(msg)}`;
  window.open(waUrl, "_blank");

  // Save to history
  saveOrderToHistory({
    code: orderCode,
    name,
    phone,
    items: [...state.cart],
    total,
    notes,
    date: new Date().toISOString(),
  });

  // Show confirmation
  closeCheckoutModal();
  setTimeout(() => showConfirmation(orderCode, name, total), 350);

  // Clear cart
  state.cart = [];
  saveCart();
  updateCartUI();
  renderMenus();

  // Clear form
  $("#customer-name").value = "";
  $("#customer-phone").value = "";
  $("#order-notes").value = "";
}

// ============================================
// Confirmation Screen
// ============================================
function showConfirmation(code, name, total) {
  DOM.confirmOrderCode.textContent = code;
  DOM.confirmName.textContent = name;
  DOM.confirmTotal.textContent = formatCurrency(total);

  DOM.confirmModal.style.display = "flex";
  requestAnimationFrame(() => DOM.confirmModal.classList.add("show"));
  document.body.style.overflow = "hidden";
}

function closeConfirmModal() {
  DOM.confirmModal.classList.remove("show");
  setTimeout(() => {
    DOM.confirmModal.style.display = "none";
    document.body.style.overflow = "";
  }, 300);
}

// ============================================
// Order History
// ============================================
function getHistory() {
  return JSON.parse(localStorage.getItem("ag_history") || "[]");
}

function saveOrderToHistory(order) {
  const history = getHistory();
  history.unshift(order); // newest first
  // Keep only last 20 orders
  if (history.length > 20) history.pop();
  localStorage.setItem("ag_history", JSON.stringify(history));
}

function renderHistory() {
  const history = getHistory();
  if (history.length === 0) {
    DOM.historyList.innerHTML = `
      <div class="history-empty">
        <i class="fas fa-receipt"></i>
        <p>Belum ada riwayat order</p>
      </div>
    `;
    return;
  }

  DOM.historyList.innerHTML = history
    .map(
      (order) => `
      <div class="history-item">
        <div class="history-item-header">
          <span class="history-code">${order.code}</span>
          <span class="history-date">${formatDateShort(order.date)}</span>
        </div>
        <div class="history-name">${order.name}</div>
        <div class="history-items-preview">
          ${order.items.map((i) => `${i.menu_name} x${i.quantity}`).join(" · ")}
        </div>
        <div class="history-footer">
          <span class="history-total">${formatCurrency(order.total)}</span>
          <button class="reorder-btn" onclick="reorder('${order.code}')">
            <i class="fas fa-redo"></i> Order Lagi
          </button>
        </div>
      </div>
    `,
    )
    .join("");
}

function reorder(code) {
  const history = getHistory();
  const order = history.find((o) => o.code === code);
  if (!order) return;

  // Add items back to cart
  order.items.forEach((histItem) => {
    const existing = getCartItem(histItem.menu_id);
    if (existing) {
      existing.quantity += histItem.quantity;
    } else {
      state.cart.push({ ...histItem });
    }
  });

  saveCart();
  updateCartUI();
  renderMenus();
  closeHistoryPanel();
  showToast(
    `${order.items.length} item dari order ${code} ditambahkan ke keranjang!`,
    "success",
  );
  openCartSheet();
}

function openHistoryPanel() {
  renderHistory();
  DOM.historyOverlay.style.display = "block";
  DOM.historyPanel.classList.add("open");
  requestAnimationFrame(() => DOM.historyOverlay.classList.add("show"));
  document.body.style.overflow = "hidden";
}

function closeHistoryPanel() {
  DOM.historyOverlay.classList.remove("show");
  DOM.historyPanel.classList.remove("open");
  setTimeout(() => {
    DOM.historyOverlay.style.display = "none";
    document.body.style.overflow = "";
  }, 300);
}

function clearHistory() {
  localStorage.removeItem("ag_history");
  renderHistory();
  showToast("Riwayat order dihapus", "info");
}

// ============================================
// Category Navigation
// ============================================
function initCategoryNav() {
  const tabs = $$(".category-tab");
  tabs.forEach((tab) => {
    // Remove old listeners by cloning
    const newTab = tab.cloneNode(true);
    tab.parentNode.replaceChild(newTab, tab);
    newTab.addEventListener("click", () => {
      $$(".category-tab").forEach((t) => t.classList.remove("active"));
      newTab.classList.add("active");
      state.activeCategory = newTab.dataset.category;
      filterAndSort();
    });
  });

  // Restore active state
  const activeTab = $(`.category-tab[data-category="${state.activeCategory}"]`);
  if (activeTab) {
    $$(".category-tab").forEach((t) => t.classList.remove("active"));
    activeTab.classList.add("active");
  }
}

// ============================================
// Sort Buttons
// ============================================
function initSortButtons() {
  $$(".sort-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      $$(".sort-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      state.sortMode = btn.dataset.sort;
      filterAndSort();
    });
  });
}

// ============================================
// Search
// ============================================
function initSearch() {
  let debounce;
  DOM.searchInput.addEventListener("input", (e) => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      state.searchQuery = e.target.value.trim();
      DOM.searchClear.style.display = state.searchQuery ? "flex" : "none";
      filterAndSort();
    }, 200);
  });

  DOM.searchClear.addEventListener("click", () => {
    DOM.searchInput.value = "";
    state.searchQuery = "";
    DOM.searchClear.style.display = "none";
    filterAndSort();
    DOM.searchInput.focus();
  });
}

// ============================================
// Sticky Category Nav
// ============================================
function initStickyNav() {
  const observer = new IntersectionObserver(
    ([entry]) => {
      const nav = $("#category-nav");
      nav?.classList.toggle("scrolled", !entry.isIntersecting);
    },
    { threshold: 0 },
  );

  const sentinel = document.createElement("div");
  sentinel.style.height = "1px";
  const categoryNav = $("#category-nav");
  categoryNav?.parentElement.insertBefore(sentinel, categoryNav);
  observer.observe(sentinel);
}

// ============================================
// Event Listeners
// ============================================
function initEventListeners() {
  // Theme
  DOM.themeToggle.addEventListener("click", toggleTheme);

  // Cart
  DOM.cartBtn.addEventListener("click", openCartSheet);
  DOM.floatingCart.addEventListener("click", openCartSheet);
  DOM.cartOverlay.addEventListener("click", closeCartSheet);
  DOM.clearCart.addEventListener("click", clearCartAll);
  DOM.checkoutBtn.addEventListener("click", openCheckout);

  // Checkout modal
  DOM.closeCheckout.addEventListener("click", closeCheckoutModal);
  DOM.checkoutModal.addEventListener("click", (e) => {
    if (e.target === DOM.checkoutModal) closeCheckoutModal();
  });
  DOM.waOrderBtn.addEventListener("click", sendWhatsAppOrder);

  // Detail modal
  DOM.closeDetail.addEventListener("click", closeDetailModal);
  DOM.detailModal.addEventListener("click", (e) => {
    if (e.target === DOM.detailModal) closeDetailModal();
  });
  DOM.detailQtyMinus.addEventListener("click", () => updateDetailQty(-1));
  DOM.detailQtyPlus.addEventListener("click", () => updateDetailQty(1));
  DOM.detailNote.addEventListener("input", (e) => {
    state.detailNote = e.target.value;
  });
  DOM.detailAddBtn.addEventListener("click", () => {
    if (!state.detailMenu) return;
    addToCartFromDetail(
      state.detailMenu.menu_id,
      state.detailQty,
      state.detailNote,
    );
  });

  // Confirm modal
  DOM.confirmCloseBtn.addEventListener("click", closeConfirmModal);
  DOM.confirmModal.addEventListener("click", (e) => {
    if (e.target === DOM.confirmModal) closeConfirmModal();
  });
  DOM.copyCodeBtn.addEventListener("click", () => {
    const code = DOM.confirmOrderCode.textContent;
    navigator.clipboard
      .writeText(code)
      .then(() => {
        showToast(`Kode ${code} disalin!`, "success");
      })
      .catch(() => {
        // Fallback
        DOM.confirmOrderCode.select?.();
        showToast("Tidak bisa menyalin otomatis", "info");
      });
  });

  // History panel
  DOM.historyBtn.addEventListener("click", openHistoryPanel);
  DOM.closeHistory.addEventListener("click", closeHistoryPanel);
  DOM.historyOverlay.addEventListener("click", closeHistoryPanel);
  DOM.clearHistoryBtn.addEventListener("click", clearHistory);

  // Keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeCartSheet();
      closeCheckoutModal();
      closeDetailModal();
      closeConfirmModal();
      closeHistoryPanel();
    }
  });
}

// ============================================
// Splash Screen
// ============================================
function initSplash() {
  setTimeout(() => {
    DOM.splash.classList.add("hide");
    DOM.app.style.display = "block";
    setTimeout(() => DOM.splash.remove(), 500);
  }, 1800);
}

// ============================================
// Service Worker (PWA)
// ============================================
function initServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("sw.js")
      .then(() => console.log("✅ Service Worker registered"))
      .catch((err) => console.log("SW registration failed:", err));
  }
}

// ============================================
// Initialize App
// ============================================
document.addEventListener("DOMContentLoaded", () => {
  initSplash();
  initTheme();
  initStatusBar();
  initSearch();
  initSortButtons();
  initEventListeners();
  initStickyNav();
  initServiceWorker();
  loadMenus();
  updateCartUI();
});
