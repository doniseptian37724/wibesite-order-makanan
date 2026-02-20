const pool = require("../config/database");
const { v4: uuidv4 } = require("uuid");

class UserService {
  /**
   * Get user by phone number (Create if not exists)
   */
  async getOrCreateByPhone(phone, name) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Try to find user
      let userResult = await client.query(
        "SELECT * FROM food_mst_customer WHERE customer_phone = $1",
        [phone],
      );

      if (!userResult.rows[0]) {
        // Create new user
        userResult = await client.query(
          `INSERT INTO food_mst_customer (customer_id, customer_name, customer_phone)
           VALUES ($1, $2, $3) RETURNING *`,
          [uuidv4(), name || "Customer", phone],
        );
      } else if (name && userResult.rows[0].customer_name !== name) {
        // Update name if changed
        userResult = await client.query(
          `UPDATE food_mst_customer SET customer_name = $1, customer_updated_at = NOW() 
           WHERE customer_phone = $2 RETURNING *`,
          [name, phone],
        );
      }

      const user = userResult.rows[0];

      // Get vouchers
      const vouchersResult = await client.query(
        "SELECT * FROM food_trx_voucher WHERE customer_id = $1 AND voucher_is_used = FALSE",
        [user.customer_id],
      );

      await client.query("COMMIT");

      return {
        ...user,
        vouchers: vouchersResult.rows,
      };
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  /**
   * Add points to user
   */
  async addPoints(phone, points) {
    const result = await pool.query(
      `UPDATE food_mst_customer 
       SET customer_points = customer_points + $1, customer_updated_at = NOW() 
       WHERE customer_phone = $2 
       RETURNING *`,
      [points, phone],
    );

    if (!result.rows[0]) {
      throw Object.assign(new Error("User tidak ditemukan"), {
        statusCode: 404,
      });
    }

    // Update Tier logic
    await this.updateTier(phone);

    return result.rows[0];
  }

  /**
   * Update User Tier based on points
   */
  async updateTier(phone) {
    const userResult = await pool.query(
      "SELECT customer_points FROM food_mst_customer WHERE customer_phone = $1",
      [phone],
    );
    if (!userResult.rows[0]) return;

    const points = userResult.rows[0].customer_points;
    let tier = "Bronze";
    if (points >= 2000) tier = "Gold";
    else if (points >= 500) tier = "Silver";

    await pool.query(
      "UPDATE food_mst_customer SET customer_tier = $1 WHERE customer_phone = $2",
      [tier, phone],
    );
  }

  /**
   * Redeem Voucher
   */
  async redeemVoucher(phone, cost, value, name) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Check points
      const userResult = await client.query(
        "SELECT * FROM food_mst_customer WHERE customer_phone = $1",
        [phone],
      );

      if (!userResult.rows[0]) {
        throw Object.assign(new Error("User tidak ditemukan"), {
          statusCode: 404,
        });
      }

      const user = userResult.rows[0];
      if (user.customer_points < cost) {
        throw Object.assign(new Error("Poin tidak cukup"), { statusCode: 400 });
      }

      // Deduct points
      await client.query(
        "UPDATE food_mst_customer SET customer_points = customer_points - $1, customer_updated_at = NOW() WHERE customer_id = $2",
        [cost, user.customer_id],
      );

      // Create voucher
      const voucherResult = await client.query(
        `INSERT INTO food_trx_voucher (voucher_id, customer_id, voucher_name, voucher_value)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [uuidv4(), user.customer_id, name, value],
      );

      await client.query("COMMIT");
      return voucherResult.rows[0];
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  /**
   * Use Voucher
   */
  async useVoucher(phone, voucherId) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const userResult = await client.query(
        "SELECT customer_id FROM food_mst_customer WHERE customer_phone = $1",
        [phone],
      );

      if (!userResult.rows[0]) {
        throw Object.assign(new Error("User tidak ditemukan"), {
          statusCode: 404,
        });
      }

      const result = await client.query(
        `UPDATE food_trx_voucher 
         SET voucher_is_used = TRUE, voucher_used_at = NOW() 
         WHERE voucher_id = $1 AND customer_id = $2 AND voucher_is_used = FALSE
         RETURNING *`,
        [voucherId, userResult.rows[0].customer_id],
      );

      if (!result.rows[0]) {
        throw Object.assign(
          new Error("Voucher tidak valid atau sudah digunakan"),
          { statusCode: 400 },
        );
      }

      await client.query("COMMIT");
      return result.rows[0];
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }
}

module.exports = new UserService();
