const pool = require("../config/database");
const demo = require("../utils/demoData");
const { v4: uuidv4 } = require("uuid");

class MenuService {
  /**
   * Get all available menus
   */
  async getAll(category = null, includeHidden = false) {
    if (!pool.isConnected()) {
      return demo.getDemoMenus(category, includeHidden);
    }

    let query = `SELECT * FROM food_mst_menu `;
    const conditions = [];
    const params = [];

    if (!includeHidden) {
      conditions.push("menu_is_available = true");
    }

    if (category) {
      params.push(category);
      conditions.push(`menu_category = $${params.length}`);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY menu_category, menu_name";
    const result = await pool.query(query, params);
    return result.rows;
  }

  /**
   * Get menu by ID
   */
  async getById(id) {
    if (!pool.isConnected()) {
      return demo.getDemoMenu(id);
    }

    const result = await pool.query(
      "SELECT * FROM food_mst_menu WHERE menu_id = $1",
      [id],
    );
    return result.rows[0] || null;
  }

  /**
   * Create a new menu item
   */
  async create(data) {
    if (!pool.isConnected()) {
      throw new Error("Fitur ini membutuhkan koneksi database kantor");
    }

    const id = uuidv4();
    const result = await pool.query(
      `INSERT INTO food_mst_menu 
       (menu_id, menu_name, menu_price, menu_category, menu_description, menu_image_url, menu_is_available)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        id,
        data.menu_name,
        data.menu_price,
        data.menu_category,
        data.menu_description || null,
        data.menu_image_url || null,
        data.menu_is_available !== undefined ? data.menu_is_available : true,
      ],
    );
    return result.rows[0];
  }

  /**
   * Update menu item
   */
  async update(id, data) {
    if (!pool.isConnected()) {
      throw new Error("Fitur ini membutuhkan koneksi database kantor");
    }

    const fields = [];
    const values = [];
    let idx = 1;

    for (const [key, value] of Object.entries(data)) {
      fields.push(`${key} = $${idx}`);
      values.push(value);
      idx++;
    }

    fields.push(`menu_updated_at = NOW()`);
    values.push(id);

    const result = await pool.query(
      `UPDATE food_mst_menu SET ${fields.join(", ")} WHERE menu_id = $${idx} RETURNING *`,
      values,
    );
    return result.rows[0] || null;
  }

  /**
   * Delete (soft) menu item
   */
  async delete(id) {
    if (!pool.isConnected()) {
      throw new Error("Fitur ini membutuhkan koneksi database kantor");
    }

    const result = await pool.query(
      `UPDATE food_mst_menu SET menu_is_available = false, menu_updated_at = NOW() WHERE menu_id = $1 RETURNING *`,
      [id],
    );
    return result.rows[0] || null;
  }

  /**
   * Get distinct categories
   */
  async getCategories() {
    if (!pool.isConnected()) {
      return demo.getDemoCategories();
    }

    const result = await pool.query(
      `SELECT DISTINCT menu_category FROM food_mst_menu WHERE menu_is_available = true ORDER BY menu_category`,
    );
    return result.rows.map((r) => r.menu_category);
  }
}

module.exports = new MenuService();
