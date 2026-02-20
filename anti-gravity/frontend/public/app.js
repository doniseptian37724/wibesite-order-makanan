/**
 * Anti Gravity - Food Order App
 * Frontend JavaScript - Enhanced Version
 */

// ============================================
// Configuration
// ============================================
const CONFIG = {
  // Relative URL - bekerja di localhost:3000 maupun localtunnel
  API_BASE: "/api/v1",
  WA_ADMIN_NUMBER: "6289637931794", // Nomor WA Doni
  CURRENCY: "IDR",
  APP_NAME: "Anti Gravity",
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
  sortMode: "default",
  theme: localStorage.getItem("ag_theme") || "dark",
  favorites: JSON.parse(localStorage.getItem("ag_favorites") || "[]"),
  // Detail modal state
  detailMenu: null,
  detailQty: 1,
  detailNote: "",
  detailOptions: {}, // Store selected options {optionName: selectedValue(s)}
  isAddingNew: false, // For admin menu addition
  // New features state
  isManualClosed: localStorage.getItem("ag_manual_closed") === "true",
  activePromo: null,
  history: JSON.parse(localStorage.getItem("ag_history") || "[]"),
  paymentMethod: "cash",
  points: parseInt(localStorage.getItem("ag_points") || "0"),
  tier: "Bronze",
  brandColor: localStorage.getItem("ag_brand_color") || "purple",
  // Login state
  isLoggedIn: !!localStorage.getItem("ag_customer_phone"),
  customerName: localStorage.getItem("ag_customer_name") || "",
  customerPhone: localStorage.getItem("ag_customer_phone") || "",
  lastWaUrl: null,
  map: null,
  marker: null,
  selectedCoords: null,
  serviceType: "dine-in",
  tableNumber: "",
  lastCloudOrderId: null,
  soundEnabled: localStorage.getItem("ag_admin_sound") !== "false",
  cloudFilter: "all",
  adminMenus: [],
  serverOrders: [],
  vouchers: JSON.parse(localStorage.getItem("ag_vouchers") || "[]"),
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
    rating: 4.8,
    cals: "450 Kcal",
    time: "15 Min",
    ingredients: ["🍚", "🍗", "🥚", "🥕"],
    options: [
      {
        name: "Level Pedas",
        type: "select",
        values: ["Tidak Pedas", "Sedang", "Pedas 🔥", "Ekstra Pedas 🌶️🌶️"],
      },
      {
        name: "Tambah Toping",
        type: "checkbox",
        values: [
          { name: "Telor Mata Sapi", price: 5000 },
          { name: "Keju Parut", price: 3000 },
          { name: "Kerupuk Udang", price: 2000 },
        ],
      },
    ],
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
    rating: 4.5,
    cals: "380 Kcal",
    time: "10 Min",
    ingredients: ["🍜", "🥩", "🥬", "🧅"],
  },
  {
    menu_id: "3",
    menu_name: "Chicken Burger",
    menu_price: 35000,
    menu_category: "Makanan",
    menu_description: "Burger ayam krispi dengan keju dan saus rahasia",
    menu_image_url:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
    is_popular: true,
    rating: 4.7,
    cals: "520 Kcal",
    time: "12 Min",
    ingredients: ["🍔", "🍗", "🧀", "🥬"],
  },
  {
    menu_id: "4",
    menu_name: "Es Teh Manis",
    menu_price: 5000,
    menu_category: "Minuman",
    menu_description: "Teh manis segar yang melegakan dahaga",
    menu_image_url:
      "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400",
    is_popular: false,
    rating: 4.9,
    cals: "80 Kcal",
    time: "2 Min",
    ingredients: ["🧊", "🍵", "🍯"],
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
  detailRating: $("#detail-rating"),
  detailCals: $("#detail-cals"),
  detailTime: $("#detail-time"),
  detailDesc: $("#detail-desc"),
  detailPrice: $("#detail-price"),
  detailQtyMinus: $("#detail-qty-minus"),
  detailQtyPlus: $("#detail-qty-plus"),
  detailQtyValue: $("#detail-qty-value"),
  detailNote: $("#detail-note"),
  detailAddBtn: $("#detail-add-btn"),
  detailAddPrice: $("#detail-add-price"),
  detailOptionsContainer: $("#detail-options-container"),
  editMenuBtn: $("#edit-menu-btn"),
  // Edit modal
  editModal: $("#edit-modal"),
  editModalTitle: $("#edit-modal-title"),
  closeEditModal: $("#close-edit-modal"),
  cancelEditModal: $("#cancel-edit-modal"),
  editImgFile: $("#edit-img-file"),
  editImgPreview: $("#edit-img-preview"),
  editName: $("#edit-name"),
  editPrice: $("#edit-price"),
  editDesc: $("#edit-desc"),
  saveEditBtn: $("#save-edit-btn"),
  deleteMenuBtn: $("#delete-menu-btn"),
  // Custom item modal
  customModal: $("#custom-modal"),
  closeCustomModal: $("#close-custom-modal"),
  cancelCustomModal: $("#cancel-custom-modal"),
  customName: $("#custom-name"),
  customPrice: $("#custom-price"),
  confirmCustomBtn: $("#confirm-custom-btn"),
  // Confirm modal
  confirmModal: $("#confirm-modal"),
  confirmOrderCode: $("#confirm-order-code"),
  confirmName: $("#confirm-name"),
  confirmTotal: $("#confirm-total"),
  copyCodeBtn: $("#copy-code-btn"),
  confirmCloseBtn: $("#confirm-close-btn"),
  downloadReceiptBtn: $("#download-receipt-btn"),
  receiptCard: $("#receipt-card"),
  receiptItemsList: $("#receipt-items-list"),
  receiptDate: $("#receipt-date"),
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
  // New UI Elements
  promoCodeInput: $("#promo-code"),
  applyPromoBtn: $("#apply-promo-btn"),
  promoMessage: $("#promo-message"),
  summarySubtotal: $("#summary-subtotal"),
  summaryPromoRow: $("#summary-promo-row"),
  summaryDiscount: $("#summary-discount"),
  adminBtn: $("#open-admin-btn"),
  adminModal: $("#admin-modal"),
  closeAdmin: $("#close-admin"),
  manualStatusToggle: $("#manual-status-toggle"),
  manualStatusLabel: $("#manual-status-label"),
  statRevenue: $("#stat-revenue"),
  statOrders: $("#stat-orders"),
  statTopItem: $("#stat-top-item"),
  // Login
  userLoginBtn: $("#user-login-btn"),
  loginModal: $("#login-modal"),
  closeLogin: $("#close-login"),
  loginPhone: $("#login-phone"),
  loginName: $("#login-name"),
  loginNameGroup: $("#login-name-group"),
  btnDoLogin: $("#btn-do-login"),
  audioCart: $("#snd-cart"),
  audioOrder: $("#snd-order"),
  audioRocket: $("#snd-rocket"),
  audioSiren: $("#snd-siren"),
  // Payment Elements
  paymentCards: $$(".payment-method-card"),
  qrisModal: $("#qris-modal"),
  closeQris: $("#close-qris"),
  confirmQrisBtn: $("#confirm-qris-paid"),
  qrisTotal: $("#qris-total"),
  // New Premium Elements
  heroSlider: $("#hero-slider"),
  sliderTrack: $("#slider-track"),
  sliderDots: $("#slider-dots"),
  socialProof: $("#social-proof"),
  spText: $("#sp-text"),
  colorBtn: $("#theme-colors-btn"),
  colorModal: $("#color-modal"),
  closeColors: $("#close-colors"),
  colorOptions: $$(".color-option"),
  // Surprise Me Elements
  surpriseBtn: $("#surprise-btn"),
  surpriseModal: $("#surprise-modal"),
  diceAnim: $("#dice-anim"),
  surpriseResult: $("#surprise-result"),
  surpriseAgain: $("#surprise-again"),
  surpriseOpen: $("#surprise-open"),
  // Map Elements
  openMapBtn: $("#open-map-btn"),
  mapModal: $("#map-modal"),
  closeMap: $("#close-map"),
  confirmLocationBtn: $("#confirm-location-btn"),
  btnGetCurrentLoc: $("#btn-get-current-loc"),
  googleMapsInput: $("#google-maps-link"),
  locationBadge: $("#location-badge"),
  addressInput: $("#customer-address"),
  // Service Type
  serviceOptions: $$(".service-option"),
  tableGroup: $("#table-number-group"),
  tableNumberInput: $("#table-number"),
  // Cloud Orders Elements
  refreshServerOrdersBtn: $("#refresh-server-orders"),
  serverOrdersList: $("#server-orders-list"),
  adminSoundToggle: $("#admin-sound-toggle"),
  btnEnableNotifications: $("#btn-enable-notifications"),
  pinModal: $("#pin-modal"),
  closePin: $("#close-pin"),
  confirmPinBtn: $("#confirm-pin-btn"),
  adminPinInput: $("#admin-pin"),
  cloudFilterBtns: $$(".cloud-filter-btn"),
  modalTabs: $$(".modal-tab"),
  tabContents: $$(".tab-content"),
  adminMenuSearch: $("#admin-menu-search"),
  adminStockList: $("#admin-stock-list"),
  downloadCsvBtn: $("#admin-download-csv"),
  // Rewards & Vouchers
  openRewardsBtn: $("#open-rewards-btn"),
  closeRewardsBtn: $("#close-rewards"),
  rewardsSelection: $("#rewards-selection"),
  vouchersSection: $("#vouchers-section"),
  closeVouchersBtn: $("#close-vouchers"),
  myVouchersList: $("#my-vouchers-list"),
  checkoutSelectVoucherBtn: $("#checkout-select-voucher-btn"),
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

function saveFavorites() {
  localStorage.setItem("ag_favorites", JSON.stringify(state.favorites));
}

function toggleFavorite(menuId) {
  const idx = state.favorites.indexOf(menuId);
  if (idx === -1) {
    state.favorites.push(menuId);
    showToast("Ditambahkan ke favorit ❤️", "success");
  } else {
    state.favorites.splice(idx, 1);
    showToast("Dihapus dari favorit", "info");
  }
  saveFavorites();
  renderMenus();
}

function saveMenuEdits() {
  localStorage.setItem(
    "ag_menu_edits",
    JSON.stringify(
      state.menus.map((m) => ({
        menu_id: m.menu_id,
        menu_name: m.menu_name,
        menu_price: m.menu_price,
        menu_description: m.menu_description,
        menu_image_url: m.menu_image_url,
      })),
    ),
  );
}

function applyLocalMenuEdits() {
  const edits = JSON.parse(localStorage.getItem("ag_menu_edits") || "[]");
  edits.forEach((edit) => {
    const menu = state.menus.find((m) => m.menu_id === edit.menu_id);
    if (menu) Object.assign(menu, edit);
  });
}

function getCartItem(menuId, optionsStr = "") {
  return state.cart.find(
    (item) =>
      item.menu_id === menuId && (item.options || "") === (optionsStr || ""),
  );
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

function getTierDiscount() {
  const pts = state.points || 0;
  if (pts >= 2000) return 0.1; // Gold 10%
  if (pts >= 500) return 0.05; // Silver 5%
  return 0; // Bronze 0%
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
  const isAutoOpen = hour >= CONFIG.OPEN_HOUR && hour < CONFIG.CLOSE_HOUR;
  const isOpen = isAutoOpen && !state.isManualClosed;

  // Live clock
  function updateClock() {
    const t = new Date();
    if (DOM.statusTime) {
      DOM.statusTime.textContent = t.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  }
  updateClock();
  setInterval(updateClock, 60000);

  if (!DOM.statusDot || !DOM.statusText) return;

  if (isOpen) {
    DOM.statusDot.className = "status-dot open";
    const closeIn = CONFIG.CLOSE_HOUR - hour;
    DOM.statusText.textContent = `Sedang Buka · Tutup ${closeIn}jam lagi`;
  } else {
    DOM.statusDot.className = "status-dot closed";
    if (state.isManualClosed) {
      DOM.statusText.textContent = `Tutup (Manual) · Sedang beristirahat`;
    } else {
      DOM.statusText.textContent = `Tutup · Buka pukul ${String(CONFIG.OPEN_HOUR).padStart(2, "0")}.00`;
    }
  }
}

async function fetchCustomerInfo(phone) {
  if (!phone || phone.length < 8) return;

  try {
    const res = await fetch(`${CONFIG.API_BASE}/customers/phone/${phone}`);
    if (res.ok) {
      const result = await res.json();
      if (result.success && result.data) {
        state.points = result.data.customer_points;
        localStorage.setItem("ag_points", state.points);
        if (result.data.customer_name) {
          localStorage.setItem("ag_customer_name", result.data.customer_name);
          if ($("#customer-name"))
            $("#customer-name").value = result.data.customer_name;
        }
        updateMembershipUI();
        updateCartUI(); // Update discount based on new points
      }
    }
  } catch (err) {
    console.error("Failed to fetch customer info:", err);
  }
}

function updateMembershipUI() {
  const points = state.points || 0;
  const userName =
    localStorage.getItem("ag_customer_name") || "Penjelajah Rasa";

  if ($("#mem-user-name")) $("#mem-user-name").textContent = userName;
  if ($("#user-points"))
    $("#user-points").textContent = points.toLocaleString();

  let tier = "Bronze Explorer";
  let nextTier = "Silver";
  let target = 500;
  let currentTierBase = 0;

  if (points >= 2000) {
    tier = "Gold Legend";
    nextTier = "Max";
    target = 2000;
    currentTierBase = 2000;
  } else if (points >= 500) {
    tier = "Silver Voyager";
    nextTier = "Gold";
    target = 2000;
    currentTierBase = 500;
  }

  const progress =
    target === currentTierBase
      ? 100
      : ((points - currentTierBase) / (target - currentTierBase)) * 100;

  if ($("#user-tier")) {
    $("#user-tier").textContent = tier;
    $("#user-tier").className =
      `tier-badge ${tier.split(" ")[0].toLowerCase()}`;
  }

  if ($("#points-needed")) {
    const needed = target - points;
    $("#points-needed").textContent =
      needed > 0
        ? `${needed} pts lagi ke ${nextTier}`
        : "Tier tertinggi tercapai! 🏆";
  }

  if ($("#mem-progress-bar")) {
    $("#mem-progress-bar").style.width = `${Math.min(100, progress)}%`;
  }

  renderVouchers();
}

function renderVouchers() {
  if (!DOM.myVouchersList) return;

  if (state.vouchers.length === 0) {
    DOM.vouchersSection.style.display = "none";
    return;
  }

  DOM.vouchersSection.style.display = "block";
  DOM.myVouchersList.innerHTML = state.vouchers
    .map(
      (v) => `
    <div class="voucher-card" onclick="useVoucher('${v.id}')">
      <div class="voucher-left">
        <i class="fas fa-ticket-alt"></i>
      </div>
      <div class="voucher-right">
        <span class="v-title">${v.name}</span>
        <span class="v-code">KLIK UNTUK PAKAI</span>
      </div>
    </div>
  `,
    )
    .join("");
}

function redeemReward(cost, value, name) {
  if (state.points < cost) {
    showToast(`Poin tidak cukup (Butuh ${cost} pts)`, "error");
    return;
  }

  state.points -= cost;
  const newVoucher = {
    id: "v-" + Date.now(),
    name: name,
    value: value,
    type: "discount",
  };

  state.vouchers.push(newVoucher);
  localStorage.setItem("ag_points", state.points);
  localStorage.setItem("ag_vouchers", JSON.stringify(state.vouchers));

  updateMembershipUI();
  playSound("audioOrder");
  showToast(`Berhasil menukar ${name}! 🎟️`, "success");

  // Show vouchers section after redeem
  DOM.rewardsSelection.style.display = "none";
  DOM.vouchersSection.style.display = "block";
}

function useVoucher(voucherId) {
  const voucher = state.vouchers.find((v) => v.id === voucherId);
  if (!voucher) return;

  // If we are in checkout, apply it. If not, just show toast
  if (DOM.checkoutModal.style.display === "flex") {
    // Apply discount
    state.activePromo = {
      code: "VOUCHER",
      value: voucher.value / getCartTotal(), // Convert to percentage for existing promo system
      msg: `Voucher ${voucher.name} Terpasang! ✨`,
      isVoucher: true,
      voucherId: voucher.id,
    };

    DOM.promoCodeInput.value = "VOUCHER-DIGITAL";
    DOM.promoMessage.className = "promo-message success";
    DOM.promoMessage.textContent = state.activePromo.msg;

    updateCartUI();
    closeHistoryPanel();
    showToast("Voucher berhasil dipasang!", "success");
  } else {
    showToast("Gunakan voucher ini saat Checkout!", "info");
    openCheckout();
  }
}

window.stopSiren = function () {
  const siren = DOM.audioSiren;
  if (siren) {
    siren.pause();
    siren.currentTime = 0;
  }
};

async function requestNotificationPermission() {
  if (!("Notification" in window)) {
    showToast("Browser Anda tidak mendukung notifikasi sistem", "error");
    return;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      showToast("Notifikasi Sistem AKTIF! 🔔", "success");
      // Test notification
      showSystemNotification(
        "Berhasil!",
        "HP Anda akan bergetar saat ada pesanan baru.",
      );
    } else {
      showToast(
        "Izin notifikasi ditolak. Ubah di pengaturan browser.",
        "error",
      );
    }
  } catch (err) {
    console.error("Notification permission error:", err);
  }
}

function showSystemNotification(title, body) {
  if ("Notification" in window && Notification.permission === "granted") {
    const n = new Notification(title, {
      body: body,
      icon: "icons/icon-192.png",
      vibrate: [200, 100, 200],
      tag: "new-order", // Overwrite existing if multiple
    });
    n.onclick = () => {
      window.focus();
      n.close();
    };
  }
}

function playSound(id) {
  // Check if it's an admin notification sound and if sound is enabled
  if ((id === "audioOrder" || id === "audioSiren") && !state.soundEnabled)
    return;

  const audio = DOM[id];
  if (audio) {
    audio.currentTime = 0;
    audio.play().catch(() => {
      console.log("Audio play blocked by browser. Interaction needed.");
      if (id === "audioSiren") {
        showToast("Klik di mana saja untuk membunyikan alarm!", "info");
      }
    });
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

  // Keep "Semua" and "Favorit" tabs, add dynamic ones
  const tabs = $$(".category-tab");
  tabs.forEach((t) => {
    const cat = t.dataset.category;
    if (cat !== "all" && cat !== "favorites") t.remove();
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

  // Update counts
  const allBtn = $(".category-tab[data-category='all']");
  if (allBtn) {
    allBtn.innerHTML = `<i class="fas fa-fire"></i><span>Semua</span><span class="cat-count">${state.menus.length}</span>`;
  }
  const favBtn = $(".category-tab[data-category='favorites']");
  if (favBtn) {
    const favCount = state.favorites.length;
    favBtn.innerHTML = `<i class="fas fa-heart"></i><span>Favorit</span><span class="cat-count">${favCount}</span>`;
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
  if (state.activeCategory === "favorites") {
    filtered = filtered.filter((m) => state.favorites.includes(m.menu_id));
  } else if (state.activeCategory !== "all") {
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

// ============================================
// Render Menus — with Favorite card + "Menu Lain?"
// ============================================
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

  const cardsHtml = filteredMenus
    .map((menu, idx) => {
      const cartItems = state.cart.filter(
        (item) => item.menu_id === menu.menu_id,
      );
      const totalQty = cartItems.reduce((sum, item) => sum + item.quantity, 0);
      const inCart = totalQty > 0;
      const isFav = state.favorites.includes(menu.menu_id);
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
            <button class="fav-btn ${isFav ? "active" : ""}" onclick="event.stopPropagation();toggleFavorite('${menu.menu_id}')" title="Favorit">
              <i class="${isFav ? "fas" : "far"} fa-heart"></i>
            </button>
          </div>
          <div class="card-body">
            <div class="card-name">${menu.menu_name}</div>
            <div class="card-desc">${menu.menu_description || ""}</div>
            ${menu.rating ? `<div class="card-rating"><i class="fas fa-star"></i> ${menu.rating}</div>` : ""}
          </div>
          <div class="card-footer">
            <div class="card-price">${formatCurrency(menu.menu_price)}</div>
            ${
              inCart
                ? `<div class="qty-control" onclick="event.stopPropagation()">
                     <button class="qty-btn minus" onclick="openDetailModal('${menu.menu_id}')"><i class="fas fa-minus"></i></button>
                     <span class="qty-value">${totalQty}</span>
                     <button class="qty-btn plus" onclick="openDetailModal('${menu.menu_id}')"><i class="fas fa-plus"></i></button>
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

  // "Menu Lain?" card (dari Ngedoni)
  const customCard = `
    <div class="menu-card custom-request-card" onclick="openCustomModal()">
      <div class="custom-card-inner">
        <div class="custom-card-icon"><i class="fas fa-plus-circle"></i></div>
        <div class="custom-card-title">Menu Lain?</div>
        <div class="custom-card-desc">Request manual ke admin</div>
      </div>
    </div>
  `;

  // "Tambah Menu" Admin card (dari Ngedoni)
  const addCard = `
    <div class="menu-card admin-add-card" onclick="openAddMenuModal()">
      <div class="custom-card-inner">
        <div class="custom-card-icon" style="color: var(--accent-primary)"><i class="fas fa-plus"></i></div>
        <div class="custom-card-title" style="color: var(--accent-primary)">Tambah Menu</div>
        <div class="custom-card-desc">Admin Only</div>
      </div>
    </div>
  `;

  DOM.menuGrid.innerHTML = cardsHtml + customCard + addCard;
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
      cart_id: "c-" + Date.now(),
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
  playSound("audioCart");
  showToast(`${menu.menu_name} ditambahkan! 🛒`, "success");
}

function addToCartFromDetail(menuId, qty, note) {
  const menu = state.menus.find((m) => m.menu_id === menuId);
  if (!menu) return;

  // Calculate unit price with add-ons
  let unitPrice = menu.menu_price;
  const optionsList = [];

  for (const [optName, val] of Object.entries(state.detailOptions)) {
    if (Array.isArray(val)) {
      // Checkbox add-ons
      val.forEach((valName) => {
        const fullMenuOptions = menu.options || menu.menu_options || [];
        const optObj = fullMenuOptions.find((o) => o.name === optName);
        const valObj = optObj?.values.find((v) => v.name === valName);
        if (valObj) {
          unitPrice += valObj.price;
          optionsList.push(`${optName}: ${valName}`);
        }
      });
    } else {
      // Select variant
      optionsList.push(`${optName}: ${val}`);
    }
  }

  const optionsStr = optionsList.join(", ");
  const finalNote = note ? `${note} (${optionsStr})` : optionsStr;

  const existing = getCartItem(menuId, optionsStr); // Match by options too
  if (existing) {
    existing.quantity += qty;
    if (note) existing.note = note;
  } else {
    state.cart.push({
      cart_id: "c-" + Date.now(),
      menu_id: menu.menu_id,
      menu_name: menu.menu_name,
      menu_price: unitPrice,
      menu_image_url: menu.menu_image_url,
      menu_category: menu.menu_category,
      quantity: qty,
      note: finalNote,
      options: optionsStr,
    });
  }

  saveCart();
  updateCartUI();
  renderMenus();
  closeDetailModal();
  playSound("audioCart");
  showToast(`${qty}x ${menu.menu_name} ditambahkan! 🛒`, "success");
}

function updateCartQty(cartId, delta) {
  const item = state.cart.find((i) => i.cart_id === cartId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    state.cart = state.cart.filter((i) => i.cart_id !== cartId);
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

function removeCartItem(cartId) {
  const item = state.cart.find((i) => i.cart_id === cartId);
  if (!item) return;
  const name = item.menu_name;
  state.cart = state.cart.filter((i) => i.cart_id !== cartId);
  saveCart();
  updateCartUI();
  renderMenus();
  showToast(`${name} dihapus dari keranjang`, "info");
}

function updateCartUI() {
  const count = getCartCount();
  const subtotal = getCartTotal();
  const promoDiscount = state.activePromo
    ? Math.floor(subtotal * state.activePromo.value)
    : 0;

  // Membership Tier Discount
  const tierRate = getTierDiscount();
  const tierDiscount = Math.floor((subtotal - promoDiscount) * tierRate);

  const total = subtotal - promoDiscount - tierDiscount;

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

    // Show membership discount if any
    let benefitEl = $(".cart-tier-benefit");
    if (!benefitEl) {
      benefitEl = document.createElement("div");
      benefitEl.className = "cart-tier-benefit";
      DOM.cartFooter.prepend(benefitEl);
    }

    if (tierRate > 0) {
      benefitEl.innerHTML = `<div class="tier-benefit-toast">✨ Tier Benefit: -${formatCurrency(tierDiscount)} (${tierRate * 100}%)</div>`;
      benefitEl.style.display = "block";
    } else {
      benefitEl.style.display = "none";
    }

    if (DOM.totalAmount) DOM.totalAmount.textContent = formatCurrency(total);

    DOM.cartItems.innerHTML = state.cart
      .map(
        (item) => `
        <div class="cart-item">
          <div class="cart-item-img">
            <img src="${item.menu_image_url || "https://placehold.co/120?text=No+Image"}" alt="${item.menu_name}">
          </div>
          <div class="cart-item-info">
            <div class="cart-item-name-row">
              <div class="cart-item-name">${item.menu_name}</div>
              <button class="cart-item-delete" onclick="removeCartItem('${item.cart_id}')" title="Hapus item">
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
            ${item.note ? `<div class="cart-item-note">📝 ${item.note}</div>` : ""}
            <div class="cart-item-price">${formatCurrency(item.menu_price * item.quantity)}</div>
            <div class="cart-item-controls">
              <button class="qty-btn minus" onclick="updateCartQty('${item.cart_id}',-1)"><i class="fas fa-minus"></i></button>
              <span class="qty-value">${item.quantity}</span>
              <button class="qty-btn plus" onclick="updateCartQty('${item.cart_id}',1)"><i class="fas fa-plus"></i></button>
            </div>
          </div>
        </div>
      `,
      )
      .join("");
  }

  // Summary section
  if (DOM.summarySubtotal) {
    DOM.summarySubtotal.textContent = formatCurrency(subtotal);
    if (state.activePromo) {
      DOM.summaryPromoRow.style.display = "flex";
      DOM.summaryDiscount.textContent = `-${formatCurrency(discount)}`;
    } else {
      DOM.summaryPromoRow.style.display = "none";
    }
    DOM.summaryTotal.textContent = formatCurrency(total);
  }
}

// ============================================
// Promo System
// ============================================
function applyPromoCode() {
  const code = DOM.promoCodeInput.value.trim().toUpperCase();
  if (!code) return;

  const validPromos = {
    DONIKEREN: { value: 0.1, msg: "Diskon 10% berhasil dipasang! 🎉" },
    ANTIGRAVITY: { value: 0.15, msg: "Diskon 15% untuk kamu! 🚀" },
    MAKANHEMAT: { value: 0.05, msg: "Diskon 5% dipasang!" },
  };

  const promo = validPromos[code];
  if (promo) {
    state.activePromo = { code, ...promo };
    DOM.promoMessage.className = "promo-message success";
    DOM.promoMessage.textContent = promo.msg;
    updateCartUI();
    playSound("audioOrder");
  } else {
    DOM.promoMessage.className = "promo-message error";
    DOM.promoMessage.textContent = "Kode promo tidak valid ❌";
    state.activePromo = null;
    updateCartUI();
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

  state.detailOptions = {};
  renderMenuOptions(menu);

  // Stats
  $("#detail-rating").textContent = menu.rating || "4.5";
  $("#detail-cals").textContent = menu.cals || "-";
  $("#detail-time").textContent = menu.time || "10-20 Min";

  // Ingredients
  const ingredList = $("#detail-ingredients");
  if (ingredList) {
    if (menu.ingredients && menu.ingredients.length > 0) {
      ingredList.parentElement.style.display = "block";
      ingredList.innerHTML = menu.ingredients
        .map((ing) => `<div class="ingredient-item">${ing}</div>`)
        .join("");
    } else {
      ingredList.parentElement.style.display = "none";
    }
  }

  // Recommendations
  renderSuggestions(menu);

  // Show
  DOM.detailModal.style.display = "flex";
  requestAnimationFrame(() => DOM.detailModal.classList.add("show"));
  document.body.style.overflow = "hidden";
}

function renderSuggestions(currentMenu) {
  const list = $("#detail-suggestions-list");
  if (!list) return;

  // Get 4 random menus from different category or popular items
  const suggests = state.menus
    .filter((m) => m.menu_id !== currentMenu.menu_id)
    .sort(() => 0.5 - Math.random())
    .slice(0, 4);

  list.innerHTML = suggests
    .map(
      (m) => `
    <div class="suggestion-item" onclick="openDetailModal('${m.menu_id}')">
      <img src="${m.menu_image_url}" class="suggestion-img" alt="${m.menu_name}">
      <span class="suggestion-name">${m.menu_name}</span>
      <span class="suggestion-price">${formatCurrency(m.menu_price)}</span>
    </div>
  `,
    )
    .join("");
}

function closeDetailModal() {
  DOM.detailModal.classList.remove("show");
  setTimeout(() => {
    DOM.detailModal.style.display = "none";
    document.body.style.overflow = "";
  }, 300);
}

function updateDetailPrice() {
  const basePrice = state.detailMenu.menu_price;
  let addOnTotal = 0;

  // Calculate add-on prices
  const options =
    state.detailMenu.options || state.detailMenu.menu_options || [];
  options.forEach((opt) => {
    if (opt.type === "checkbox") {
      const selected = state.detailOptions[opt.name] || [];
      selected.forEach((valName) => {
        const valObj = opt.values.find((v) => v.name === valName);
        if (valObj) addOnTotal += valObj.price;
      });
    }
  });

  const total = (basePrice + addOnTotal) * state.detailQty;
  DOM.detailAddPrice.textContent = formatCurrency(total);
}

function renderMenuOptions(menu) {
  const container = DOM.detailOptionsContainer;
  if (!container) return;

  const options = menu.options || menu.menu_options || [];
  if (options.length === 0) {
    container.style.display = "none";
    return;
  }

  container.style.display = "block";
  container.innerHTML = options
    .map((opt) => {
      let html = `<div class="menu-option-group">
        <label class="option-label"><strong>${opt.name}</strong></label>`;

      if (opt.type === "select") {
        html += `<div class="option-select-grid">
          ${opt.values
            .map(
              (val, idx) => `
            <button class="option-pill ${idx === 0 ? "active" : ""}" 
              onclick="selectDropdownOption('${opt.name}', '${val}', this)">
              ${val}
            </button>
          `,
            )
            .join("")}
        </div>`;
        // Set default
        state.detailOptions[opt.name] = opt.values[0];
      } else if (opt.type === "checkbox") {
        html += `<div class="option-checkbox-list">
          ${opt.values
            .map(
              (val) => `
            <div class="option-check-item" onclick="toggleOption('${opt.name}', '${val.name}')">
              <div class="check-box" id="check-${opt.name}-${val.name}">
                <i class="fas fa-check"></i>
              </div>
              <div class="check-info">
                <span class="check-name">${val.name}</span>
                <span class="check-price">+${formatCurrency(val.price)}</span>
              </div>
            </div>
          `,
            )
            .join("")}
        </div>`;
        state.detailOptions[opt.name] = [];
      }

      html += `</div>`;
      return html;
    })
    .join("");
}

function selectDropdownOption(optName, val, el) {
  state.detailOptions[optName] = val;

  // Toggle UI
  const parent = el.parentElement;
  parent.querySelectorAll(".option-pill").forEach((btn) => {
    btn.classList.remove("active");
  });
  el.classList.add("active");

  updateDetailPrice();
}

function toggleOption(optName, valName) {
  const selected = state.detailOptions[optName] || [];
  const idx = selected.indexOf(valName);

  if (idx === -1) {
    selected.push(valName);
  } else {
    selected.splice(idx, 1);
  }

  state.detailOptions[optName] = selected;

  // Toggle UI
  const checkEl = document.getElementById(
    `check-${optName}-${valName}`.replace(/\s/g, "\\ "),
  );
  if (checkEl) {
    checkEl.classList.toggle("active", idx === -1);
  }

  updateDetailPrice();
}

function updateDetailQty(delta) {
  state.detailQty = Math.max(1, state.detailQty + delta);
  DOM.detailQtyValue.textContent = state.detailQty;
  updateDetailPrice();
}

// ============================================
// Custom & Admin Modals (Merged from Ngedoni)
// ============================================
function openCustomModal() {
  DOM.customModal.style.display = "flex";
  requestAnimationFrame(() => DOM.customModal.classList.add("show"));
  DOM.customName.focus();
}

function closeCustomModal() {
  DOM.customModal.classList.remove("show");
  setTimeout(() => (DOM.customModal.style.display = "none"), 300);
}

function handleConfirmCustom() {
  const name = DOM.customName.value.trim();
  let price = parseFloat(DOM.customPrice.value) || 0;

  if (!name) {
    showToast("Nama menu harus diisi", "error");
    return;
  }

  const customItem = {
    menu_id: "custom-" + Date.now(),
    menu_name: name + " (Custom)",
    menu_price: price,
    menu_image_url: "",
    menu_category: "Custom",
    quantity: 1,
    note: "Request manual",
  };

  state.cart.push(customItem);
  saveCart();
  updateCartUI();
  closeCustomModal();
  showToast("Menu custom ditambahkan! 🛒", "success");

  // Reset
  DOM.customName.value = "";
  DOM.customPrice.value = "";
}

function openAddMenuModal() {
  state.isAddingNew = true;
  DOM.editModalTitle.innerHTML = '<i class="fas fa-plus"></i> Tambah Menu Baru';
  DOM.editName.value = "";
  DOM.editPrice.value = "";
  DOM.editDesc.value = "";
  DOM.editImgPreview.style.backgroundImage = "";
  DOM.editModal.style.display = "flex";
  DOM.deleteMenuBtn.style.display = "none";
  requestAnimationFrame(() => DOM.editModal.classList.add("show"));
}

function openEditModal() {
  if (!state.detailMenu) return;
  state.isAddingNew = false;
  DOM.editModalTitle.innerHTML = '<i class="fas fa-pen"></i> Edit Menu';
  DOM.editName.value = state.detailMenu.menu_name;
  DOM.editPrice.value = state.detailMenu.menu_price;
  DOM.editDesc.value = state.detailMenu.menu_description || "";
  DOM.editImgPreview.style.backgroundImage = `url(${state.detailMenu.menu_image_url})`;
  DOM.deleteMenuBtn.style.display = "block";

  closeDetailModal();
  setTimeout(() => {
    DOM.editModal.style.display = "flex";
    requestAnimationFrame(() => DOM.editModal.classList.add("show"));
  }, 350);
}

function closeEditModal() {
  DOM.editModal.classList.remove("show");
  setTimeout(() => (DOM.editModal.style.display = "none"), 300);
}

async function handleSaveEdit() {
  const name = DOM.editName.value.trim();
  const price = parseFloat(DOM.editPrice.value) || 0;
  const desc = DOM.editDesc.value.trim();
  const file = DOM.editImgFile.files[0];

  if (!name) {
    showToast("Nama menu harus diisi", "error");
    return;
  }

  let imageUrl = state.isAddingNew ? "" : state.detailMenu.menu_image_url;

  if (file) {
    // Basic image read as DataURL for demo
    imageUrl = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsDataURL(file);
    });
  }

  let menuData = {
    menu_name: name,
    menu_price: price,
    menu_description: desc,
    menu_image_url:
      imageUrl ||
      "https://placehold.co/400x300?text=" + encodeURIComponent(name),
  };

  try {
    const method = state.isAddingNew ? "POST" : "PUT";
    const url = state.isAddingNew
      ? `${CONFIG.API_BASE}/menus`
      : `${CONFIG.API_BASE}/menus/${state.detailMenu.menu_id}`;

    const res = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("ag_admin_token")}`,
      },
      body: JSON.stringify(menuData),
    });

    if (!res.ok) throw new Error("Gagal menyimpan menu ke server");

    const result = await res.json();
    const savedMenu = result.data;

    if (state.isAddingNew) {
      state.menus.push(savedMenu);
      showToast("Menu baru berhasil ditambahkan!", "success");
    } else {
      const idx = state.menus.findIndex((m) => m.menu_id === savedMenu.menu_id);
      if (idx !== -1) state.menus[idx] = savedMenu;
      showToast("Menu berhasil diperbarui!", "success");
    }

    loadMenus(); // Reload main menu UI
    closeEditModal();
  } catch (err) {
    console.error(err);
    showToast(err.message, "error");
  }
}

async function handleDeleteMenu() {
  if (state.isAddingNew || !state.detailMenu) return;

  const menuName = state.detailMenu.menu_name;
  if (!confirm(`Apakah Anda yakin ingin menghapus menu "${menuName}"?`)) return;

  try {
    const res = await fetch(
      `${CONFIG.API_BASE}/menus/${state.detailMenu.menu_id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("ag_admin_token")}`,
        },
      },
    );

    if (!res.ok) throw new Error("Gagal menghapus menu dari server");

    state.menus = state.menus.filter(
      (m) => m.menu_id !== state.detailMenu.menu_id,
    );
    loadMenus();
    closeEditModal();
    showToast(`Menu "${menuName}" berhasil dihapus`, "info");
  } catch (err) {
    console.error(err);
    showToast(err.message, "error");
  }
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
  const nameInput = $("#customer-name");
  const phoneInput = $("#customer-phone");

  if (state.isLoggedIn) {
    nameInput.value = state.customerName;
    phoneInput.value = state.customerPhone;
    nameInput.disabled = true;
    phoneInput.disabled = true;
    fetchCustomerInfo(state.customerPhone);
  } else {
    nameInput.value = localStorage.getItem("ag_customer_name") || "";
    phoneInput.value = localStorage.getItem("ag_customer_phone") || "";
    nameInput.disabled = false;
    phoneInput.disabled = false;
    if (phoneInput.value) fetchCustomerInfo(phoneInput.value);
  }

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
  const subtotal = getCartTotal();
  const promoDiscount = state.activePromo
    ? Math.floor(subtotal * state.activePromo.value)
    : 0;

  const tierRate = getTierDiscount();
  const tierDiscount = Math.floor((subtotal - promoDiscount) * tierRate);

  const total = subtotal - promoDiscount - tierDiscount;

  // Build message
  let msg = `Halo Admin Anti Gravity! 🚀\n\n`;
  msg += `📋 *DETAIL PESANAN*\n`;
  msg += `Kode: *${orderCode}*\n`;
  msg += `Nama: ${name}\n`;
  msg += `No. WA: ${phone}\n`;

  const serviceText =
    state.serviceType === "dine-in" ? "Makan di Sini" : "Bawa Pulang";
  msg += `🏠 *Tipe:* ${serviceText}\n`;
  if (state.serviceType === "dine-in" && state.tableNumber) {
    msg += `🪑 *Meja:* ${state.tableNumber}\n`;
  }
  msg += `\n`;
  msg += `🛒 *Item Pesanan:*\n`;

  state.cart.forEach((item, idx) => {
    msg += `${idx + 1}. ${item.menu_name} x${item.quantity} = ${formatCurrency(item.menu_price * item.quantity)}`;
    if (item.note) msg += `\n   📝 Catatan: ${item.note}`;
    msg += `\n`;
  });

  if (state.activePromo) {
    msg += `\n🏷️ Promo: *${state.activePromo.code}* (-${formatCurrency(promoDiscount)})\n`;
  }

  if (tierRate > 0) {
    msg += `✨ Tier Benefit: *${(tierRate * 100).toFixed(0)}%* (-${formatCurrency(tierDiscount)})\n`;
  }

  const paymentText = {
    cash: "Tunai (Bayar di Tempat)",
    transfer: "Transfer Bank",
    qris: "QRIS",
  };
  msg += `\n💳 *Metode Pembayaran:*\n${paymentText[state.paymentMethod]}\n`;

  // Add Location if exists
  const mapsLink = DOM.googleMapsInput.value;
  const address = DOM.addressInput.value.trim();

  if (address || mapsLink) {
    msg += `\n📍 *ALAMAT PENGIRIMAN*\n`;
    if (address) msg += `${address}\n`;
    if (mapsLink) msg += `📌 Link Maps: ${mapsLink}\n`;
  }

  msg += `\n💰 *Total: ${formatCurrency(total)}*\n`;
  if (notes) msg += `\n📝 Catatan Order: ${notes}\n`;
  msg += `\nDikirim via Anti Gravity 🚀`;

  // Define checkout finish function to avoid DRY
  const finishOrder = async () => {
    playSound("audioRocket");
    state.lastWaUrl = `https://wa.me/${CONFIG.WA_ADMIN_NUMBER}?text=${encodeURIComponent(msg)}`;

    if ($("#chat-admin-btn")) $("#chat-admin-btn").style.display = "flex";

    const orderPayload = {
      code: orderCode,
      name,
      phone,
      items: [...state.cart],
      subtotal,
      promoDiscount,
      tierDiscount,
      total,
      promo: state.activePromo ? state.activePromo.code : null,
      paymentMethod: state.paymentMethod,
      notes,
      table: state.tableNumber,
      serviceType: state.serviceType,
      date: new Date().toISOString(),
    };

    // Save to local history
    saveOrderToHistory(orderPayload);

    // SYNC TO SERVER (Collaborative Use)
    showToast("Mengirim pesanan ke sistem...", "info");
    const synced = await syncOrderToServer(orderPayload);

    if (synced) {
      showToast("Berhasil! Bot sedang memproses notifikasi. ✨", "success");
    } else {
      showToast(
        "Gagal kirim otomatis. Mohon klik tombol WhatsApp manual.",
        "error",
      );
    }

    // Add Loyalty Points
    const pts = Math.floor(total / 1000);
    state.points += pts;
    localStorage.setItem("ag_points", state.points);
    updateMembershipUI();

    // Show confirmation
    closeCheckoutModal();
    setTimeout(() => {
      showConfirmation(orderCode, name, total);
      if (pts > 0) showToast(`Kamu dapat ${pts} poin! 🌟`, "success");
    }, 350);

    // Clear cart & promo
    if (state.activePromo && state.activePromo.isVoucher) {
      state.vouchers = state.vouchers.filter(
        (v) => v.id !== state.activePromo.voucherId,
      );
      localStorage.setItem("ag_vouchers", JSON.stringify(state.vouchers));
    }

    state.cart = [];
    state.activePromo = null;
    DOM.promoCodeInput.value = "";
    DOM.promoMessage.textContent = "";
    saveCart();
    updateCartUI();
    renderMenus();

    // Clear form
    if (!state.isLoggedIn) {
      $("#customer-name").value = "";
      $("#customer-phone").value = "";
    }
    $("#order-notes").value = "";
  };

  if (state.paymentMethod === "qris") {
    openQrisModal(total, finishOrder);
  } else {
    finishOrder();
  }
}

// ============================================
// Payment Selection Logic
// ============================================
function initPaymentSelection() {
  DOM.paymentCards.forEach((card) => {
    card.addEventListener("click", () => {
      DOM.paymentCards.forEach((c) => c.classList.remove("active"));
      card.classList.add("active");
      state.paymentMethod = card.dataset.method;
    });
  });
}

function openQrisModal(total, onConfirm) {
  DOM.qrisTotal.textContent = formatCurrency(total);
  DOM.qrisModal.style.display = "flex";
  requestAnimationFrame(() => DOM.qrisModal.classList.add("show"));

  // Attach one-time listener for confirmation
  const handleConfirm = () => {
    closeQrisModal();
    onConfirm();
    DOM.confirmQrisBtn.removeEventListener("click", handleConfirm);
  };
  DOM.confirmQrisBtn.addEventListener("click", handleConfirm);
}

function closeQrisModal() {
  DOM.qrisModal.classList.remove("show");
  setTimeout(() => {
    DOM.qrisModal.style.display = "none";
  }, 300);
}

// ============================================
// Admin Dashboard Logic
// ============================================
function openAdminModal() {
  updateAdminStats();
  loadAdminMenus(); // Load menus for stock management
  DOM.manualStatusToggle.checked = state.isManualClosed;
  DOM.manualStatusLabel.textContent = state.isManualClosed
    ? "Toko Sedang TUTUP"
    : "Toko Sedang BUKA";

  if (DOM.adminSoundToggle) {
    DOM.adminSoundToggle.checked = state.soundEnabled;
  }

  // Reset tab to overview
  switchTab("admin-overview");

  DOM.adminModal.style.display = "flex";
  requestAnimationFrame(() => DOM.adminModal.classList.add("show"));
}

function switchTab(tabId) {
  DOM.modalTabs.forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.tab === tabId);
  });
  DOM.tabContents.forEach((content) => {
    content.style.display = content.id === tabId ? "block" : "none";
  });
}

/**
 * Load Menus for Stock Management
 */
async function loadAdminMenus() {
  if (!DOM.adminStockList) return;

  DOM.adminStockList.innerHTML = `
    <div class="admin-empty-state">
      <i class="fas fa-spinner fa-spin"></i>
      <p>Memuat daftar menu...</p>
    </div>
  `;

  try {
    const res = await fetch(`${CONFIG.API_BASE}/menus?admin_view=true`);
    if (!res.ok) throw new Error("Gagal memuat menu");
    const json = await res.json();
    state.adminMenus = json.data || [];
    renderAdminStock(state.adminMenus);
  } catch (err) {
    console.error(err);
    DOM.adminStockList.innerHTML = `<p style="text-align:center;padding:20px;color:var(--danger)">Gagal memuat menu.</p>`;
  }
}

function renderAdminStock(menus) {
  if (menus.length === 0) {
    DOM.adminStockList.innerHTML = `
      <div class="admin-empty-state">
        <i class="fas fa-search"></i>
        <p>Menu tidak ditemukan.</p>
      </div>
    `;
    return;
  }

  DOM.adminStockList.innerHTML = menus
    .map((m) => {
      const isAvailable = m.menu_is_available;
      return `
      <div class="stock-item-card">
        <div class="stock-item-info">
          <img src="${m.menu_image_url || "https://placehold.co/80"}" class="stock-item-img">
          <div class="stock-item-details">
            <h4>${m.menu_name}</h4>
            <p>${formatCurrency(m.menu_price)} • ${m.menu_category}</p>
          </div>
        </div>
        <div class="stock-toggle-group">
          <span class="stock-status-label ${isAvailable ? "available" : "sold-out"}">
            ${isAvailable ? "Tersedia" : "Habis"}
          </span>
          <label class="switch">
            <input type="checkbox" ${isAvailable ? "checked" : ""} 
              onchange="toggleMenuAvailability('${m.menu_id}', this.checked)">
            <span class="slider round"></span>
          </label>
        </div>
      </div>
    `;
    })
    .join("");
}

async function toggleMenuAvailability(menuId, isAvailable) {
  try {
    const res = await fetch(`${CONFIG.API_BASE}/menus/${menuId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("ag_admin_token")}`,
      },
      body: JSON.stringify({ menu_is_available: isAvailable }),
    });

    if (!res.ok) throw new Error("Update failed");

    showToast(
      `Menu ${isAvailable ? "tersedia kembali" : "ditandai habis"}!`,
      "success",
    );
    // Refresh local state and re-render
    const menuIdx = state.adminMenus.findIndex((m) => m.menu_id === menuId);
    if (menuIdx !== -1)
      state.adminMenus[menuIdx].menu_is_available = isAvailable;

    // Also update main menu list if it's currently loaded
    loadMenus();
  } catch (err) {
    console.error(err);
    showToast("Gagal mengubah status menu", "error");
    loadAdminMenus(); // Revert UI
  }
}

