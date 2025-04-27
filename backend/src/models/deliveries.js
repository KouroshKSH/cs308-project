const db = require('../config/database');

const Deliveries = {
  create: async ({ order_id, delivery_status, tracking_number, delivery_address }) => {
    const [result] = await db.execute(
      `INSERT INTO deliveries 
         (order_id, delivery_status, tracking_number, delivery_address) 
       VALUES (?, ?, ?, ?)`,
      [order_id, delivery_status, tracking_number, delivery_address]
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
  },

  updateTrackingNumberAndStatus: async (delivery_id, tracking_number, delivery_status) => {
    await db.execute(
      `UPDATE deliveries
       SET tracking_number = ?, delivery_status = ?
       WHERE delivery_id = ?`,
      [tracking_number, delivery_status, delivery_id]
    );
  },
};

module.exports = Deliveries;