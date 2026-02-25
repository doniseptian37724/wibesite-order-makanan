const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");
const config = require("./config/env");
const routes = require("./routes");
const { errorHandler, notFoundHandler } = require("./middlewares/errorHandler");

const app = express();

// Security
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false,
  }),
);

// CORS - allow all origins
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
  }),
);

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  message: {
    success: false,
    message: "Terlalu banyak request. Coba lagi dalam 15 menit.",
  },
});
app.use("/api/", limiter);

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files - SAME PORT as backend
// Coba deteksi folder frontend di beberapa lokasi (lokal vs server)
let frontendPath = path.resolve(__dirname, "../../frontend/public");
if (!require("fs").existsSync(path.join(frontendPath, "index.html"))) {
  // Jika tidak ketemu, coba jalur alternatif untuk Railway environment
  frontendPath = path.resolve(process.cwd(), "anti-gravity/frontend/public");
}

app.use(express.static(frontendPath));

// API Routes
app.use("/api/v1", routes);

// Catch-all: serve index.html for any non-API route
app.get("*", (req, res) => {
  if (!req.path.startsWith("/api")) {
    const indexPath = path.join(frontendPath, "index.html");
    res.sendFile(indexPath);
  }
});

// Error handler
app.use(errorHandler);

module.exports = app;