function openPinModal() {
  DOM.adminPinInput.value = "";
  DOM.pinModal.style.display = "flex";
  requestAnimationFrame(() => DOM.pinModal.classList.add("show"));
  setTimeout(() => DOM.adminPinInput.focus(), 300);
}

function closePinModal() {
  DOM.pinModal.classList.remove("show");
  setTimeout(() => (DOM.pinModal.style.display = "none"), 300);
}

function handleVerifyPin() {
  const pin = DOM.adminPinInput.value.trim();
  if (pin === "2026") {
    // Hardcoded PIN for now
    closePinModal();
    openAdminModal();
    showToast("Selamat datang, Admin!", "success");
  } else {
    showToast("Kode PIN salah! ❌", "error");
    DOM.adminPinInput.value = "";
    DOM.adminPinInput.focus();
  }
}

function closeAdminModal() {
  stopSiren();
  DOM.adminModal.classList.remove("show");
  setTimeout(() => (DOM.adminModal.style.display = "none"), 300);
}

function updateAdminStats() {
  const history = getHistory();
  const today = new Date().toDateString();
  const todayOrders = history.filter(
    (o) => new Date(o.date).toDateString() === today,
  );

  const revenue = todayOrders.reduce((sum, o) => sum + o.total, 0);
  DOM.statRevenue.textContent = formatCurrency(revenue);
  DOM.statOrders.textContent = todayOrders.length;

  // Top Item Logic
  const itemCounts = {};
  history.forEach((o) => {
    o.items.forEach((item) => {
      itemCounts[item.menu_name] =
        (itemCounts[item.menu_name] || 0) + item.quantity;
    });
  });

  const sortedItems = Object.entries(itemCounts).sort((a, b) => b[1] - a[1]);
  const topItem = sortedItems[0] ? sortedItems[0][0] : "-";
  if ($("#stat-top-item")) $("#stat-top-item").textContent = topItem;

  renderSalesChart(history);
}

