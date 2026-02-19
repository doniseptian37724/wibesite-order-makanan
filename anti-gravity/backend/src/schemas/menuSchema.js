/**
 * JSON Schemas for Menu validation
 */
const createMenuSchema = {
  type: "object",
  required: ["menu_name", "menu_price", "menu_category"],
  properties: {
    menu_name: { type: "string", minLength: 2, maxLength: 100 },
    menu_price: { type: "number", minimum: 0 },
    menu_category: { type: "string", minLength: 2, maxLength: 50 },
    menu_description: { type: "string", maxLength: 500 },
    menu_image_url: { type: "string", format: "uri" },
    menu_is_available: { type: "boolean" },
  },
};

const updateMenuSchema = {
  type: "object",
  properties: {
    menu_name: { type: "string", minLength: 2, maxLength: 100 },
    menu_price: { type: "number", minimum: 0 },
    menu_category: { type: "string", minLength: 2, maxLength: 50 },
    menu_description: { type: "string", maxLength: 500 },
    menu_image_url: { type: "string", format: "uri" },
    menu_is_available: { type: "boolean" },
  },
  minProperties: 1,
};

module.exports = { createMenuSchema, updateMenuSchema };
