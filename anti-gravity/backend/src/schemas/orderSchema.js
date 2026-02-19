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
    items: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        required: ["menu_id", "quantity"],
        properties: {
          menu_id: { type: "string", format: "uuid" },
          quantity: { type: "integer", minimum: 1 },
          item_notes: { type: "string", maxLength: 200 },
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
