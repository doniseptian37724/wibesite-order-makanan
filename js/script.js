document.addEventListener('DOMContentLoaded', () => {
    console.log("Anti Gravity Task Manager Loaded");

    // --- History Logic ---
    const getStorageKey = () => 'anti_gravity_orders';

    const saveOrder = (order) => {
        const existing = JSON.parse(localStorage.getItem(getStorageKey()) || '[]');
        existing.push(order);
        localStorage.setItem(getStorageKey(), JSON.stringify(existing));
    };

    const getOrdersByDate = (dateStringElement) => {
        // Simple date matching. 
        // We'll store formatted dates or timestamps. Let's rely on the date-item structure.
        // For simplicity, we assume the user is clicking on dates that are generated relative to 'today'.
        // But to be robust, let's just use the day number for this demo as the ID.
        const allOrders = JSON.parse(localStorage.getItem(getStorageKey()) || '[]');
        return allOrders.filter(o => o.dateKey === dateStringElement);
    };

    // To track state
    let currentSelectedDateKey = "";
    let historyViewMode = 'daily'; // 'daily' or 'all'
    let searchQuery = ""; // New state for search

    // Sound Effect
    const successSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-software-interface-start-2574.mp3'); // Base URL example
    // Alternative simple beep if offline/blocked:
    // const playSound = () => successSound.play().catch(e => console.log("Sound blocked"));

    // --- Toast Notification ---
    const showToast = (msg, type = 'success') => {
        const toastBox = document.getElementById('toast-box');
        let icon = type === 'success' ? '<i class="fas fa-check-circle"></i>' : '<i class="fas fa-exclamation-circle"></i>';

        if (type === 'error') {
            toastBox.classList.add('error');
        } else {
            toastBox.classList.remove('error');
        }

        toastBox.innerHTML = `${icon} <span>${msg}</span>`;
        toastBox.classList.add('show');

        setTimeout(() => {
            toastBox.classList.remove('show');
        }, 3000);
    };

    // --- Delete Order Logic ---
    const deleteOrder = (timestamp) => {
        if (!confirm('Hapus riwayat ini?')) return;

        let allOrders = JSON.parse(localStorage.getItem(getStorageKey()) || '[]');
        allOrders = allOrders.filter(o => o.timestamp !== parseInt(timestamp)); // Ensure type match
        localStorage.setItem(getStorageKey(), JSON.stringify(allOrders));
        renderHistory();
        showToast("Riwayat dihapus!", "error");
    };

    const renderHistory = () => {
        const historyList = document.getElementById('history-list');
        const historyLabel = document.getElementById('history-date-label');

        if (!historyList) return;

        // If no key selected yet (first load), use today
        if (!currentSelectedDateKey) {
            const now = new Date();
            const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            currentSelectedDateKey = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
        }

        // Toggle Visuals
        document.getElementById('view-daily').classList.toggle('active', historyViewMode === 'daily');
        document.getElementById('view-all').classList.toggle('active', historyViewMode === 'all');

        let orders = [];
        const allOrders = JSON.parse(localStorage.getItem(getStorageKey()) || '[]');

        if (historyViewMode === 'daily') {
            if (historyLabel) historyLabel.innerHTML = `${currentSelectedDateKey} <div id="total-price" class="total-price-display">Rp 0</div>`;
            orders = allOrders.filter(o => o.dateKey === currentSelectedDateKey);
        } else {
            if (historyLabel) historyLabel.innerHTML = `(Semua Waktu) <div id="total-price" class="total-price-display">Rp 0</div>`;
            orders = allOrders.sort((a, b) => b.timestamp - a.timestamp); // Newest first
        }

        // Apply Search Filter
        if (searchQuery) {
            orders = orders.filter(o =>
                o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                o.item.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        historyList.innerHTML = '';

        if (orders.length === 0) {
            historyList.innerHTML = '<div class="empty-state">Tidak ditemukan.</div>';
            return;
        }

        let totalPrice = 0;

        orders.forEach(order => {
            const item = document.createElement('div');
            item.className = `history-item ${order.isDone ? 'done' : ''}`;

            // Format Price
            const price = order.price ? parseInt(order.price) : 0;
            totalPrice += price;
            const priceText = price > 0 ? `Rp ${price.toLocaleString('id-ID')}` : '';

            // Show date in 'All' mode
            const dateBadge = historyViewMode === 'all' ? `<span style="font-size:0.6rem; background:rgba(0,0,0,0.1); padding:2px 5px; border-radius:4px; margin-right:5px;">${order.dateKey.split(' ').slice(0, 2).join(' ')}</span>` : '';

            item.innerHTML = `
                <div class="history-item-top">
                    <span style="display:flex; align-items:center;">
                        ${dateBadge}${order.name}
                        ${priceText ? `<span class="price-tag">${priceText}</span>` : ''}
                        <i class="fas fa-trash delete-btn" data-id="${order.timestamp}"></i>
                    </span>
                    <span class="time-stamp">${order.time}</span>
                </div>
                <div class="item-desc">${order.item}</div>
            `;

            // Toggle Done State logic
            item.addEventListener('click', (e) => {
                // Don't toggle if clicking delete button
                if (e.target.classList.contains('delete-btn')) return;

                // Toggle state
                order.isDone = !order.isDone;

                // Save back
                const allOrders = JSON.parse(localStorage.getItem(getStorageKey()) || '[]');
                const index = allOrders.findIndex(o => o.timestamp === order.timestamp);
                if (index !== -1) {
                    allOrders[index].isDone = order.isDone;
                    localStorage.setItem(getStorageKey(), JSON.stringify(allOrders));
                    renderHistory(); // Re-render to update UI
                }
            });

            historyList.appendChild(item);
        });

        // Update Total Price Display
        const totalDisplay = document.getElementById('total-price');
        if (totalDisplay) {
            totalDisplay.textContent = `Total: Rp ${totalPrice.toLocaleString('id-ID')}`;
        }

        // Add Event Listeners for Delete Buttons
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent bubbling if needed
                const id = e.target.getAttribute('data-id');
                deleteOrder(id);
            });
        });
    };

    // --- Search Logic ---
    const searchInput = document.getElementById('search-input');
    const suggestionsBox = document.getElementById('search-suggestions');

    if (searchInput) {
        // Hide suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (suggestionsBox && !searchInput.contains(e.target) && !suggestionsBox.contains(e.target)) {
                suggestionsBox.style.display = 'none';
            }
        });

        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.trim();
            renderHistory();

            // Suggestion Logic
            if (searchQuery.length > 0) {
                const allOrders = JSON.parse(localStorage.getItem(getStorageKey()) || '[]');

                // Collect unique matching names and items
                const suggestions = new Set();
                const lowerQuery = searchQuery.toLowerCase();

                allOrders.forEach(o => {
                    if (o.name.toLowerCase().includes(lowerQuery)) suggestions.add(o.name);
                    if (o.item.toLowerCase().includes(lowerQuery)) suggestions.add(o.item);
                });

                // Render Suggestions
                if (suggestions.size > 0 && suggestionsBox) {
                    suggestionsBox.innerHTML = '';
                    const list = Array.from(suggestions).slice(0, 5); // Limit to top 5

                    list.forEach(text => {
                        const div = document.createElement('div');
                        div.className = 'suggestion-item';
                        div.textContent = text;
                        div.addEventListener('click', () => {
                            searchInput.value = text;
                            searchQuery = text;
                            suggestionsBox.style.display = 'none';
                            renderHistory();
                        });
                        suggestionsBox.appendChild(div);
                    });
                    suggestionsBox.style.display = 'block';
                } else {
                    if (suggestionsBox) suggestionsBox.style.display = 'none';
                }
            } else {
                if (suggestionsBox) suggestionsBox.style.display = 'none';
            }
        });
    }

    // --- History Toggles ---
    const btnDaily = document.getElementById('view-daily');
    const btnAll = document.getElementById('view-all');

    if (btnDaily) {
        btnDaily.addEventListener('click', () => {
            historyViewMode = 'daily';
            renderHistory();
        });
    }

    if (btnAll) {
        btnAll.addEventListener('click', () => {
            historyViewMode = 'all';
            renderHistory();
        });
    }

    // --- Image Upload Logic ---
    const taskImageInput = document.getElementById('task-image');
    const uploadBtnTrigger = document.getElementById('upload-btn-trigger');
    const imagePreviewContainer = document.getElementById('image-preview');
    const previewImg = document.getElementById('preview-img');
    const removeImageBtn = document.getElementById('remove-image');
    let isImageSelected = false;

    if (uploadBtnTrigger && taskImageInput) {
        uploadBtnTrigger.addEventListener('click', () => {
            taskImageInput.click();
        });

        taskImageInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    previewImg.src = e.target.result;
                    imagePreviewContainer.style.display = 'block';
                    uploadBtnTrigger.style.display = 'none';
                    isImageSelected = true;
                };
                reader.readAsDataURL(e.target.files[0]);
            }
        });
    }

    if (removeImageBtn) {
        removeImageBtn.addEventListener('click', () => {
            taskImageInput.value = '';
            imagePreviewContainer.style.display = 'none';
            uploadBtnTrigger.style.display = 'flex';
            isImageSelected = false;
        });
    }

    // --- Interaction for "Cursor/Send" Icon in Bottom Nav ---
    const sendIcon = document.querySelector('.fa-paper-plane');
    const taskNameInput = document.getElementById('task-name');
    const taskPriceInput = document.getElementById('task-price');
    const categoryInput = document.getElementById('task-category');
    const startTimeInput = document.getElementById('start-time');
    const endTimeInput = document.getElementById('end-time');

    const submitOrder = () => {
        // Gather data
        const task = taskNameInput.value;
        const price = taskPriceInput ? taskPriceInput.value : 0;
        const category = categoryInput.value;
        const start = startTimeInput.value;
        const end = endTimeInput.value;

        if (!task || !category) {
            showToast("Mohon isi nama dan pesanan.", "error");
            return;
        }

        // Save Local History
        const orderData = {
            dateKey: currentSelectedDateKey, // Save to currently selected day
            name: task,
            item: category,
            time: `${start} - ${end}`,
            timestamp: new Date().getTime(),
            hasImage: isImageSelected
        };
        saveOrder(orderData);
        renderHistory(); // Refresh UI immediately

        // KEMBALI KE OPTION 1: Buka WhatsApp Asli
        // Agar pesan benar-benar terkirim ke Admin.

        // Number: 089637931794 (Admin Toko)
        const phoneNumber = '6289637931794';

        // Cek Image
        let imageNote = "";
        if (isImageSelected) {
            imageNote = `\n📸 *FOTO:* [Saya melampirkan foto - Silakan cek manual]`;
        }

        // Format Pesan Lebih Rapi
        const message = `*PESANAN BARU VIA NGEDONI* 🚀\n\n` +
            `👤 *Nama:* ${task}\n` +
            `🛍️ *Item:* ${category}\n` +
            `📅 *Tanggal:* ${currentSelectedDateKey}\n` +
            `⏰ *Waktu:* ${start} - ${end}` +
            imageNote + `\n\n` +
            `Mohon diproses ya, terima kasih! 🙏`;

        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

        // Open WhatsApp di Tab Baru
        window.open(whatsappUrl, '_blank');

        // Optional: Clear inputs after send
        categoryInput.value = '';
        if (taskPriceInput) taskPriceInput.value = ''; // Clear price
        if (removeImageBtn) removeImageBtn.click(); // Reset image
    };

    if (sendIcon) {
        sendIcon.addEventListener('click', submitOrder);
    }

    // Add Enter key listener to inputs
    const handleEnterKey = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent default form submission
            submitOrder();
        }
    };

    if (taskNameInput) taskNameInput.addEventListener('keydown', handleEnterKey);
    if (categoryInput) categoryInput.addEventListener('keydown', handleEnterKey);


    // Initialize Date Key on Load
    const now = new Date();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    currentSelectedDateKey = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
    renderHistory(); // Initial render


    // --- Dynamic Date & Time Logic ---
    const updateDateTime = () => {
        const now = new Date();
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        // 1. Update Month Label
        const monthLabel = document.querySelector('.month-label');
        if (monthLabel) {
            monthLabel.textContent = `${months[now.getMonth()]} ${now.getFullYear()}`;
        }

        // 2. Update Calendar Strip (Show today + next 4 days)
        const dateSelector = document.querySelector('.date-selector');
        if (dateSelector) {
            dateSelector.innerHTML = ''; // Clear default
            for (let i = 0; i < 5; i++) {
                const date = new Date();
                date.setDate(now.getDate() + i);

                const isToday = i === 0;
                const div = document.createElement('div');
                div.className = `date-item ${isToday ? 'active' : ''}`;
                div.innerHTML = `<span>${date.getDate()}</span><span>${days[date.getDay()]}</span>`;

                // Add click event for visual selection & history
                div.addEventListener('click', () => {
                    document.querySelectorAll('.date-item').forEach(d => d.classList.remove('active'));
                    div.classList.add('active');

                    // Update key
                    currentSelectedDateKey = `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;

                    // Render history for this date
                    renderHistory();

                    // Optional: Update form date label visual
                    const formDateDisplay = document.querySelector('.date-input-row span');
                    if (formDateDisplay) {
                        const day = date.getDate();
                        const suffix = (day > 3 && day < 21) ? 'th' : ['th', 'st', 'nd', 'rd'][day % 10] || 'th';
                        formDateDisplay.textContent = `${day} ${suffix} ${months[date.getMonth()]} ${date.getFullYear()}`;
                    }
                });

                dateSelector.appendChild(div);
            }
        }

        // 3. Update Form Date Display
        const formDateDisplay = document.querySelector('.date-input-row span');
        if (formDateDisplay) {
            // Format: "29 th January 2026"
            const day = now.getDate();
            const suffix = (day > 3 && day < 21) ? 'th' : ['th', 'st', 'nd', 'rd'][day % 10] || 'th';
            formDateDisplay.textContent = `${day} ${suffix} ${months[now.getMonth()]} ${now.getFullYear()}`;
        }

        // 4. Update Time Inputs
        const formatTime = (date) => {
            let hours = date.getHours();
            const minutes = date.getMinutes();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            const strMinutes = minutes < 10 ? '0' + minutes : minutes;
            return `${hours}:${strMinutes} ${ampm}`;
        };

        const startTimeInput = document.getElementById('start-time');
        const endTimeInput = document.getElementById('end-time');

        if (startTimeInput) startTimeInput.value = formatTime(now);

        if (endTimeInput) {
            const nextHour = new Date(now.getTime() + 60 * 60 * 1000);
            endTimeInput.value = formatTime(nextHour);
        }
    };

    updateDateTime();

    // --- Dark Mode Toggle ---
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const icon = themeToggle ? themeToggle.querySelector('i') : null;

    // Check saved theme
    if (localStorage.getItem('ngedoni_theme') === 'dark') {
        body.classList.add('dark-mode');
        if (icon) icon.className = 'fas fa-sun';
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            const isDark = body.classList.contains('dark-mode');
            localStorage.setItem('ngedoni_theme', isDark ? 'dark' : 'light');
            if (icon) icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
        });
    }
});

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(registration => {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            }, err => {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}


// --- Comments/Chat Feature ---
const commentBtn = document.querySelector('.fa-comment');
const commentsModal = document.getElementById('comments-modal');
const closeComments = document.getElementById('close-comments');
const commentsList = document.getElementById('comments-list');
const commentInput = document.getElementById('comment-input');
const sendCommentBtn = document.getElementById('send-comment');

const getCommentsKey = () => 'ngedoni_comments';

// Dummy Names for 'Others' (Simulated)
const randomNames = ["Admin", "Sales", "Budi", "Siti"];

const renderComments = () => {
    const comments = JSON.parse(localStorage.getItem(getCommentsKey()) || '[]');
    commentsList.innerHTML = '';

    if (comments.length === 0) {
        commentsList.innerHTML = '<div class="empty-state">Belum ada komentar. Yuk mulai ngobrol!</div>';
        return;
    }

    comments.forEach(c => {
        const div = document.createElement('div');
        div.className = `comment-bubble ${c.isMe ? 'my-comment' : ''}`;

        div.innerHTML = `
            <div class="comment-name">${c.name}</div>
            <div class="comment-text">${c.text}</div>
            <div class="comment-time">${c.time}</div>
        `;
        commentsList.appendChild(div);
    });

    // Scroll to bottom
    commentsList.scrollTop = commentsList.scrollHeight;
};

const addComment = (text, isMe = true) => {
    const comments = JSON.parse(localStorage.getItem(getCommentsKey()) || '[]');
    const now = new Date();
    const timeString = `${now.getHours()}:${now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes()}`;

    const newComment = {
        name: isMe ? "Saya" : randomNames[Math.floor(Math.random() * randomNames.length)],
        text: text,
        time: timeString,
        isMe: isMe
    };

    comments.push(newComment);
    localStorage.setItem(getCommentsKey(), JSON.stringify(comments));
    renderComments();
};

if (commentBtn) {
    commentBtn.addEventListener('click', () => {
        commentsModal.style.display = 'flex';
        renderComments();
    });
}

if (closeComments) {
    closeComments.addEventListener('click', () => {
        commentsModal.style.display = 'none';
    });
}

// Close on outside click
window.addEventListener('click', (e) => {
    if (e.target === commentsModal) {
        commentsModal.style.display = 'none';
    }
});

const handleSend = () => {
    const text = commentInput.value.trim();
    if (text) {
        addComment(text, true);
        commentInput.value = '';

        // Simulate Reply after 2 seconds (Just for fun demo)
        setTimeout(() => {
            const replies = ["Oke siap!", "Barang sudah ready?", "Jangan lupa struknya ya.", "Mantap!"];
            addComment(replies[Math.floor(Math.random() * replies.length)], false);
        }, 2000);
    }
};

if (sendCommentBtn) {
    sendCommentBtn.addEventListener('click', handleSend);
}

if (commentInput) {
    commentInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });
}
