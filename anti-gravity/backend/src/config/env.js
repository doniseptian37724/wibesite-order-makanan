const path = require("path");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: path.join(__dirname, "../../.env") });
}

module.exports = {
  port: parseInt(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  jwtSecret: process.env.JWT_SECRET || "default-secret-change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  googleClientId: process.env.GOOGLE_CLIENT_ID || "",
  whatsappAdminNumber: process.env.WHATSAPP_ADMIN_NUMBER || "",
  waApiKey: process.env.WA_API_KEY || "",
  whatsappGroupId: process.env.WHATSAPP_GROUP_ID || "",
  corsOrigin: process.env.CORS_ORIGIN || "*",
};
