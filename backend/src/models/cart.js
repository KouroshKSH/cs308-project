const db = require("../config/database"); // Import the database connection pool

const Cart = {
  //  Get all items in a user's cart, joining with product details
  getCartByUserId: async (userId) => {
    const [rows] = await db.query(
      `SELECT cart.productId, cart.quantity, products.name, products.price
       FROM cart
       JOIN products ON cart.productId = products.product_id
       WHERE cart.userId = ?`,
      [userId]
    );
    return rows; // Return list of cart items with product info
  },

  // Add a new item to the cart or update quantity if it already exists
  addOrUpdateCartItem: async (userId, productId, quantity) => {
    // 1. Check if the product exists and has enough stock
    const [productRows] = await db.query(
      `SELECT stock_quantity FROM products WHERE product_id = ?`,
      [productId]
    );

    if (!productRows.length || productRows[0].stock_quantity < quantity) {
      throw new Error("Insufficient stock or product not found");
    }

    // 2. Check if the item is already in the user's cart
    const [existing] = await db.query(
      `SELECT * FROM cart WHERE userId = ? AND productId = ?`,
      [userId, productId]
    );

    if (existing.length) {
      // 3. If yes, increment the quantity
      await db.query(
        `UPDATE cart SET quantity = quantity + ? WHERE userId = ? AND productId = ?`,
        [quantity, userId, productId]
      );
    } else {
      // 4. If not, insert new item into the cart
      await db.query(
        `INSERT INTO cart (userId, productId, quantity) VALUES (?, ?, ?)`,
        [userId, productId, quantity]
      );
    }
  },

  //  Update quantity of a specific product in the cart
  updateCartItem: async (userId, productId, quantity) => {
    await db.query(
      `UPDATE cart SET quantity = ? WHERE userId = ? AND productId = ?`,
      [quantity, userId, productId]
    );
  },

  // Remove a product from the cart
  removeCartItem: async (userId, productId) => {
    await db.query(`DELETE FROM cart WHERE userId = ? AND productId = ?`, [
      userId,
      productId,
    ]);
  },
};

module.exports = Cart; // Export the cart model for controller use
