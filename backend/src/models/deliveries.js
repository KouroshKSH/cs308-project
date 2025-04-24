const db = require('../config/database');

const Deliveries = {
  create: async ({ order_id, shipped_date, delivery_status }) => {
    const [result] = await db.execute(
      'INSERT INTO deliveries (order_id, shipped_date, delivery_status) VALUES (?, ?, ?)',
      [order_id, shipped_date, delivery_status]
    );
    return result.insertId;
  },
  getAll: async () => {
    const [rows] = await db.execute('SELECT * FROM deliveries');
    return rows;
  },
  getByOrderId: async (orderId) => {
    const [rows] = await db.execute('SELECT * FROM deliveries WHERE order_id = ?', [orderId]);
    return rows[0];
  },
  updateStatus: async (id, delivery_status) => {
    await db.execute('UPDATE deliveries SET delivery_status = ? WHERE delivery_id = ?', [delivery_status, id]);
  }
};

module.exports = Deliveries;