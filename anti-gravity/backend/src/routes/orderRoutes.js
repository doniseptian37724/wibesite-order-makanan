const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const validate = require("../middlewares/validate");
const { authenticate, optionalAuth } = require("../middlewares/auth");
const {
  createOrderSchema,
  updateOrderStatusSchema,
} = require("../schemas/orderSchema");

// Public routes (customer creates order)
router.post("/", validate(createOrderSchema), orderController.create);
router.get("/code/:code", orderController.getByCode);

// Admin routes
router.get("/", authenticate, orderController.getAll);
router.get("/:id", authenticate, orderController.getById);
router.patch(
  "/:id/status",
  authenticate,
  validate(updateOrderStatusSchema),
  orderController.updateStatus,
);

module.exports = router;
