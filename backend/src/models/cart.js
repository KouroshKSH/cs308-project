const db = require("../config/database"); // Import the database connection pool

const Cart = {
  // get all the items in a the cart (for both auth or anon users)
  getCart: async (user_id, session_id) => {
    const [rows] = await db.query(
      `SELECT cart.product_id, cart.quantity, products.name, products.price
        FROM cart
        JOIN products ON cart.product_id = products.product_id
        WHERE cart.user_id = ? OR cart.session_id = ?`,
      [user_id || null, session_id || null]
    );
    // this endpoint works for both authenticated users and anonymous visitors
    // we mostly care about session ID (do NOT delete this comment!)
    console.log("Session ID:", session_id);
    console.log("User ID:", user_id);
    console.log("Cart items:\n", rows);
    return rows;
  },

  // add or update a cart item (both auth and anon users)
  addOrUpdateCartItem: async (user_id, session_id, product_id, quantity) => {
    const [productRows] = await db.query(
      `SELECT stock_quantity
        FROM products
        WHERE product_id = ?`,
      [product_id]
    );

    if (!productRows.length) {
      console.log("Product not found");
      throw new Error("Product not found");
    }
    if (productRows[0].stock_quantity < quantity) {
      console.log("Insufficient stock:", productRows[0].stock_quantity);
      throw new Error("Insufficient stock");
    }

    const [existing] = await db.query(
      `SELECT *
        FROM cart
        WHERE (user_id = ? OR session_id = ?) AND product_id = ?`,
      [user_id || null, session_id || null, product_id]
    );

    if (existing.length) {
      // product already exists in cart, so you can update the quantityS
      await db.query(
        `UPDATE cart
          SET quantity = quantity + ?
          WHERE (user_id = ? OR session_id = ?) AND product_id = ?`,
        [quantity, user_id || null, session_id || null, product_id]
      );
    } else {
      // product does not exist in cart, so you can insert a new row
      await db.query(
        `INSERT INTO cart (user_id, session_id, product_id, quantity)
          VALUES (?, ?, ?, ?)`,
        [user_id || null, session_id || null, product_id, quantity]
      );
    }
  },

  // update by assuming item is already in the cart (both auth and anon users)
  updateCartItem: async (user_id, session_id, product_id, quantity) => {
    await db.query(
      `UPDATE cart
        SET quantity = ?
        WHERE (user_id = ? OR session_id = ?) AND product_id = ?`,
      [quantity, user_id || null, session_id || null, product_id]
    );
  },

  // remove by assuming item is already in the cart (both auth and anon users)
  removeCartItem: async (user_id, session_id, product_id) => {
    await db.query(
      `DELETE FROM cart
        WHERE (user_id = ? OR session_id = ?) AND product_id = ?`,
      [user_id || null, session_id || null, product_id]
    );
  },
};

module.exports = Cart; // Export the cart model for controller use