function renderSalesChart(history) {
  const chartEl = $("#sales-chart");
  if (!chartEl) return;

  const daysLabels = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    last7Days.push({
      dateStr: d.toDateString(),
      label: daysLabels[d.getDay()],
      total: 0,
    });
  }

  // Aggregate totals
  history.forEach((o) => {
    const oDate = new Date(o.date).toDateString();
    const day = last7Days.find((d) => d.dateStr === oDate);
    if (day) day.total += o.total;
  });

  const maxTotal = Math.max(...last7Days.map((d) => d.total), 100000);

  chartEl.innerHTML = last7Days
    .map((day) => {
      const height = (day.total / maxTotal) * 100;
      return `
      <div class="chart-bar-wrapper">
        <div class="chart-bar" style="height: ${Math.max(5, height)}%" data-value="${formatCurrency(day.total)}"></div>
        <span class="chart-label">${day.label}</span>
      </div>
    `;
    })
    .join("");
}

function toggleManualStatus() {
  state.isManualClosed = DOM.manualStatusToggle.checked;
  localStorage.setItem("ag_manual_closed", state.isManualClosed);
  DOM.manualStatusLabel.textContent = state.isManualClosed
    ? "Toko Sedang TUTUP"
    : "Toko Sedang BUKA";
  initStatusBar();
  showToast(
    `Status toko diubah ke ${state.isManualClosed ? "Tutup" : "Buka"}`,
    "info",
  );
}

