const pool = require("../config/database");
const { v4: uuidv4 } = require("uuid");
const demo = require("../utils/demoData");

const customerService = require("./customerService");
const whatsappService = require("./whatsappService");

class OrderService {
  /**
   * Create a new order with items
   */
  async create(data) {
    // === DEMO MODE (No DB) ===
    if (!pool.isConnected()) {
      const order = demo.createDemoOrder(data);

      // Still send WhatsApp notification!
      try {
        const adminMsg = whatsappService.buildOrderMessage(order, order.items);
        await whatsappService.sendMessageToAdmin(adminMsg);

        if (order.order_customer_phone) {
          const customerMsg = whatsappService.buildCustomerMessage(order);
          await whatsappService.sendMessageToCustomer(
            order.order_customer_phone,
            customerMsg,
          );
        }
      } catch (waErr) {
        console.warn("WA notification failed:", waErr.message);
      }

      return order;
    }

    // === LIVE MODE (With DB) ===
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const orderId = uuidv4();
      const orderCode = `OM-${Date.now().toString(36).toUpperCase()}`;

      // Calculate total from items
      let totalAmount = 0;
      const itemsWithPrice = [];

      for (const item of data.items) {
        const menuResult = await client.query(
          "SELECT menu_price, menu_name FROM food_mst_menu WHERE menu_id = $1 AND menu_is_available = true",
          [item.menu_id],
        );

        if (!menuResult.rows[0]) {
          throw Object.assign(
            new Error(
              `Menu ${item.menu_id} tidak ditemukan atau tidak tersedia`,
            ),
            { statusCode: 400 },
          );
        }

        const menu = menuResult.rows[0];
        const subtotal = menu.menu_price * item.quantity;
        totalAmount += subtotal;

        itemsWithPrice.push({
          ...item,
          menu_name: menu.menu_name,
          item_price: menu.menu_price,
          item_subtotal: subtotal,
        });
      }

      // Use provided total if available (includes discounts)
      if (data.order_total_amount) {
        totalAmount = data.order_total_amount;
      }

      // Insert order
      const orderResult = await client.query(
        `INSERT INTO food_trx_order 
         (order_id, order_code, order_customer_name, order_customer_phone, order_notes, order_total_amount, order_status)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [
          orderId,
          orderCode,
          data.order_customer_name,
          data.order_customer_phone,
          data.order_notes || null,
          totalAmount,
          "pending",
        ],
      );

      // Insert order items
      for (const item of itemsWithPrice) {
        await client.query(
          `INSERT INTO food_trx_order_item 
           (order_item_id, order_id, menu_id, order_item_quantity, order_item_price, order_item_subtotal, order_item_notes)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            uuidv4(),
            orderId,
            item.menu_id,
            item.quantity,
            item.item_price,
            item.item_subtotal,
            item.item_notes || null,
          ],
        );
      }

      // Log order creation
      await client.query(
        `INSERT INTO food_log_order (log_id, order_id, log_action, log_description)
         VALUES ($1, $2, $3, $4)`,
        [
          uuidv4(),
          orderId,
          "created",
          `Order ${orderCode} dibuat oleh ${data.order_customer_name}`,
        ],
      );

      await client.query("COMMIT");

      // Update/Create Customer points
      try {
        const pointsToAdd = Math.floor(totalAmount / 1000);
        await customerService.recordOrderPoints(
          {
            name: data.order_customer_name,
            phone: data.order_customer_phone,
          },
          pointsToAdd,
        );
      } catch (custErr) {
        console.error("Failed to update customer points:", custErr);
      }

      // 🔔 Automated WhatsApp Notifications
      try {
        const adminMsg = whatsappService.buildOrderMessage(
          orderResult.rows[0],
          itemsWithPrice,
        );
        await whatsappService.sendMessageToAdmin(adminMsg);

        const customerPhone = orderResult.rows[0].order_customer_phone;
        if (customerPhone) {
          const customerMsg = whatsappService.buildCustomerMessage(
            orderResult.rows[0],
          );
          await whatsappService.sendMessageToCustomer(
            customerPhone,
            customerMsg,
          );
        }
      } catch (waErr) {
        console.error("Failed to send auto WA notification:", waErr);
      }

      return {
        ...orderResult.rows[0],
        items: itemsWithPrice,
      };
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  /**
   * Get order by ID with items
   */
  async getById(id) {
    if (!pool.isConnected()) {
      return demo.getDemoOrders().find((o) => o.order_id === id) || null;
    }

    const orderResult = await pool.query(
      "SELECT * FROM food_trx_order WHERE order_id = $1",
      [id],
    );
    if (!orderResult.rows[0]) return null;

    const itemsResult = await pool.query(
      `SELECT oi.*, m.menu_name, m.menu_image_url
       FROM food_trx_order_item oi
       JOIN food_mst_menu m ON m.menu_id = oi.menu_id
       WHERE oi.order_id = $1`,
      [id],
    );

    return { ...orderResult.rows[0], items: itemsResult.rows };
  }

  /**
   * Get order by code
   */
  async getByCode(code) {
    if (!pool.isConnected()) {
      return demo.getDemoOrders().find((o) => o.order_code === code) || null;
    }

    const orderResult = await pool.query(
      "SELECT * FROM food_trx_order WHERE order_code = $1",
      [code],
    );
    if (!orderResult.rows[0]) return null;

    const itemsResult = await pool.query(
      `SELECT oi.*, m.menu_name, m.menu_image_url
       FROM food_trx_order_item oi
       JOIN food_mst_menu m ON m.menu_id = oi.menu_id
       WHERE oi.order_id = $1`,
      [orderResult.rows[0].order_id],
    );

    return { ...orderResult.rows[0], items: itemsResult.rows };
  }

  /**
   * Get all orders (with pagination)
   */
  async getAll(page = 1, limit = 20, status = null) {
    if (!pool.isConnected()) {
      const orders = demo.getDemoOrders(status);
      return { orders, total: orders.length };
    }

    const offset = (page - 1) * limit;
    const params = [];

    let whereClause = "";
    if (status) {
      params.push(status);
      whereClause = `WHERE o.order_status = $${params.length}`;
    }

    params.push(limit, offset);

    const [result, countResult] = await Promise.all([
      pool.query(
        `SELECT o.*, 
          (SELECT JSON_AGG(item_data) FROM (
            SELECT oi.*, m.menu_name 
            FROM food_trx_order_item oi
            JOIN food_mst_menu m ON m.menu_id = oi.menu_id
            WHERE oi.order_id = o.order_id
          ) item_data) as items
        FROM food_trx_order o
        ${whereClause}
        ORDER BY o.order_created_at DESC
        LIMIT $${params.length - 1} OFFSET $${params.length}`,
        params,
      ),
      pool.query(
        `SELECT COUNT(*) FROM food_trx_order ${whereClause}`,
        status ? [status] : [],
      ),
    ]);

    return {
      orders: result.rows,
      total: parseInt(countResult.rows[0].count),
    };
  }

  /**
   * Update order status
   */
  async updateStatus(id, status) {
    if (!pool.isConnected()) {
      return demo.updateDemoOrderStatus(id, status);
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const result = await client.query(
        `UPDATE food_trx_order SET order_status = $1, order_updated_at = NOW() WHERE order_id = $2 RETURNING *`,
        [status, id],
      );

      if (!result.rows[0]) {
        throw Object.assign(new Error("Order tidak ditemukan"), {
          statusCode: 404,
        });
      }

      await client.query(
        `INSERT INTO food_log_order (log_id, order_id, log_action, log_description)
         VALUES ($1, $2, $3, $4)`,
        [uuidv4(), id, "status_changed", `Status diubah menjadi ${status}`],
      );

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

module.exports = new OrderService();
