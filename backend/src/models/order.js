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
  }
};

module.exports = Order;