// ============================================
// Confirmation Screen
// ============================================
function showConfirmation(code, name, total, items = null) {
  DOM.confirmOrderCode.textContent = code;
  DOM.confirmName.textContent = name;
  DOM.confirmTotal.textContent = formatCurrency(total);
  DOM.receiptDate.textContent = new Date().toLocaleString("id-ID");

  // Populate items in receipt
  if (items || state.cart.length > 0) {
    const itemsToRender = items || state.cart;
    DOM.receiptItemsList.innerHTML = itemsToRender
      .map(
        (it) => `
      <div class="receipt-row" style="font-size: 13px; margin-bottom: 4px;">
        <span>${it.menu_name || it.name} x${it.quantity}</span>
        <span>${formatCurrency((it.menu_price || it.price) * it.quantity)}</span>
      </div>
    `,
      )
      .join("");
  }

  DOM.confirmModal.style.display = "flex";
  requestAnimationFrame(() => DOM.confirmModal.classList.add("show"));
  document.body.style.overflow = "hidden";

  // Trigger Confetti
  triggerConfetti();

  // Reset animations
  const rocket = $("#rocket-anim");
  rocket.style.animation = "none";
  rocket.offsetHeight; // trigger reflow
  rocket.style.animation = null;
}

function triggerConfetti() {
  const duration = 3 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(function () {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
    });
  }, 250);
}

