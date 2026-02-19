document.addEventListener("DOMContentLoaded", () => {
  console.log("Food Delivery App Loaded");

  // --- Mock Data ---
  const products = [
    {
      id: 1,
      name: "Seafood Salad",
      category: "all",
      price: 12000,
      rating: 4.5,
      time: "20min",
      cals: "100 Kcal",
      desc: "Fresh seafood salad with lettuce green mix, cherry tomatoes, herbs and olive oil, lemon dressing food.",
      img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      ingredients: ["🍤", "🍅", "🥬", "🍋"],
    },
    {
      id: 2,
      name: "Avocado Salad",
      category: "all",
      price: 12000,
      rating: 4.5,
      time: "20min",
      cals: "120 Kcal",
      desc: "Healthy avocado salad with spinach, kale, and toasted sesame dressing.",
      img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      ingredients: ["🥑", "🥗", "🥒", "🌽"],
    },
    {
      id: 3,
      name: "Fruit Salad",
      category: "snack",
      price: 10000,
      rating: 4.8,
      time: "10min",
      cals: "80 Kcal",
      desc: "Sweet and refreshing fruit mix with berries, melon, and mint.",
      img: "https://images.unsplash.com/photo-1519996529931-28324d5a630e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      ingredients: ["🍓", "🍇", "🍉", "🍒"],
    },
    {
      id: 4,
      name: "Chicken Bowl",
      category: "hot",
      price: 15000,
      rating: 4.7,
      time: "25min",
      cals: "350 Kcal",
      desc: "Grilled chicken breast with quinoa and roasted vegetables.",
      img: "https://images.unsplash.com/photo-1585238342024-78d387f4a707?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      ingredients: ["🍗", "🥦", "🥕", "🍚"],
    },
  ];

  // --- State ---
  // --- State ---
  // Load products from local storage if available, else use default mock
  const savedProducts = localStorage.getItem("ngedoni_products");
  const state = {
    cart: JSON.parse(localStorage.getItem("ngedoni_cart")) || [],
    products: savedProducts ? JSON.parse(savedProducts) : products,
    currentProduct: null,
    currentQty: 1,
  };

  const saveProducts = () => {
    localStorage.setItem("ngedoni_products", JSON.stringify(state.products));
  };

  // Helper: Format Rupiah
  const formatRp = (num) => {
    return "Rp " + num.toLocaleString("id-ID");
  };

  // Helper: Toast Notification
  const showToast = (message) => {
    const existing = document.getElementById("toast-notification");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.id = "toast-notification";
    toast.innerText = message;
    toast.style.position = "fixed";
    toast.style.bottom = "80px";
    toast.style.left = "50%";
    toast.style.transform = "translateX(-50%)";
    toast.style.backgroundColor = "#333";
    toast.style.color = "#fff";
    toast.style.padding = "10px 20px";
    toast.style.borderRadius = "20px";
    toast.style.boxShadow = "0 5px 15px rgba(0,0,0,0.2)";
    toast.style.zIndex = "3000";
    toast.style.fontSize = "0.9rem";
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.3s";

    document.body.appendChild(toast);

    // Trigger anim
    setTimeout(() => (toast.style.opacity = "1"), 10);

    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  };

  // --- DOM Elements ---
  const productGrid = document.getElementById("product-grid");
  const detailView = document.getElementById("detail-view");
  const navCartBtn = document.getElementById("nav-cart");

  // Detail View Elements
  const detailImg = document.getElementById("detail-img");
  const detailTitle = document.getElementById("detail-title");
  const detailRating = document.getElementById("detail-rating");
  const detailCals = document.getElementById("detail-cals");
  const detailTime = document.getElementById("detail-time");
  const detailDesc = document.getElementById("detail-desc");
  const detailPrice = document.getElementById("detail-price");
  const backBtn = document.getElementById("back-btn");
  const qtyMinus = document.getElementById("qty-minus");
  const qtyPlus = document.getElementById("qty-plus");
  const qtyVal = document.getElementById("qty-val");
  const addToCartBtn = document.getElementById("add-to-cart-main");

  // --- Functions ---

  const saveCart = () => {
    localStorage.setItem("ngedoni_cart", JSON.stringify(state.cart));
    updateCartBadge();
  };

  const updateCartBadge = () => {
    // Logic to show a red dot or count on the bag icon could go here
    // For now, simpler is better
    if (navCartBtn) {
      const count = state.cart.reduce((acc, item) => acc + item.qty, 0);
      navCartBtn.innerHTML = `<i class="fas fa-shopping-bag"></i>${count > 0 ? `<span style="position:absolute; top:5px; right:15px; background:red; color:white; border-radius:50%; padding:2px 6px; font-size:10px;">${count}</span>` : ""}`;
    }
  };

  const renderProducts = (filter = "all") => {
    productGrid.innerHTML = "";
    const filtered =
      filter === "all"
        ? state.products
        : state.products.filter(
            (p) => p.category === filter || p.category === "all",
          );

    filtered.forEach((product) => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
                <i class="far fa-heart fav-icon"></i>
                <div class="product-img-container">
                    <img src="${product.img}" alt="${product.name}">
                </div>
                <div class="product-title">${product.name}</div>
                <div class="product-meta">
                    <span>${product.time}</span>
                    <span><i class="fas fa-star" style="color:#ffcc00"></i> ${product.rating}</span>
                </div>
                <div class="product-price">${formatRp(product.price)}</div>
                <div class="add-btn-small">+</div>
            `;
      card.addEventListener("click", () => openDetail(product));
      productGrid.appendChild(card);
      productGrid.appendChild(card);
    });

    // Add "Custom / Manual" Card at the end
    const customCard = document.createElement("div");
    customCard.className = "product-card";
    customCard.style.border = "2px dashed #ccc";
    customCard.style.display = "flex";
    customCard.style.flexDirection = "column";
    customCard.style.justifyContent = "center";
    customCard.style.alignItems = "center";

    customCard.innerHTML = `
        <div style="font-size: 2rem; color: #ccc; margin-bottom: 10px;">
            <i class="fas fa-plus-circle"></i>
        </div>
        <div class="product-title">Menu Lain?</div>
        <div class="product-meta" style="justify-content:center;">
            <span>Request Manual</span>
        </div>
    `;
    customCard.addEventListener("click", () => {
      const customModal = document.getElementById("custom-modal");
      const customName = document.getElementById("custom-name");
      if (customModal) {
        customModal.classList.add("active");
        setTimeout(() => customName.focus(), 100);
      }
    });
    productGrid.appendChild(customCard);

    // Add "Add New Product" Card (Admin style)
    const addProductCard = document.createElement("div");
    addProductCard.className = "product-card";
    addProductCard.style.border = "2px dashed #4e73df";
    addProductCard.style.display = "flex";
    addProductCard.style.flexDirection = "column";
    addProductCard.style.justifyContent = "center";
    addProductCard.style.alignItems = "center";
    addProductCard.style.background = "#f8f9fc";

    addProductCard.innerHTML = `
        <div style="font-size: 2rem; color: #4e73df; margin-bottom: 10px;">
            <i class="fas fa-plus"></i>
        </div>
        <div class="product-title" style="color: #4e73df;">Tambah Menu</div>
        <div class="product-meta" style="justify-content:center;">
            <span>Admin Only</span>
        </div>
    `;
    addProductCard.addEventListener("click", () => {
      // Reuse edit modal reset for clean state, but change logic to 'add'
      // For simplicity, we can reuse the Edit Modal as an "Add/Edit" modal
      // or create a new one. Let's create a new action state.
      state.isAddingNew = true;

      editName.value = "";
      editPrice.value = "";
      editDesc.value = "";
      editImgFile.value = "";

      // Change title temporarily
      document.querySelector("#edit-modal h3").innerText = "Tambah Menu Baru";

      editModal.classList.add("active");
      setTimeout(() => editName.focus(), 100);
    });
    productGrid.appendChild(addProductCard);
  };

  // Custom Modal Logic
  const customModal = document.getElementById("custom-modal");
  const cancelCustom = document.getElementById("cancel-custom");
  const confirmCustom = document.getElementById("confirm-custom");
  const custNameInput = document.getElementById("custom-name");
  const custPriceInput = document.getElementById("custom-price");

  if (cancelCustom) {
    cancelCustom.addEventListener("click", () => {
      if (customModal) customModal.classList.remove("active");
    });
  }

  if (confirmCustom) {
    confirmCustom.addEventListener("click", () => {
      const name = custNameInput.value.trim();
      let price = parseFloat(custPriceInput.value);
      if (!name) {
        alert("Nama menu harus diisi ya kak");
        return;
      }
      if (isNaN(price) || price < 0) price = 0; // Default if unknown

      // Add to cart directly
      state.cart.push({
        id: "custom-" + new Date().getTime(),
        name: name + " (Custom)",
        price: price,
        qty: 1,
        img: null, // No image
      });

      saveCart();
      showToast("Menu tambahan berhasil disimpan!");
      if (customModal) customModal.classList.remove("active");

      // Reset inputs
      custNameInput.value = "";
      custPriceInput.value = "";
    });
  }

  const openDetail = (product) => {
    state.currentProduct = product;
    state.currentQty = 1;

    detailImg.src = product.img;
    detailTitle.innerText = product.name;
    detailRating.innerText = product.rating;
    detailCals.innerText = product.cals;
    detailTime.innerText = product.time;
    detailDesc.innerText = product.desc;
    qtyVal.innerText = 1;
    updateTotalPrice();

    detailView.classList.add("active");
  };

  // Edit Product Logic
  const editModal = document.getElementById("edit-modal");
  const editBtn = document.getElementById("edit-product-btn");
  const editName = document.getElementById("edit-name");
  const editPrice = document.getElementById("edit-price");
  const editDesc = document.getElementById("edit-desc");
  const editImgFile = document.getElementById("edit-img-file"); // New input
  const saveEditBtn = document.getElementById("save-edit");
  const cancelEditBtn = document.getElementById("cancel-edit");

  if (editBtn) {
    editBtn.addEventListener("click", () => {
      if (!state.currentProduct) return;
      editName.value = state.currentProduct.name;
      editPrice.value = state.currentProduct.price;
      editDesc.value = state.currentProduct.desc || "";
      editImgFile.value = ""; // Reset file input
      editModal.classList.add("active");
      setTimeout(() => editName.focus(), 100);
    });
  }

  if (cancelEditBtn) {
    cancelEditBtn.addEventListener("click", () => {
      editModal.classList.remove("active");
    });
  }

  if (saveEditBtn) {
    saveEditBtn.addEventListener("click", () => {
      if (!state.currentProduct && !state.isAddingNew) return;

      const newName = editName.value.trim();
      let newPrice = parseFloat(editPrice.value);
      const newDesc = editDesc.value.trim();
      const file = editImgFile.files[0];

      if (!newName) {
        showToast("Nama produk harus diisi!");
        return;
      }
      if (isNaN(newPrice) || newPrice < 0) newPrice = 0;

      const saveProductData = (imgUrl) => {
        if (state.isAddingNew) {
          // Create New Product
          const newId =
            state.products.length > 0
              ? Math.max(...state.products.map((p) => p.id)) + 1
              : 1;
          const newProduct = {
            id: newId,
            name: newName,
            category: "all", // Default category
            price: newPrice,
            rating: 0, // Default
            time: "15min", // Default
            cals: "0 Kcal", // Default
            desc: newDesc || "Menu baru lezat!",
            img:
              imgUrl ||
              "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60", // Default placeholder
            ingredients: ["🍴"],
          };
          state.products.push(newProduct);
          state.isAddingNew = false;
          showToast("Menu baru berhasil ditambahkan!");
        } else {
          // Update Existing
          state.currentProduct.name = newName;
          state.currentProduct.price = newPrice;
          state.currentProduct.desc = newDesc;
          if (imgUrl) state.currentProduct.img = imgUrl;

          const idx = state.products.findIndex(
            (p) => p.id === state.currentProduct.id,
          );
          if (idx !== -1) {
            state.products[idx] = { ...state.currentProduct };
          }
          // Update UI Details
          detailTitle.innerText = newName;
          detailDesc.innerText = newDesc;
          if (imgUrl) detailImg.src = imgUrl;
          updateTotalPrice();
          showToast("Produk berhasil diupdate!");
        }

        renderProducts();
        saveProducts();
        editModal.classList.remove("active");

        // Reset Title
        document.querySelector("#edit-modal h3").innerText = "Edit Produk";
      };

      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          saveProductData(e.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        saveProductData(
          state.isAddingNew
            ? null
            : state.currentProduct
              ? state.currentProduct.img
              : null,
        );
      }
    });
  }

  const updateTotalPrice = () => {
    if (!state.currentProduct) return;
    const total = state.currentProduct.price * state.currentQty;
    detailPrice.innerText = formatRp(total);
  };

  // --- Event Listeners ---

  // Category Filter
  document.querySelectorAll(".category-pill").forEach((pill) => {
    pill.addEventListener("click", () => {
      document
        .querySelectorAll(".category-pill")
        .forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      renderProducts(pill.getAttribute("data-cat"));
    });
  });

  // Detail View Controls
  backBtn.addEventListener("click", () =>
    detailView.classList.remove("active"),
  );

  qtyMinus.addEventListener("click", () => {
    if (state.currentQty > 1) {
      state.currentQty--;
      qtyVal.innerText = state.currentQty;
      updateTotalPrice();
    }
  });

  qtyPlus.addEventListener("click", () => {
    state.currentQty++;
    qtyVal.innerText = state.currentQty;
    updateTotalPrice();
  });

  addToCartBtn.addEventListener("click", () => {
    if (!state.currentProduct) return;

    const existingItem = state.cart.find(
      (item) => item.id === state.currentProduct.id,
    );
    if (existingItem) {
      existingItem.qty += state.currentQty;
    } else {
      state.cart.push({
        ...state.currentProduct,
        qty: state.currentQty,
      });
    }

    saveCart();
    showToast("Berhasil masuk keranjang!");
    detailView.classList.remove("active");
  });

  // Cart / Checkout Logic
  const checkoutModal = document.getElementById("checkout-modal");
  const customerNameInput = document.getElementById("customer-name");
  const confirmCheckoutBtn = document.getElementById("confirm-checkout");
  const cancelCheckoutBtn = document.getElementById("cancel-checkout");
  const cartSummaryDiv = document.getElementById("cart-summary");
  const cartTotalDisplay = document.getElementById("cart-total-display");

  const renderCartSummary = () => {
    cartSummaryDiv.innerHTML = "";

    let total = 0;
    state.cart.forEach((item, index) => {
      const subtotal = item.price * item.qty;
      total += subtotal;
      const itemDiv = document.createElement("div");
      itemDiv.style.marginBottom = "8px";
      itemDiv.style.borderBottom = "1px solid #eee";
      itemDiv.style.paddingBottom = "8px";
      itemDiv.style.display = "flex";
      itemDiv.style.justifyContent = "space-between";
      itemDiv.style.alignItems = "center";

      itemDiv.innerHTML = `
            <div style="flex: 1; text-align: left;">
                ${item.name} <span style="font-weight:bold; color: #555;">x${item.qty}</span>
            </div>
            <div style="font-weight:600;">${formatRp(subtotal)}</div>
            <div class="cart-remove-btn" data-index="${index}" style="margin-left:12px; color:#ff4757; cursor:pointer; font-size: 1.2rem; line-height: 1;">&times;</div>
        `;
      cartSummaryDiv.appendChild(itemDiv);
    });

    cartTotalDisplay.innerText = `Total: ${formatRp(total)}`;

    // Attach listeners to new delete buttons
    document.querySelectorAll(".cart-remove-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const idx = parseInt(e.target.getAttribute("data-index"));
        state.cart.splice(idx, 1);
        saveCart();

        if (state.cart.length === 0) {
          checkoutModal.classList.remove("active");
          alert("Keranjang jadi kosong deh. Pilih menu lagi yuk!");
        } else {
          renderCartSummary(); // Re-render
        }
      });
    });
  };

  navCartBtn.addEventListener("click", () => {
    if (state.cart.length === 0) {
      showToast("Keranjang kosong kak!");
      return;
    }

    // Auto-fill name logic
    const savedName = localStorage.getItem("ngedoni_username");
    if (savedName) customerNameInput.value = savedName;

    renderCartSummary();
    checkoutModal.classList.add("active");
    setTimeout(() => customerNameInput.focus(), 100);
  });

  cancelCheckoutBtn.addEventListener("click", () => {
    checkoutModal.classList.remove("active");
  });

  confirmCheckoutBtn.addEventListener("click", () => {
    const name = customerNameInput.value.trim();
    if (!name) {
      showToast("Nama jangan kosong ya kak :)");
      return;
    }

    // Save name for next time
    localStorage.setItem("ngedoni_username", name);

    // Generate WhatsApp Message matching perintah.md
    let message = `Halo min, saya sudah selesai order.\n\n👤 *Nama:* ${name}\n\n📋 *Detail Orderan:*\n`;
    let total = 0;

    state.cart.forEach((item, index) => {
      const subtotal = item.price * item.qty;
      total += subtotal;
      message += `${index + 1}. ${item.name} (${item.qty}x) - ${formatRp(subtotal)}\n`;
    });

    message += `\n💰 *Total: ${formatRp(total)}*`;

    const phoneNumber = "6289637931794";
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    // Open WhatsApp
    window.open(url, "_blank");

    // Close modal
    checkoutModal.classList.remove("active");

    // Optional: Clear cart after ordering?
    // state.cart = [];
    // saveCart();
  });

  // Search Functionality
  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase();
      const filtered = state.products.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query),
      );

      // Re-use render logic but with custom list
      productGrid.innerHTML = "";
      filtered.forEach((product) => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
                    <i class="far fa-heart fav-icon"></i>
                    <div class="product-img-container">
                        <img src="${product.img}" alt="${product.name}">
                    </div>
                    <div class="product-title">${product.name}</div>
                    <div class="product-meta">
                        <span>${product.time}</span>
                        <span><i class="fas fa-star" style="color:#ffcc00"></i> ${product.rating}</span>
                    </div>
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                    <div class="add-btn-small">+</div>
                `;
        card.addEventListener("click", () => openDetail(product));
        productGrid.appendChild(card);
      });
    });
  }

  // --- Init ---
  renderProducts();
  updateCartBadge();

  // Service Worker
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").then(
        (registration) => console.log("SW Registered"),
        (err) => console.log("SW Failed", err),
      );
    });
  }
});
