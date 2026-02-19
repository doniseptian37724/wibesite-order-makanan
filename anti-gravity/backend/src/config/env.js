require("dotenv").config();

module.exports = {
  port: parseInt(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  jwtSecret: process.env.JWT_SECRET || "default-secret-change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  googleClientId: process.env.GOOGLE_CLIENT_ID || "",
  whatsappAdminNumber: process.env.WHATSAPP_ADMIN_NUMBER || "6281234567890",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5500",
};