function downloadReceipt() {
  const card = DOM.receiptCard;
  if (!card) return;

  showToast("Menyiapkan struk... 📥", "info");

  html2canvas(card, {
    scale: 2,
    backgroundColor: "#ffffff",
    logging: false,
  })
    .then((canvas) => {
      const link = document.createElement("a");
      link.download = `Struk-AG-${DOM.confirmOrderCode.textContent}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      showToast("Struk berhasil disimpan! ✅", "success");
    })
    .catch((err) => {
      console.error("Download receipt failed:", err);
      showToast("Gagal mengunduh struk", "error");
    });
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
          <div class="history-actions">
            <button class="track-btn" onclick="trackOrder('${order.code}')">
              <i class="fas fa-satellite-dish"></i> Lacak
            </button>
            <button class="reorder-btn" onclick="reorder('${order.code}')">
              <i class="fas fa-redo"></i>
            </button>
          </div>
        </div>
      </div>
    `,
    )
    .join("");
}

async function trackOrder(code) {
  showToast(`Mencari status pesanan ${code}...`, "info");
  try {
    const res = await fetch(`${CONFIG.API_BASE}/orders/code/${code}`);
    if (!res.ok) throw new Error("Pesanan belum masuk ke sistem awan");

    const json = await res.json();
    const order = json.data;

    // Show status in a nice toast or modal
    const statusMap = {
      pending: "Menunggu di Teruskan ke Dapur 👨‍🍳",
      ready: "Sedang Disiapkan / Siap Diambil 🍱",
      completed: "Sudah Selesai / Terkirim ✅",
      cancelled: "Pesanan Dibatalkan ❌",
    };

    const currentStatus = statusMap[order.order_status] || order.order_status;

    // Open confirmation modal as "Live Status"
    showConfirmation(
      order.order_code,
      order.order_customer_name,
      order.order_total_amount,
      order.items,
    );

    // Override some text for status tracking
    $(".confirm-title").innerHTML =
      `Status: ${order.order_status.toUpperCase()} ⚡`;
    $(".confirm-subtitle").innerHTML =
      `<strong>${currentStatus}</strong><br>Terakhir diupdate: ${new Date(order.order_updated_at).toLocaleTimeString("id-ID")}`;

    showToast("Status real-time berhasil dimuat!", "success");
  } catch (err) {
    console.error(err);
    showToast(err.message, "error");
  }
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
  // Reset rewards UI to default when opening history
  if (DOM.rewardsSelection) DOM.rewardsSelection.style.display = "none";
  if (DOM.historyList) DOM.historyList.style.display = "block";

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
    // Clean up rewards section on close
    if (DOM.rewardsSelection) DOM.rewardsSelection.style.display = "none";
    if (DOM.vouchersSection) DOM.vouchersSection.style.display = "none";
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
  try {
    // Theme
    DOM.themeToggle?.addEventListener("click", toggleTheme);

    // Cart
    DOM.cartBtn?.addEventListener("click", openCartSheet);
    DOM.floatingCart?.addEventListener("click", openCartSheet);
    DOM.cartOverlay?.addEventListener("click", closeCartSheet);
    DOM.clearCart?.addEventListener("click", clearCartAll);
    DOM.checkoutBtn?.addEventListener("click", openCheckout);

    // Checkout modal
    DOM.closeCheckout?.addEventListener("click", closeCheckoutModal);
    DOM.checkoutModal?.addEventListener("click", (e) => {
      if (e.target === DOM.checkoutModal) closeCheckoutModal();
    });
    DOM.waOrderBtn?.addEventListener("click", sendWhatsAppOrder);

    // Detail modal
    DOM.closeDetail?.addEventListener("click", closeDetailModal);
    DOM.detailModal?.addEventListener("click", (e) => {
      if (e.target === DOM.detailModal) closeDetailModal();
    });
    DOM.detailQtyMinus?.addEventListener("click", () => updateDetailQty(-1));
    DOM.detailQtyPlus?.addEventListener("click", () => updateDetailQty(1));
    DOM.detailNote?.addEventListener("input", (e) => {
      state.detailNote = e.target.value;
    });
    DOM.detailAddBtn?.addEventListener("click", () => {
      if (!state.detailMenu) return;
      addToCartFromDetail(
        state.detailMenu.menu_id,
        state.detailQty,
        state.detailNote,
      );
    });

    // Confirm modal
    DOM.confirmCloseBtn?.addEventListener("click", closeConfirmModal);
    DOM.confirmModal?.addEventListener("click", (e) => {
      if (e.target === DOM.confirmModal) closeConfirmModal();
    });
    DOM.copyCodeBtn?.addEventListener("click", () => {
      const code = DOM.confirmOrderCode?.textContent;
      navigator.clipboard
        .writeText(code)
        .then(() => {
          showToast(`Kode ${code} disalin!`, "success");
        })
        .catch(() => {
          showToast("Tidak bisa menyalin otomatis", "info");
        });
    });

    DOM.downloadReceiptBtn?.addEventListener("click", downloadReceipt);
    $("#chat-admin-btn")?.addEventListener("click", () => {
      if (state.lastWaUrl) window.open(state.lastWaUrl, "_blank");
    });

    // History panel
    DOM.historyBtn?.addEventListener("click", openHistoryPanel);
    DOM.closeHistory?.addEventListener("click", closeHistoryPanel);
    DOM.historyOverlay?.addEventListener("click", closeHistoryPanel);
    DOM.clearHistoryBtn?.addEventListener("click", clearHistory);

    // Rewards & Vouchers
    DOM.openRewardsBtn?.addEventListener("click", () => {
      DOM.rewardsSelection.style.display = "block";
      DOM.historyList.style.display = "none";
    });
    DOM.closeRewardsBtn?.addEventListener("click", () => {
      DOM.rewardsSelection.style.display = "none";
      DOM.historyList.style.display = "block";
    });
    DOM.closeVouchersBtn?.addEventListener("click", () => {
      DOM.vouchersSection.style.display = "none";
    });

    // Delegated claim listener
    DOM.rewardsSelection?.addEventListener("click", (e) => {
      const btn = e.target.closest(".btn-claim");
      if (!btn) return;
      const item = btn.closest(".reward-item");
      const cost = parseInt(item.dataset.cost);
      const value = parseInt(item.dataset.value);
      const name = item.dataset.name;
      redeemReward(cost, value, name);
    });

    DOM.checkoutSelectVoucherBtn?.addEventListener("click", () => {
      openHistoryPanel();
      DOM.vouchersSection.style.display = "block";
      DOM.historyList.style.display = "none";
    });

    // Edit Menu
    DOM.editMenuBtn?.addEventListener("click", openEditModal);
    DOM.closeEditModal?.addEventListener("click", closeEditModal);
    DOM.cancelEditModal?.addEventListener("click", closeEditModal);
    DOM.saveEditBtn?.addEventListener("click", handleSaveEdit);
    DOM.deleteMenuBtn?.addEventListener("click", handleDeleteMenu);

    // Custom Item Logic
    DOM.closeCustomModal?.addEventListener("click", closeCustomModal);
    DOM.cancelCustomModal?.addEventListener("click", closeCustomModal);
    DOM.confirmCustomBtn?.addEventListener("click", handleConfirmCustom);

    // Admin Dashboard
    DOM.adminBtn?.addEventListener("click", () => {
      closeHistoryPanel();
      openPinModal();
    });
    DOM.closePin?.addEventListener("click", closePinModal);
    DOM.confirmPinBtn?.addEventListener("click", handleVerifyPin);
    DOM.adminPinInput?.addEventListener("keypress", (e) => {
      if (e.key === "Enter") handleVerifyPin();
    });
    DOM.closeAdmin?.addEventListener("click", closeAdminModal);
    DOM.manualStatusToggle?.addEventListener("change", toggleManualStatus);

    // Modal Tab Switching
    DOM.modalTabs?.forEach((tab) => {
      tab.addEventListener("click", () => switchTab(tab.dataset.tab));
    });

    // Admin Stock Search
    DOM.adminMenuSearch?.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase();
      const filtered = state.adminMenus.filter(
        (m) =>
          m.menu_name.toLowerCase().includes(query) ||
          m.menu_category.toLowerCase().includes(query),
      );
      renderAdminStock(filtered);
    });

    // Promo
    DOM.applyPromoBtn?.addEventListener("click", applyPromoCode);

    // QRIS
    DOM.closeQris?.addEventListener("click", closeQrisModal);
    DOM.qrisModal?.addEventListener("click", (e) => {
      if (e.target === DOM.qrisModal) closeQrisModal();
    });

    // Theme Colors 🎨
    DOM.colorBtn?.addEventListener("click", openColorModal);
    DOM.closeColors?.addEventListener("click", closeColorModal);
    DOM.colorModal?.addEventListener("click", (e) => {
      if (e.target === DOM.colorModal) closeColorModal();
    });
    DOM.colorOptions?.forEach((opt) => {
      opt.addEventListener("click", () => {
        const color = opt.dataset.color;
        setBrandColor(color);
        closeColorModal();
      });
    });

    // Surprise Me 🎲
    DOM.surpriseBtn?.addEventListener("click", openSurpriseModal);
    DOM.surpriseAgain?.addEventListener("click", pickRandomMenu);
    DOM.surpriseOpen?.addEventListener("click", () => {
      const menuId = DOM.surpriseOpen.dataset.menuId;
      closeSurpriseModal();
      if (menuId) openDetailModal(menuId);
    });

    // Map Picker
    DOM.openMapBtn?.addEventListener("click", openMapModal);
    DOM.closeMap?.addEventListener("click", closeMapModal);
    DOM.confirmLocationBtn?.addEventListener("click", confirmLocation);
    DOM.btnGetCurrentLoc?.addEventListener("click", getCurrentLocation);

    // Service Type Selection
    DOM.serviceOptions?.forEach((btn) => {
      btn.addEventListener("click", () => {
        const type = btn.dataset.type;
        state.serviceType = type;

        DOM.serviceOptions.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        if (type === "dine-in") {
          DOM.tableGroup.style.display = "block";
        } else {
          DOM.tableGroup.style.display = "none";
          state.tableNumber = "";
          if (DOM.tableNumberInput) DOM.tableNumberInput.value = "";
        }
      });
    });

    DOM.tableNumberInput?.addEventListener("input", (e) => {
      state.tableNumber = e.target.value;
    });

    $("#customer-phone")?.addEventListener("blur", (e) => {
      fetchCustomerInfo(e.target.value);
    });

    // Admin Cloud Orders
    DOM.refreshServerOrdersBtn?.addEventListener("click", () =>
      loadServerOrders(true),
    );

    DOM.adminSoundToggle?.addEventListener("change", (e) => {
      state.soundEnabled = e.target.checked;
      localStorage.setItem("ag_admin_sound", state.soundEnabled);
      const status = state.soundEnabled ? "aktif" : "dimatikan";
      showToast(`Suara notifikasi ${status}`, "info");
    });

    DOM.downloadCsvBtn?.addEventListener("click", downloadSalesCSV);
    DOM.btnEnableNotifications?.addEventListener(
      "click",
      requestNotificationPermission,
    );

    $("#admin-test-wa")?.addEventListener("click", async () => {
      try {
        showToast(`Menghubungi: ${CONFIG.API_BASE}...`, "info");
        const res = await fetch(`${CONFIG.API_BASE}/test-wa`, {
          signal: AbortSignal.timeout(10000),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (data.success) {
          showToast("✅ Berhasil! Cek WhatsApp Admin.", "success");
        } else {
          showToast(`❌ Gagal: ${data.message}`, "error");
        }
      } catch (err) {
        showToast(
          `❌ Error: ${err.message} (API: ${CONFIG.API_BASE})`,
          "error",
        );
        console.error("WA Test Error:", err, "API:", CONFIG.API_BASE);
      }
    });

    DOM.cloudFilterBtns?.forEach((btn) => {
      btn.addEventListener("click", () => {
        DOM.cloudFilterBtns.forEach((b) => b.classList.remove("active"));

        btn.classList.add("active");
        state.cloudFilter = btn.dataset.status;
        loadServerOrders(); // Re-render with filter
      });
    });

    // Login Modal
    DOM.userLoginBtn?.addEventListener("click", openLoginModal);
    DOM.closeLogin?.addEventListener("click", closeLoginModal);
    DOM.btnDoLogin?.addEventListener("click", handleLogin);
    DOM.loginModal?.addEventListener("click", (e) => {
      if (e.target === DOM.loginModal) closeLoginModal();
    });
    DOM.loginPhone?.addEventListener("keypress", (e) => {
      if (e.key === "Enter") handleLogin();
    });
    DOM.loginName?.addEventListener("keypress", (e) => {
      if (e.key === "Enter") handleLogin();
    });

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeCartSheet();
        closeCheckoutModal();
        closeDetailModal();
        closeConfirmModal();
        closeHistoryPanel();
        closeEditModal();
        closeCustomModal();
        closeAdminModal();
        closeQrisModal();
        closeColorModal();
        closeSurpriseModal();
        closeMapModal();
        closeLoginModal();
      }
    });
  } catch (err) {
    console.error("❌ initEventListeners error:", err);
  }
}

