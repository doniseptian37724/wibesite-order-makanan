/**
 * JSON Schemas for Order validation
 */
const createOrderSchema = {
  type: "object",
  required: ["order_customer_name", "order_customer_phone", "items"],
  properties: {
    order_customer_name: { type: "string", minLength: 2, maxLength: 100 },
    order_customer_phone: { type: "string", minLength: 8, maxLength: 20 },
    order_notes: { type: "string", maxLength: 500 },
    order_total_amount: { type: "number", minimum: 0 },
    items: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        required: ["menu_id", "quantity"],
        properties: {
          menu_id: { type: "string", minLength: 1 }, // Accepts both UUIDs and demo IDs
          quantity: { type: "integer", minimum: 1 },
          menu_name: { type: "string" },
          menu_price: { type: "number" },
          item_notes: { type: "string", maxLength: 200 },
          notes: { type: "string", maxLength: 200 },
        },
      },
    },
  },
};

const updateOrderStatusSchema = {
  type: "object",
  required: ["order_status"],
  properties: {
    order_status: {
      type: "string",
      enum: [
        "pending",
        "confirmed",
        "preparing",
        "ready",
        "picked_up",
        "delivered",
        "cancelled",
      ],
    },
  },
};

module.exports = { createOrderSchema, updateOrderStatusSchema };
