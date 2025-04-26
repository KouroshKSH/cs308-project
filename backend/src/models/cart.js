const db = require("../config/database"); // Import the database connection pool

const Cart = {
  // get all the items in a the cart (for both auth or anon users)
  getCart: async (user_id, session_id) => {
    const [rows] = await db.query(
      `SELECT c.product_id, c.variation_id, c.quantity,
          p.name, p.price,
          pv.size_id, pv.color_id
        FROM carts c
        JOIN products p ON c.product_id = p.product_id
        JOIN product_variations pv ON c.variation_id = pv.variation_id
        WHERE (c.user_id = ? OR c.session_id = ?)`,
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
  addOrUpdateCartItem: async (user_id, session_id, product_id, variation_id, quantity) => {
    // first check if the product exists and has enough total stock (not variation specific)
    const [productRows] = await db.query(
      `SELECT stock_quantity
        FROM products
        WHERE product_id = ?`,
      [product_id]
    );

    if (!productRows.length) {
      const errorMessage = `Product with ID ${product_id} not found`;
      console.log(errorMessage);
      throw new Error(errorMessage);
    }
    if (productRows[0].stock_quantity < quantity) {
      console.log(`Insufficient product stock: ${productRows[0].stock_quantity}`);
      throw new Error("Insufficient stock for product");
    }

    // then check if the specific variation of that product exists and has enough stock
    const [variationRows] = await db.query(
      `SELECT stock_quantity
      FROM product_variations
      WHERE variation_id = ? AND product_id = ?`,
      [variation_id, product_id]
    );

    if (!variationRows.length) {
      const errorMessage = `Product with variation ID ${variation_id} not found`;
      console.log(errorMessage);
      throw new Error(errorMessage);
    }
    if (variationRows[0].stock_quantity < quantity) {
      console.log(`Insufficient variation stock: ${variationRows[0].stock_quantity}`);
      throw new Error("Insufficient stock for product's variation");
    }

    // if we reach here, it means both the product and variation exist and have enough stock
    const [existing] = await db.query(
      `SELECT *
        FROM carts
        WHERE (user_id = ? OR session_id = ?)
        AND product_id = ?
        AND variation_id = ?`,
      [user_id || null, session_id || null, product_id, variation_id]
    );

    if (existing.length) {
      // product already exists in cart, so you can update the quantity
      await db.query(
        `UPDATE carts
          SET quantity = quantity + ?
          WHERE (user_id = ? OR session_id = ?)
          AND product_id = ?
          AND variation_id = ?`,
        [quantity, user_id || null, session_id || null, product_id, variation_id]
      );
    } else {
      // product does not exist in cart, so you can insert a new row
      await db.query(
        `INSERT INTO carts (user_id, session_id, product_id, variation_id, quantity)
          VALUES (?, ?, ?, ?, ?)`,
        [user_id || null, session_id || null, product_id, variation_id, quantity]
      );
    }
  },

  // update by assuming item is already in the cart (both auth and anon users)
  updateCartItem: async (user_id, session_id, product_id, variation_id, quantity) => {
    await db.query(
      `UPDATE carts
        SET quantity = ?
        WHERE (user_id = ? OR session_id = ?)
        AND product_id = ?
        AND variation_id = ?`,
      [quantity, user_id || null, session_id || null, product_id, variation_id]
    );
  },

  // remove by assuming item is already in the cart (both auth and anon users)
  removeCartItem: async (user_id, session_id, product_id, variation_id) => {
    await db.query(
      `DELETE FROM carts
        WHERE (user_id = ? OR session_id = ?)
        AND product_id = ?
        AND variation_id = ?`,
      [user_id || null, session_id || null, product_id, variation_id]
    );
  },
};

module.exports = Cart; // Export the cart model for controller use