// ============================================
// Login Logic
// ============================================
function openLoginModal() {
  if (state.isLoggedIn) {
    const logout = confirm(
      `Halo ${state.customerName}, apakah Anda ingin keluar (logout)?`,
    );
    if (logout) handleLogout();
    return;
  }
  DOM.loginModal.style.display = "flex";
  requestAnimationFrame(() => DOM.loginModal.classList.add("show"));
  DOM.loginPhone.focus();
}

function closeLoginModal() {
  DOM.loginModal.classList.remove("show");
  setTimeout(() => {
    DOM.loginModal.style.display = "none";
    DOM.loginNameGroup.style.display = "none";
    DOM.loginPhone.value = "";
    DOM.loginName.value = "";
  }, 300);
}

async function handleLogin() {
  const phone = DOM.loginPhone.value.trim();
  const nameInput = DOM.loginName.value.trim();

  if (!phone || phone.length < 9) {
    showToast("Masukkan nomor WhatsApp yang valid", "error");
    return;
  }

  try {
    DOM.btnDoLogin.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> Memproses...';
    DOM.btnDoLogin.disabled = true;

    // Check customer info from backend
    const res = await fetch(`${CONFIG.API_BASE}/customers/phone/${phone}`);
    const data = await res.json();

    if (data.success && data.data) {
      // User exists
      const user = data.data;
      saveLogin(user.customer_phone, user.customer_name, user.customer_points);
      showToast(`Selamat datang kembali, ${user.customer_name}! ✨`, "success");
      closeLoginModal();
    } else {
      // User not found, need name for registration
      if (DOM.loginNameGroup.style.display === "none") {
        DOM.loginNameGroup.style.display = "block";
        DOM.loginName.focus();
        showToast("Nomor baru! Silakan masukkan nama Anda.", "info");
      } else {
        if (!nameInput) {
          showToast("Mohon isi nama Anda", "error");
          return;
        }
        // Save as new user
        saveLogin(phone, nameInput, 0);
        showToast(`Selamat datang, ${nameInput}! ✨`, "success");
        closeLoginModal();
      }
    }
  } catch (err) {
    console.error("Login Error:", err);
    showToast("Gagal terhubung ke server", "error");
  } finally {
    DOM.btnDoLogin.innerHTML = 'Lanjut <i class="fas fa-arrow-right"></i>';
    DOM.btnDoLogin.disabled = false;
  }
}

