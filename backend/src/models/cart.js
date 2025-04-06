// backend/src/models/cart.js
const db = require("../config/database");

const Cart = {
  // Retrieve all cart items for a specific user
  getCartByUserId: async (userId) => {
    const [rows] = await db.query(
      `SELECT cart.productId, cart.quantity, products.name, products.price
       FROM cart
       JOIN products ON cart.productId = products.product_id
       WHERE cart.userId = ?`,
      [userId]
    );
    return rows;
  },

  // Add a product to the cart or update its quantity if it already exists
  addOrUpdateCartItem: async (userId, productId, quantity) => {
    // First, check if the product exists and there is enough stock
    const [productRows] = await db.query(
      `SELECT stock_quantity FROM products WHERE product_id = ?`,
      [productId]
    );

    // If the product is not found or stock is insufficient, throw an error
    if (!productRows.length || productRows[0].stock_quantity < quantity) {
      throw new Error("Insufficient stock or product not found");
    }

    // Check if the product is already in the user's cart
    const [existing] = await db.query(
      `SELECT * FROM cart WHERE userId = ? AND productId = ?`,
      [userId, productId]
    );

    if (existing.length) {
      // If it exists, increment the quantity
      await db.query(
        `UPDATE cart SET quantity = quantity + ? WHERE userId = ? AND productId = ?`,
        [quantity, userId, productId]
      );
    } else {
      // Otherwise, insert a new row into the cart table
      await db.query(
        `INSERT INTO cart (userId, productId, quantity) VALUES (?, ?, ?)`,
        [userId, productId, quantity]
      );
    }
  },

  // Update the quantity of a specific item in the cart
  updateCartItem: async (userId, productId, quantity) => {
    await db.query(
      `UPDATE cart SET quantity = ? WHERE userId = ? AND productId = ?`,
      [quantity, userId, productId]
    );
  },

  // Remove a specific item from the user's cart
  removeCartItem: async (userId, productId) => {
    await db.query(`DELETE FROM cart WHERE userId = ? AND productId = ?`, [
      userId,
      productId,
    ]);
  },
};

module.exports = Cart;
