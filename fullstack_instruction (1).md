# Anti Gravity App – Fullstack Technical Prompt

## Overview

Bangun aplikasi fullstack bernama **Anti Gravity** dengan arsitektur terpisah antara **frontend** dan **backend**.  
Aplikasi berjalan sebagai **mobile-friendly web app** dan **Progressive Web App (PWA)**, menggunakan **backend REST API berbasis Express.js** dan **database PostgreSQL**.

Fokus utama:

- Clean architecture
- Scalable
- Maintainable
- Production-ready

---

## Project Structure

Pisahkan frontend dan backend ke dalam folder terpisah.

anti-gravity/
│
├── backend/
│ ├── src/
│ │ ├── app.js
│ │ ├── server.js
│ │ ├── routes/
│ │ ├── controllers/
│ │ ├── services/
│ │ ├── middlewares/
│ │ ├── schemas/ # JSON Schema validation
│ │ ├── config/
│ │ └── utils/
│ │
│ ├── migrations/ or prisma/
│ ├── postman/
│ │ └── anti-gravity.postman_collection.json
│ ├── .env.example
│ └── package.json
│
├── frontend/
│ ├── public/
│ ├── src/
│ ├── pwa/
│ ├── .env.example
│ └── package.json
│
└── README.md

---

## Backend

- **Node.js + Express.js**
- REST API
- Modular architecture
- Centralized error handling
- Environment-based configuration

### REST API

- Base path: `/api/v1`
- JSON request & response
- Proper HTTP status codes
- Consistent response format

### Example Endpoints

POST /api/v1/auth/google
GET /api/v1/users/me
PUT /api/v1/users/me

---

## Validation

- Gunakan **JSON Schema** untuk validasi request
- Validasi dilakukan via middleware
- Validasi mencakup:
  - body
  - params
  - query
- Error response harus konsisten dan informatif

### Example JSON Schema

```json
{
  "type": "object",
  "required": ["email", "name"],
  "properties": {
    "email": {
      "type": "string",
      "format": "email"
    },
    "name": {
      "type": "string",
      "minLength": 2
    }
  }
}
```

## Authentication

- **Google OAuth 2.0**
  - Google Sign-In button di frontend
  - Backend endpoint untuk verifikasi Google token
- **JWT-based authentication**
  - Middleware auth untuk protected routes

## Database

- **PostgreSQL**
- **ORM**: Prisma / Sequelize / TypeORM
- Relational schema
- Migration & seeding support

## Frontend

- **Responsive Design** (mobile-first)
- **PWA Ready**:
  - Web App Manifest
  - Service Worker
  - Offline support
- **Features**:
  - Google Sign-In button aktif
  - Konsumsi REST API backend
  - Loading & error state handling

## Postman Collection

Sertakan Postman collection di folder berikut: `backend/postman/anti-gravity.postman_collection.json`

Postman collection harus mencakup:

- Google authentication
- User endpoints
- Environment variables
- Example request & response

## Security & Performance

- CORS configuration
- Helmet
- Rate limiting
- Input sanitization
- Secure JWT handling
- Optimized API response

## Output Expectation

1. **Backend**: Express.js REST API siap produksi
2. **Validation**: Menggunakan JSON Schema
3. **Frontend**: PWA yang responsif & mobile-ready
4. **Deliverables**:
   - Postman collection lengkap
   - Dokumentasi setup & deployment

## Goal

Membangun aplikasi **Anti Gravity** dengan arsitektur modern, scalable, aman, dan siap dikembangkan menjadi produk nyata.
