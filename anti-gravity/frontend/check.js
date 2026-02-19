const fs = require("fs");
const html = fs.readFileSync("public/index.html", "utf8");
const js = fs.readFileSync("public/app.js", "utf8");
const css = fs.readFileSync("public/styles.css", "utf8");

let ok = true;

const requiredFns = [
  "openDetailModal",
  "closeDetailModal",
  "quickAddToCart",
  "addToCartFromDetail",
  "updateCartQty",
  "openCartSheet",
  "closeCartSheet",
  "openCheckout",
  "closeCheckoutModal",
  "sendWhatsAppOrder",
  "showConfirmation",
  "openHistoryPanel",
  "closeHistoryPanel",
  "reorder",
  "clearHistory",
  "filterAndSort",
  "renderMenus",
  "updateCartUI",
  "initStatusBar",
  "buildCategoryTabs",
  "initSortButtons",
  "generateOrderCode",
  "saveOrderToHistory",
  "renderHistory",
  "updateDetailQty",
];

console.log("=== FUNCTION CHECK ===");
requiredFns.forEach((fn) => {
  const exists = js.includes("function " + fn);
  if (!exists) ok = false;
  console.log((exists ? "✅" : "❌") + " " + fn);
});

const onclickFns = [...html.matchAll(/onclick="([^"(]+)/g)].map((m) =>
  m[1].trim(),
);
console.log("\n=== HTML onclick CHECK ===");
[...new Set(onclickFns)].forEach((fn) => {
  const exists = js.includes("function " + fn);
  if (!exists) ok = false;
  console.log((exists ? "✅" : "❌") + " " + fn + "()");
});

console.log("\n=== CSS CLASS CHECK ===");
const requiredCss = [
  "status-bar",
  "filter-bar",
  "sort-btn",
  "detail-modal-content",
  "confirm-modal-content",
  "side-panel",
  "history-item",
  "reorder-btn",
  "cart-item-note",
  "detail-note-group",
  "add-to-cart-btn",
];
requiredCss.forEach((cls) => {
  const exists = css.includes("." + cls);
  if (!exists) ok = false;
  console.log((exists ? "✅" : "❌") + " ." + cls);
});

console.log("\n=== KEY DOM IDs in HTML ===");
const keyIds = [
  "detail-modal",
  "close-detail",
  "detail-img",
  "detail-badge",
  "detail-category",
  "detail-popular",
  "detail-name",
  "detail-desc",
  "detail-price",
  "detail-qty-minus",
  "detail-qty-plus",
  "detail-qty-value",
  "detail-note",
  "detail-add-btn",
  "detail-add-price",
  "confirm-modal",
  "confirm-order-code",
  "confirm-name",
  "confirm-total",
  "copy-code-btn",
  "confirm-close-btn",
  "history-btn",
  "history-overlay",
  "history-panel",
  "close-history",
  "history-list",
  "clear-history-btn",
  "status-dot",
  "status-text",
  "status-time",
  "sort-default",
  "sort-price-asc",
  "sort-price-desc",
  "sort-name",
];
keyIds.forEach((id) => {
  const exists = html.includes('id="' + id + '"');
  if (!exists) ok = false;
  console.log((exists ? "✅" : "❌") + " #" + id);
});

console.log(
  "\n" + (ok ? "🎉 SEMUA CHECKS PASSED!" : "⚠️  Ada yang perlu diperbaiki"),
);