function saveLogin(phone, name, points = 0) {
  state.isLoggedIn = true;
  state.customerPhone = phone;
  state.customerName = name;
  state.points = points;

  localStorage.setItem("ag_customer_phone", phone);
  localStorage.setItem("ag_customer_name", name);
  localStorage.setItem("ag_points", points);

  updateUserUI();
  updateMembershipUI();
}

function handleLogout() {
  state.isLoggedIn = false;
  state.customerPhone = "";
  state.customerName = "";
  state.points = 0;

  localStorage.removeItem("ag_customer_phone");
  localStorage.removeItem("ag_customer_name");
  localStorage.removeItem("ag_points");

  updateUserUI();
  updateMembershipUI();
  showToast("Anda telah keluar.", "info");
}

function updateUserUI() {
  if (state.isLoggedIn) {
    DOM.userLoginBtn.classList.add("logged-in");
    DOM.userLoginBtn.innerHTML = '<i class="fas fa-user-check"></i>';
    DOM.userLoginBtn.title = `Profil: ${state.customerName}`;
  } else {
    DOM.userLoginBtn.classList.remove("logged-in");
    DOM.userLoginBtn.innerHTML = '<i class="fas fa-user-circle"></i>';
    DOM.userLoginBtn.title = "Login / Profil";
  }
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
// function initServiceWorker() {
//   if ("serviceWorker" in navigator) {
//     navigator.serviceWorker
//       .register("sw.js")
//       .then(() => console.log("✅ Service Worker registered"))
//       .catch((err) => console.log("SW registration failed:", err));
//   }
// }

// ============================================
// Initialize App
// ============================================
document.addEventListener("DOMContentLoaded", () => {
  initSplash();
  initTheme();
  initStatusBar();
  updateUserUI(); // Load login UI state

  const savedPhone = localStorage.getItem("ag_customer_phone");
  if (savedPhone) {
    fetchCustomerInfo(savedPhone);
  } else {
    updateMembershipUI();
  }
  initSearch();
  initSortButtons();
  initEventListeners();
  initPaymentSelection();
  initBrandColor();
  initHeroSlider();
  initSocialProof();
  initStickyNav();
  // initServiceWorker();

  // Show skeleton then load
  renderSkeletons();
  setTimeout(() => {
    loadMenus();
    updateCartUI();
    // Start Cloud Orders Polling
    loadServerOrders();
    setInterval(loadServerOrders, 20000); // Poll every 20s for faster notification
  }, 1200);
});

// ============================================
// Hero Slider Logic
// ============================================
function initHeroSlider() {
  const slides = [
    {
      title: "Diskon 15% Spesial!",
      desc: "Gunakan kode ANTIGRAVITY untuk pesanan pertamamu hari ini.",
      img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800",
      badge: "Promo Terbatas",
    },
    {
      title: "Menu Baru: Burger Melted",
      desc: "Nikmati sensasi keju lumer yang melimpah di setiap gigitan.",
      img: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800",
      badge: "Baru",
    },
    {
      title: "Gratis Ongkir!",
      desc: "Makan enak tanpa pusing ongkir khusus area sekitar toko.",
      img: "https://images.unsplash.com/photo-1526367790999-0150786486a9?w=800",
      badge: "Event",
    },
  ];

  DOM.sliderTrack.innerHTML = slides
    .map(
      (s) => `
    <div class="slide" style="background-image: url('${s.img}')">
      <div class="slide-overlay">
        <span class="slide-badge">${s.badge}</span>
        <h2>${s.title}</h2>
        <p>${s.desc}</p>
      </div>
    </div>
  `,
    )
    .join("");

  DOM.sliderDots.innerHTML = slides
    .map(
      (_, i) => `
    <div class="dot ${i === 0 ? "active" : ""}" data-index="${i}"></div>
  `,
    )
    .join("");

  let currentSlide = 0;
  const totalSlides = slides.length;

  function goToSlide(index) {
    currentSlide = index;
    DOM.sliderTrack.style.transform = `translateX(-${index * 100}%)`;
    $$(".dot").forEach((d, i) => d.classList.toggle("active", i === index));
  }

  // Auto slide
  setInterval(() => {
    currentSlide = (currentSlide + 1) % totalSlides;
    goToSlide(currentSlide);
  }, 5000);

  // Click dots
  $$(".dot").forEach((dot) => {
    dot.addEventListener("click", () => goToSlide(parseInt(dot.dataset.index)));
  });
}

// ============================================
// Skeleton Loading Logic
// ============================================
function renderSkeletons() {
  DOM.menuGrid.innerHTML = Array(4)
    .fill(0)
    .map(
      () => `
    <div class="skeleton-card">
      <div class="skeleton skeleton-img"></div>
      <div class="skeleton skeleton-title"></div>
      <div class="skeleton skeleton-desc"></div>
      <div class="skeleton skeleton-price"></div>
    </div>
  `,
    )
    .join("");
}

// ============================================
// Social Proof Logic
// ============================================
function initSocialProof() {
  const proofs = [
    "12 orang sedang melihat menu ini",
    "Seseorang baru saja memesan Burger Melted",
    "5 pesanan terkirim dalam 1 jam terakhir",
    "Menu Mie Ayam sedang sangat populer!",
    "Baru saja: Pesanan dikirim ke Jakarta",
  ];

  function showProof() {
    const text = proofs[Math.floor(Math.random() * proofs.length)];
    DOM.spText.textContent = text;
    DOM.socialProof.classList.add("show");

    setTimeout(() => {
      DOM.socialProof.classList.remove("show");
    }, 4000);
  }

  // Initial delay
  setTimeout(() => {
    showProof();
    setInterval(showProof, 15000); // Repeat every 15s
  }, 3000);
}

// ============================================
// Brand Theme Logic
// ============================================
function initBrandColor() {
  setBrandColor(state.brandColor, false);
}

function setBrandColor(color, notify = true) {
  state.brandColor = color;
  localStorage.setItem("ag_brand_color", color);
  document.documentElement.setAttribute("data-brand", color);

  DOM.colorOptions.forEach((opt) => {
    opt.classList.toggle("active", opt.dataset.color === color);
  });

  if (notify) showToast("Warna tema berhasil diubah! ✨", "success");
}

function openColorModal() {
  DOM.colorModal.style.display = "flex";
  requestAnimationFrame(() => DOM.colorModal.classList.add("show"));
}

function closeColorModal() {
  DOM.colorModal.classList.remove("show");
  setTimeout(() => (DOM.colorModal.style.display = "none"), 300);
}

// ============================================
// Surprise Me Logic
// ============================================
function openSurpriseModal() {
  DOM.surpriseModal.style.display = "flex";
  requestAnimationFrame(() => DOM.surpriseModal.classList.add("show"));
  pickRandomMenu();
}

function closeSurpriseModal() {
  DOM.surpriseModal.classList.remove("show");
  setTimeout(() => {
    DOM.surpriseModal.style.display = "none";
    DOM.surpriseResult.style.display = "none";
    DOM.surpriseOpen.style.display = "none";
    DOM.diceAnim.classList.remove("rolling");
  }, 300);
}

function pickRandomMenu() {
  // Reset UI
  DOM.surpriseResult.style.display = "none";
  DOM.surpriseOpen.style.display = "none";
  DOM.diceAnim.classList.add("rolling");
  playSound("audioCart"); // Simulation sound

  setTimeout(() => {
    const menus = state.menus.filter((m) => m.menu_status !== "Habis");
    if (menus.length === 0) {
      showToast("Tidak ada menu tersedia saat ini", "info");
      closeSurpriseModal();
      return;
    }

    const randomMenu = menus[Math.floor(Math.random() * menus.length)];

    // Show result
    DOM.diceAnim.classList.remove("rolling");
    DOM.surpriseResult.style.display = "flex";
    DOM.surpriseResult.innerHTML = `
      <img src="${randomMenu.menu_image_url || "https://placehold.co/120?text=No+Image"}" class="surprise-result-img" alt="${randomMenu.menu_name}">
      <div class="surprise-result-info">
        <h4>${randomMenu.menu_name}</h4>
        <p>${randomMenu.menu_description || "Menu lezat pilihan spesial buat kamu hari ini."}</p>
        <strong>${formatCurrency(randomMenu.menu_price)}</strong>
      </div>
    `;

    DOM.surpriseOpen.style.display = "block";
    DOM.surpriseOpen.dataset.menuId = randomMenu.menu_id;

    playSound("audioOrder");
  }, 1500);
}

// ============================================
// Map Picker Logic
// ============================================
function openMapModal() {
  DOM.mapModal.style.display = "flex";
  requestAnimationFrame(() => DOM.mapModal.classList.add("show"));

  // Initialize map if not already done
  if (!state.map) {
    initMap();
  } else {
    // Small timeout to ensure container is fully visible before invalidateSize
    setTimeout(() => {
      state.map.invalidateSize();
    }, 400);
  }
}

function initMap() {
  const defaultPos = [-6.2, 106.8166]; // Jakarta

  state.map = L.map("map-container").setView(defaultPos, 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(state.map);

  state.marker = L.marker(defaultPos, {
    draggable: true,
  }).addTo(state.map);

  state.marker.on("dragend", function () {
    const pos = state.marker.getLatLng();
    state.selectedCoords = pos;
  });

  state.map.on("click", function (e) {
    state.marker.setLatLng(e.latlng);
    state.selectedCoords = e.latlng;
  });

  state.selectedCoords = { lat: defaultPos[0], lng: defaultPos[1] };
}

function closeMapModal() {
  DOM.mapModal.classList.remove("show");
  setTimeout(() => (DOM.mapModal.style.display = "none"), 300);
}

function getCurrentLocation() {
  if (!navigator.geolocation) {
    showToast("Geolocation tidak didukung oleh browser kamu", "error");
    return;
  }

  showToast("Mencari lokasi kamu...", "info");

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      const pos = [lat, lng];

      state.map.setView(pos, 16);
      state.marker.setLatLng(pos);
      state.selectedCoords = { lat, lng };
      showToast("Lokasi ditemukan!", "success");
    },
    () => {
      showToast("Gagal mendapatkan lokasi kamu", "error");
    },
  );
}

