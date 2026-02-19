# Anti Gravity - Aplikasi Order Makanan

## 🚀 Overview

**Anti Gravity** adalah aplikasi fullstack order makanan yang menggabungkan **microsite** dan **WhatsApp** untuk pengalaman ordering yang sederhana dan efisien.

### User Flow

1. 💬 User chat via WhatsApp: "Halo min, mau order"
2. 🔗 Admin kirim link microsite
3. 🍔 User pilih menu makanan di microsite, pilih jumlah porsi
4. 💰 Harga di-set oleh admin microsite
5. 📲 Setelah order, user diarahkan ke WhatsApp dengan detail pesanan
6. 📋 Admin forward pesanan ke merchant
7. 🛵 Admin pickup pesanan ke merchant

---

## 🏗️ Tech Stack

| Layer           | Technology                       |
| --------------- | -------------------------------- |
| **Frontend**    | HTML5, CSS3, Vanilla JS, PWA     |
| **Backend**     | Node.js, Express.js              |
| **Database**    | PostgreSQL                       |
| **Integration** | WhatsApp Web API                 |
| **Validation**  | JSON Schema (AJV)                |
| **Security**    | Helmet, CORS, Rate Limiting, JWT |

---

## 📁 Project Structure

```
anti-gravity/
├── backend/
│   ├── src/
│   │   ├── app.js              # Express app setup
│   │   ├── server.js           # Server entry point
│   │   ├── routes/             # API route definitions
│   │   ├── controllers/        # Request handlers
│   │   ├── services/           # Business logic
│   │   ├── middlewares/        # Auth, validation, error handling
│   │   ├── schemas/            # JSON Schema validation
│   │   ├── config/             # Database & env config
│   │   └── utils/              # Helper utilities
│   ├── migrations/
│   │   ├── DDL.sql             # Database schema
│   │   ├── DML.sql             # Seed data
│   │   └── run.js              # Migration runner
│   ├── postman/                # Postman collection
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   ├── index.html          # Main HTML
│   │   ├── styles.css          # Styling
│   │   ├── app.js              # App logic
│   │   ├── manifest.json       # PWA manifest
│   │   └── sw.js               # Service Worker
│   └── pwa/
│
└── README.md
```

---

## 🚀 Setup & Installation

### Prerequisites

- Node.js >= 18.x
- PostgreSQL 14+
- npm or yarn

### 1. Clone Repository

```bash
git clone https://github.com/your-username/anti-gravity.git
cd anti-gravity
```

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your database credentials
npm install
```

### 3. Database Setup

```bash
# Run migrations
npm run migrate
```

### 4. Start Backend Server

```bash
# Development
npm run dev

# Production
npm start
```

### 5. Frontend

Frontend bisa diakses langsung via backend server (served as static files) atau dibuka secara terpisah menggunakan Live Server / HTTP server.

```bash
cd frontend/public
# Bisa menggunakan Live Server extension di VS Code
# Atau menggunakan npx serve
npx serve .
```

---

## 📡 API Endpoints

### Base URL

```
http://localhost:3000/api/v1
```

### Health Check

| Method | Endpoint  | Description      |
| ------ | --------- | ---------------- |
| GET    | `/health` | API health check |

### Menu

| Method | Endpoint            | Auth | Description              |
| ------ | ------------------- | ---- | ------------------------ |
| GET    | `/menus`            | -    | Get all menus            |
| GET    | `/menus/categories` | -    | Get menu categories      |
| GET    | `/menus/:id`        | -    | Get menu by ID           |
| POST   | `/menus`            | ✅   | Create menu (admin)      |
| PUT    | `/menus/:id`        | ✅   | Update menu (admin)      |
| DELETE | `/menus/:id`        | ✅   | Soft delete menu (admin) |

### Orders

| Method | Endpoint             | Auth | Description                 |
| ------ | -------------------- | ---- | --------------------------- |
| POST   | `/orders`            | -    | Create order (customer)     |
| GET    | `/orders/code/:code` | -    | Get order by code           |
| GET    | `/orders`            | ✅   | Get all orders (admin)      |
| GET    | `/orders/:id`        | ✅   | Get order by ID (admin)     |
| PATCH  | `/orders/:id/status` | ✅   | Update order status (admin) |

---

## 🗄️ Database Convention

| Convention            | Format                | Example                       |
| --------------------- | --------------------- | ----------------------------- |
| **Master Table**      | `{modul}_mst_{fitur}` | `food_mst_menu`               |
| **Transaction Table** | `{modul}_trx_{fitur}` | `food_trx_order`              |
| **Log Table**         | `{modul}_log_{fitur}` | `food_log_order`              |
| **Column**            | `{fitur}_{jenis}`     | `menu_name`, `order_status`   |
| **Primary Key**       | UUID                  | `menu_id UUID`                |
| **Foreign Key**       | UUID                  | `order_id UUID REFERENCES...` |

---

## 🔐 Database Connection

```
Host: 10.20.0.7
Port: 25432
Database: anti_gravity
Username: mkt
Password: JRAEm66Ytw9H4HX9xoDV
```

---

## 📱 PWA Features

- ✅ Web App Manifest
- ✅ Service Worker with caching
- ✅ Offline support
- ✅ Add to Home Screen
- ✅ Mobile-first responsive design

---

## 🎨 Frontend Features

- ✅ Dark / Light theme toggle
- ✅ Menu search with debounce
- ✅ Category filtering
- ✅ Cart with localStorage persistence
- ✅ Smooth animations & transitions
- ✅ Bottom sheet cart
- ✅ Checkout with WhatsApp integration
- ✅ Toast notifications
- ✅ Responsive (mobile-first)
- ✅ Premium glassmorphism design

---

## 📮 Postman Collection

Import from: `backend/postman/anti-gravity.postman_collection.json`

---

## 📝 License

MIT © Anti Gravity Team
