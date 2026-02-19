const express = require("express");
const router = express.Router();
const menuController = require("../controllers/menuController");
const validate = require("../middlewares/validate");
const { authenticate } = require("../middlewares/auth");
const { createMenuSchema, updateMenuSchema } = require("../schemas/menuSchema");

// Public routes
router.get("/", menuController.getAll);
router.get("/categories", menuController.getCategories);
router.get("/:id", menuController.getById);

// Admin routes (authenticated)
router.post(
  "/",
  authenticate,
  validate(createMenuSchema),
  menuController.create,
);
router.put(
  "/:id",
  authenticate,
  validate(updateMenuSchema),
  menuController.update,
);
router.delete("/:id", authenticate, menuController.delete);

module.exports = router;
