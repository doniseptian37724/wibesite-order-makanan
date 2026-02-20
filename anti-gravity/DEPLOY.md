# Anti Gravity - Deployment Configuration

## Deploy ke Railway

### Environment Variables yang harus diset di Railway Dashboard:

```
NODE_ENV=production
PORT=3000

# Database (Wajib untuk mode Live - isi jika sudah ada DB di server)
DB_HOST=10.20.0.7
DB_PORT=25432
DB_NAME=anti_gravity
DB_USER=mkt
DB_PASS=JRAEm66Ytw9H4HX9xoDV

# WhatsApp (Wajib)
WHATSAPP_ADMIN_NUMBER=6289637931794
WA_API_KEY=LDM4it5XJ2TexaEZPv9z
WHATSAPP_GROUP_ID=120363423982243396@g.us

# JWT
JWT_SECRET=anti-gravity-jwt-secret-2026

# CORS
CORS_ORIGIN=*
```

### Catatan:

- Jika DB tidak bisa diakses dari Railway (DB ada di jaringan kantor internal), app akan otomatis berjalan dalam **Mode Demo**
- Mode Demo: menu tampil, order bisa dibuat, notif WA dikirim - tapi data tidak disimpan permanen
- Untuk database permanen di Railway: gunakan PostgreSQL plugin dari Railway
