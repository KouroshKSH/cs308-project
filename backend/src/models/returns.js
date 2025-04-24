const db = require('../config/database');

const Returns = {
  create: async ({ order_item_id, refund_amount }) => {
    const [result] = await db.execute(
      'INSERT INTO returns (order_item_id, refund_amount) VALUES (?, ?)',
      [order_item_id, refund_amount]
    );
    return result.insertId;
  },
  getAll: async () => {
    const [rows] = await db.execute('SELECT * FROM returns');
    return rows;
  },
  updateStatus: async (id, status) => {
    await db.execute('UPDATE returns SET status = ? WHERE return_id = ?', [status, id]);
  }
};

module.exports = Returns;