const pool = require("../config/database");
const { v4: uuidv4 } = require("uuid");

class CustomerService {
  /**
   * Find customer by phone number
   */
  async findByPhone(phone) {
    if (!pool.isConnected()) {
      // Return demo customer with 0 points
      return null;
    }

    const result = await pool.query(
      "SELECT * FROM food_mst_customer WHERE customer_phone = $1",
      [phone],
    );
    return result.rows[0] || null;
  }

  /**
   * Create or updates a customer and their points
   */
  async recordOrderPoints(customerData, pointsToAdd) {
    if (!pool.isConnected()) {
      // Skip silently in demo mode
      return null;
    }

    const { name, phone } = customerData;
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const existing = await client.query(
        "SELECT * FROM food_mst_customer WHERE customer_phone = $1",
        [phone],
      );

      let customer;
      if (existing.rows[0]) {
        const currentPoints = existing.rows[0].customer_points + pointsToAdd;
        const tier = this.calculateTier(currentPoints);

        const updateResult = await client.query(
          `UPDATE food_mst_customer 
           SET customer_name = $1, customer_points = $2, customer_tier = $3, customer_updated_at = NOW() 
           WHERE customer_phone = $4 
           RETURNING *`,
          [name, currentPoints, tier, phone],
        );
        customer = updateResult.rows[0];
      } else {
        const tier = this.calculateTier(pointsToAdd);
        const insertResult = await client.query(
          `INSERT INTO food_mst_customer 
           (customer_id, customer_name, customer_phone, customer_points, customer_tier) 
           VALUES ($1, $2, $3, $4, $5) 
           RETURNING *`,
          [uuidv4(), name, phone, pointsToAdd, tier],
        );
        customer = insertResult.rows[0];
      }

      await client.query("COMMIT");
      return customer;
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  calculateTier(points) {
    if (points >= 2000) return "Gold";
    if (points >= 500) return "Silver";
    return "Bronze";
  }

  /**
   * Get all customers (Admin)
   */
  async getAll(page = 1, limit = 20) {
    if (!pool.isConnected()) {
      return { customers: [], total: 0 };
    }

    const offset = (page - 1) * limit;
    const result = await pool.query(
      "SELECT * FROM food_mst_customer ORDER BY customer_points DESC LIMIT $1 OFFSET $2",
      [limit, offset],
    );
    const countResult = await pool.query(
      "SELECT COUNT(*) FROM food_mst_customer",
    );

    return {
      customers: result.rows,
      total: parseInt(countResult.rows[0].count),
    };
  }
}

module.exports = new CustomerService();