function confirmLocation() {
  if (!state.selectedCoords) {
    showToast("Pilih lokasi di peta terlebih dahulu", "error");
    return;
  }

  const { lat, lng } = state.selectedCoords;
  const link = `https://www.google.com/maps?q=${lat},${lng}`;

  DOM.googleMapsInput.value = link;
  DOM.locationBadge.style.display = "flex";

  showToast("Titik lokasi berhasil disimpan! 📍", "success");
  closeMapModal();
}

/**
 * Sync Order to Server for Collaborative Use
 */
async function syncOrderToServer(orderData) {
  try {
    const payload = {
      order_customer_name: orderData.name,
      order_customer_phone: orderData.phone,
      order_notes: (orderData.notes || "").trim(),
      order_total_amount: orderData.total, // Include final total with discounts
      items: orderData.items.map((it) => ({
        menu_id: it.menu_id,
        menu_name: it.menu_name, // Required for demo mode
        menu_price: it.menu_price, // Required for demo mode
        quantity: it.quantity,
        notes: (it.note || "").trim(),
        item_notes: (it.note || "").trim(),
      })),
    };

    // Add extra info to notes
    if (orderData.table) {
      payload.order_notes = `[MEJA ${orderData.table}] ` + payload.order_notes;
    }
    if (orderData.serviceType === "take-away") {
      payload.order_notes = `[BAWA PULANG] ` + payload.order_notes;
    }

    const res = await fetch(`${CONFIG.API_BASE}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      console.error("Server sync failed:", errData);
      throw new Error(errData.message || "Sync failed");
    }
    return true;
  } catch (err) {
    console.error("Collaborative Sync Error:", err.message);
    return false;
  }
}

/**
 * Load Orders from Server (Cloud)
 */
async function loadServerOrders(isManual = false) {
  if (!DOM.serverOrdersList) return;

  const refreshIcon = DOM.refreshServerOrdersBtn?.querySelector("i");
  refreshIcon?.classList.add("spinning");

  // Show loading (only if list is empty for better UX)
  if (
    DOM.serverOrdersList.children.length === 0 ||
    DOM.serverOrdersList.querySelector(".admin-empty-state")
  ) {
    DOM.serverOrdersList.innerHTML = `
      <div class="admin-empty-state">
        <i class="fas fa-satellite fa-spin"></i>
        <p>Mengambil data dari awan...</p>
      </div>
    `;
  }

  try {
    const res = await fetch(`${CONFIG.API_BASE}/orders`);
    if (!res.ok) throw new Error("Gagal mengambil data");

    const json = await res.json();
    const orders = json.data || [];
    state.serverOrders = orders; // Store globally for printing

    if (orders.length === 0) {
      DOM.serverOrdersList.innerHTML = `
        <div class="admin-empty-state">
          <i class="fas fa-box-open"></i>
          <p>Belum ada pesanan di server.</p>
        </div>
      `;
      state.lastCloudOrderId = null;
      return;
    }

    // New Order Notification
    if (orders[0].order_id !== state.lastCloudOrderId) {
      if (state.lastCloudOrderId !== null) {
        if (state.soundEnabled) {
          playSound("audioSiren"); // Start Siren
        }

        // Add vibration for mobile devices
        if ("vibrate" in navigator) {
          navigator.vibrate([1000, 500, 1000, 500, 1000]);
        }

        // Native System Notification
        showSystemNotification(
          "🚨 PESANAN BARU!",
          `Ada pesanan dari ${orders[0].order_customer_name}. Segera cek!`,
        );

        showToast(
          `Ada pesanan cloud baru masuk! ☁️ <button onclick="stopSiren()" style="margin-left:10px; padding:2px 8px; border-radius:4px; background:white; color:black; border:none; cursor:pointer">Matikan Dering</button>`,
          "info",
        );
      }
      state.lastCloudOrderId = orders[0].order_id;
    }

    // Render Cloud Orders
    let filtered = orders;
    if (state.cloudFilter !== "all") {
      filtered = orders.filter((o) => o.order_status === state.cloudFilter);
    }

    if (filtered.length === 0) {
      DOM.serverOrdersList.innerHTML = `
          <div class="admin-empty-state">
            <i class="fas fa-filter"></i>
            <p>Tidak ada pesanan dengan status ini.</p>
          </div>
        `;
      return;
    }

    DOM.serverOrdersList.innerHTML = filtered
      .map((order) => {
        const date = new Date(order.order_created_at).toLocaleString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        });

        const itemsHtml = order.items
          ? order.items
              .map((it) => `• ${it.menu_name} (x${it.quantity})`)
              .join("<br>")
          : "Data menu tidak tersedia";

        const isPending = order.order_status === "pending";

        return `
          <div class="server-order-card">
            <h4>
              <span>#${order.order_code}</span>
              <span class="cloud-badge" data-status="${order.order_status}">${order.order_status}</span>
            </h4>
            <div class="order-meta">
              <span><i class="fas fa-user"></i> ${order.order_customer_name}</span>
              <span><i class="fas fa-clock"></i> ${date}</span>
            </div>
            <div class="order-items-mini">
              <div style="font-weight:700;margin-bottom:4px">Menu:</div>
              <div style="margin-bottom:8px">${itemsHtml}</div>
              <div style="font-weight:700;margin-bottom:4px">Catatan:</div>
              <div>${order.order_notes || "Tidak ada catatan"}</div>
            </div>
          ${
            isPending
              ? `
          <div class="order-actions-mini">
            <button class="btn-status-sm ready" onclick="updateServerOrderStatus('${order.order_id}', 'completed')">
              <i class="fas fa-check"></i> Selesai
            </button>
            <button class="btn-status-sm cancel" onclick="updateServerOrderStatus('${order.order_id}', 'cancelled')">
              <i class="fas fa-times"></i> Batal
            </button>
            <button class="btn-status-sm" style="background:var(--bg-card-hover); border:1px solid var(--border-subtle)" onclick="printCloudOrder('${order.order_id}')">
              <i class="fas fa-print"></i> Struk
            </button>
          </div>
          `
              : `
          <div class="order-actions-mini">
             <button class="btn-status-sm" style="background:var(--bg-card-hover); border:1px solid var(--border-subtle); flex:1" onclick="printCloudOrder('${order.order_id}')">
              <i class="fas fa-print"></i> Cetak Ulang Struk
            </button>
          </div>
          `
          }
        </div>
      `;
      })
      .join("");
    if (isManual) showToast("Data awan diperbarui!", "success");
  } catch (err) {
    console.error(err);
    DOM.serverOrdersList.innerHTML = `
      <div class="admin-empty-state">
        <i class="fas fa-exclamation-triangle" style="color: var(--danger)"></i>
        <p>Gagal terhubung ke server.</p>
      </div>
    `;
  } finally {
    refreshIcon?.classList.remove("spinning");
  }
}

async function updateServerOrderStatus(orderId, newStatus) {
  try {
    const res = await fetch(`${CONFIG.API_BASE}/orders/${orderId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("ag_admin_token")}`,
      },
      body: JSON.stringify({ order_status: newStatus }),
    });

    if (!res.ok) throw new Error("Gagal memperbarui status");

    showToast(
      `Status #${orderId.substring(0, 8)} menjadi ${newStatus}`,
      "success",
    );
    loadServerOrders(); // Refresh
  } catch (err) {
    console.error(err);
    showToast("Gagal update status order", "error");
  }
}

function printCloudOrder(orderId) {
  const order = state.serverOrders.find((o) => o.order_id === orderId);
  if (!order) {
    showToast("Data pesanan tidak ditemukan", "error");
    return;
  }

  // Use showConfirmation as a template renderer (silent mode could be an enhancement)
  // But for now, we just populate and show it.
  showConfirmation(
    order.order_code,
    order.order_customer_name,
    order.order_total_amount || 0,
    order.items,
  );

  // Custom date from order
  DOM.receiptDate.textContent = new Date(order.order_created_at).toLocaleString(
    "id-ID",
  );

  showToast("Pratinjau struk dibuka! 📄", "success");
}

/**
 * Export Sales to CSV
 */
function downloadSalesCSV() {
  if (state.serverOrders.length === 0) {
    showToast("Tidak ada data pesanan untuk diekspor", "error");
    return;
  }

  const headers = [
    "ID Order",
    "Nama Pelanggan",
    "Status",
    "Total Pembayaran",
    "Tanggal",
    "Item",
  ];
  const rows = state.serverOrders.map((o) => {
    const itemsStr = o.items
      .map((i) => `${i.menu_name}(x${i.quantity})`)
      .join("; ");
    return [
      o.order_code,
      `"${o.order_customer_name}"`,
      o.order_status,
      o.order_total_amount,
      new Date(o.order_created_at).toLocaleString("id-ID"),
      `"${itemsStr}"`,
    ];
  });

  const csvContent = [headers, ...rows].map((r) => r.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `Laporan-Penjualan-${new Date().toISOString().split("T")[0]}.csv`,
  );
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast("Laporan CSV berhasil diunduh! 📊", "success");
}
