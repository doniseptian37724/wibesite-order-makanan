const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");

// Public
router.get("/phone/:phone", customerController.getByPhone);

// Admin only (future: add auth middleware)
router.get("/", customerController.getAll);

module.exports = router;
