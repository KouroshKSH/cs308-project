const db = require('../config/database');

const OrderItem = {
  create: async ({ order_id, product_id, variation_id, quantity, price_at_purchase }) => {
    await db.execute(
      'INSERT INTO order_items (order_id, product_id, variation_id, quantity, price_at_purchase) VALUES (?, ?, ?, ?, ?)',
      [order_id, product_id, variation_id, quantity, price_at_purchase]
    );
  },
  getByOrderId: async (orderId) => {
    const [rows] = await db.execute('SELECT * FROM order_items WHERE order_id = ?', [orderId]);
    return rows;
  },
  getById: async (orderItemId) => {
    const [rows] = await db.execute(
      'SELECT * FROM order_items WHERE order_item_id = ?',
      [orderItemId]
    );
    return rows[0];
  },
  update: async (id, { quantity, price_at_purchase }) => {
    await db.execute(
      'UPDATE order_items SET quantity = ?, price_at_purchase = ? WHERE order_item_id = ?',
      [quantity, price_at_purchase, id]
    );
  }
};

module.exports = OrderItem;