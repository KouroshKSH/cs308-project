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
    const [rows] = await db.execute(`
      SELECT d.*, o.user_id
      FROM deliveries d
      JOIN orders o ON d.order_id = o.order_id
    `);
    return rows;
  },
  getByOrderId: async (orderId) => {
    const [rows] = await db.execute('SELECT * FROM deliveries WHERE order_id = ?', [orderId]);
    return rows[0];
  },
  getByStatus: async (status) => {
    const [rows] = await db.execute(`
      SELECT d.*, o.user_id
      FROM deliveries d
      JOIN orders o ON d.order_id = o.order_id
      WHERE d.delivery_status = ?
    `, [status]);
    return rows;
  },
  updateStatus: async (id, delivery_status) => {
    // updates both the `deliveries` table and the `orders` table
    
    // Start by updating the delivery status in the deliveries table
    await db.execute(
      'UPDATE deliveries SET delivery_status = ? WHERE delivery_id = ?', 
      [delivery_status, id]
    );

    // Find the corresponding order_id for the given delivery_id
    const [rows] = await db.execute(
      'SELECT order_id FROM deliveries WHERE delivery_id = ?', 
      [id]
    );
    if (rows.length === 0) {
      throw new Error(`No delivery found with ID ${id}`);
    }
    const order_id = rows[0].order_id;

    // Determine the corresponding order status based on the delivery status
    let order_status = null;
    if (delivery_status === 'shipped') {
      order_status = 'in-transit';
    } else if (delivery_status === 'delivered') {
      order_status = 'delivered';
    }

    // Update the status in the orders table
    if (order_status) {
      await db.execute(
        'UPDATE orders SET status = ? WHERE order_id = ?', 
        [order_status, order_id]
      );
    }
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