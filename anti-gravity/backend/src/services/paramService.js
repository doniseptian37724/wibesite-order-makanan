const pool = require("../config/database");
const { v4: uuidv4 } = require("uuid");

class ParamService {
  /**
   * Get param by group and key
   */
  async get(paramGroup, paramKey) {
    const result = await pool.query(
      "SELECT * FROM food_mst_general_param WHERE param_group = $1 AND param_key = $2 AND param_is_active = true",
      [paramGroup, paramKey],
    );
    return result.rows[0] || null;
  }

  /**
   * Get all params by group
   */
  async getByGroup(paramGroup) {
    const result = await pool.query(
      "SELECT * FROM food_mst_general_param WHERE param_group = $1 AND param_is_active = true ORDER BY param_order",
      [paramGroup],
    );
    return result.rows;
  }

  /**
   * Create or update param
   */
  async upsert(data) {
    const existing = await this.get(data.param_group, data.param_key);

    if (existing) {
      const result = await pool.query(
        `UPDATE food_mst_general_param 
         SET param_value = $1, param_description = $2, param_updated_at = NOW()
         WHERE param_id = $3 RETURNING *`,
        [
          data.param_value,
          data.param_description || existing.param_description,
          existing.param_id,
        ],
      );
      return result.rows[0];
    }

    const result = await pool.query(
      `INSERT INTO food_mst_general_param 
       (param_id, param_group, param_key, param_value, param_description, param_order)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [
        uuidv4(),
        data.param_group,
        data.param_key,
        data.param_value,
        data.param_description || null,
        data.param_order || 0,
      ],
    );
    return result.rows[0];
  }
}

module.exports = new ParamService();
