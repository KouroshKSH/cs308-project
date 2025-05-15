const db = require('../config/database');

const Order = {
  create: async ({ user_id, delivery_address, total_price }) => {
    const [result] = await db.execute(
      'INSERT INTO orders (user_id, delivery_address, total_price) VALUES (?, ?, ?)',
      [user_id, delivery_address, total_price]
    );
    return result.insertId;
  },

  getById: async (id) => {
    const [rows] = await db.execute('SELECT * FROM orders WHERE order_id = ?', [id]);
    return rows[0];
  },

  getByUserId: async (userId) => {
    const [rows] = await db.execute('SELECT * FROM orders WHERE user_id = ?', [userId]);
    return rows;
  },

  updateStatus: async (orderId, status) => {
    await db.execute('UPDATE orders SET status = ? WHERE order_id = ?', [status, orderId]);
  },

  delete: async (id) => {
    await db.execute('DELETE FROM orders WHERE order_id = ?', [id]);
  },

  // Sales stats by product
  getProductSalesStats: async () => {
    const [rows] = await db.execute(`
      SELECT 
        p.product_id,
        p.name AS product_name,
        SUM(oi.quantity) AS total_units_sold,
        SUM(oi.quantity * oi.price_at_purchase) AS total_revenue,
        SUM(oi.quantity * (oi.price_at_purchase - p.cost)) AS total_profit
      FROM order_items oi
      JOIN products p ON oi.product_id = p.product_id
      GROUP BY p.product_id, p.name
    `);
    return rows;
  },

  // Sales stats by variation
  getVariationSalesStats: async () => {
    const [rows] = await db.execute(`
      SELECT 
        pv.product_id,
        pv.variation_id,
        pv.serial_number AS variation_name,
        SUM(oi.quantity) AS total_units_sold,
        SUM(oi.quantity * oi.price_at_purchase) AS total_revenue,
        SUM(oi.quantity * (oi.price_at_purchase - p.cost)) AS total_profit
      FROM order_items oi
      JOIN product_variations pv ON oi.variation_id = pv.variation_id
      JOIN products p ON pv.product_id = p.product_id
      GROUP BY pv.variation_id, pv.product_id
    `);
    return rows;
  },
  // Sales stats by variation for a specific product
  getVariationSalesStatsByProductId: async (productId) => {
    const [rows] = await db.execute(`
      SELECT 
        pv.product_id,
        pv.variation_id,
        pv.serial_number AS variation_name,
        SUM(oi.quantity) AS total_units_sold,
        SUM(oi.quantity * oi.price_at_purchase) AS total_revenue,
        SUM(oi.quantity * (oi.price_at_purchase - p.cost)) AS total_profit
      FROM order_items oi
      JOIN product_variations pv ON oi.variation_id = pv.variation_id
      JOIN products p ON pv.product_id = p.product_id
      WHERE pv.product_id = ?
      GROUP BY pv.variation_id, pv.product_id, pv.serial_number
    `, [productId]);

    return rows;
  }
};

module.exports = Order;