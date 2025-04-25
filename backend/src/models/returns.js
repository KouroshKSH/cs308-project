const db = require('../config/database');

const Returns = {
  // Create a return and return the new return_id
  create: async ({ order_item_id, order_id, quantity, refund_amount, user_id }) => {
    const [result] = await db.execute(
      "INSERT INTO returns (order_item_id, order_id, quantity, refund_amount, user_id) VALUES (?, ?, ?, ?, ?)",
      [
        order_item_id,
        order_id,
        quantity ?? 1,
        refund_amount ?? null,
        user_id
      ]
    );
    return result.insertId;
  },

  // Get all returns (admin only)
  getAll: async () => {
    const [rows] = await db.execute("SELECT * FROM returns");
    return rows;
  },

  // Get returns by user
  getByUserId: async (user_id) => {
    const [rows] = await db.execute("SELECT * FROM returns WHERE user_id = ?", [user_id]);
    return rows;
  },
    // Update return status
  updateStatus: async (return_id, status) => {
    await db.execute(
      "UPDATE returns SET status = ? WHERE return_id = ?",
      [status, return_id]
    );
  }
};

module.exports = Returns;