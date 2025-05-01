const db = require("../config/database"); // Import the database connection pool

const Cart = {
  // get all the items in a the cart (for both auth or anon users) with total price
  getCart: async (user_id, session_id) => {
    // user ID can be null (anonymous visitor) but session ID always has a value
    let rows;
    if (user_id) {
      // so person is authenticated (logged in or signed up)
      // [rows] = await db.query(
      //   `SELECT c.product_id, c.variation_id, c.quantity,
      //       p.name, p.price,
      //       pv.size_id, pv.color_id
      //     FROM carts c
      //     JOIN products p ON c.product_id = p.product_id
      //     JOIN product_variations pv ON c.variation_id = pv.variation_id
      //     WHERE c.user_id = ?`,
      //   [user_id]
      // );
      [rows] = await db.query(
        `SELECT c.product_id, c.variation_id, c.quantity,
            p.name, p.price,
            pv.size_id, s.size_name,
            pv.color_id, co.color_name
          FROM carts c
          JOIN products p ON c.product_id = p.product_id
          JOIN product_variations pv ON c.variation_id = pv.variation_id
          JOIN sizes s ON pv.size_id = s.size_id
          JOIN colors co ON pv.color_id = co.color_id
          WHERE c.user_id = ?`,
        [user_id]
      );
    } else {
      // anon visitor, so use their session ID
      [rows] = await db.query(
        `SELECT c.product_id, c.variation_id, c.quantity,
            p.name, p.price,
            pv.size_id, s.size_name,
            pv.color_id, co.color_name
          FROM carts c
          JOIN products p ON c.product_id = p.product_id
          JOIN product_variations pv ON c.variation_id = pv.variation_id
          JOIN sizes s ON pv.size_id = s.size_id
          JOIN colors co ON pv.color_id = co.color_id
          WHERE c.session_id = ?`,
        [session_id]
      );
    }

    // Calculate total price
    const total_price = rows.reduce((sum, item) => {
      return sum + parseFloat(item.price) * item.quantity;
    }, 0);

    // this endpoint works for both authenticated users and anonymous visitors
    // we mostly care about session ID (do NOT delete this comment!)
    console.log("Session ID:", session_id);
    console.log("User ID:", user_id);
    console.log("Cart items:\n", rows);
    console.log("Total price:", total_price);

    // add total price to the response
    return { items: rows, total_price: total_price.toFixed(2) };
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

    // If user is logging in, update their anonymous cart items first
    if (user_id) {
      await db.query(
          `UPDATE carts
            SET user_id = ?
            WHERE session_id = ? AND user_id IS NULL`,
          [user_id, session_id]
      );
    }

    let existing;
    if (user_id) {
      [existing] = await db.query(
        `SELECT * FROM carts WHERE user_id = ? AND product_id = ? AND variation_id = ?`,
        [user_id, product_id, variation_id]
      );
    } else {
      [existing] = await db.query(
        `SELECT * FROM carts WHERE session_id = ? AND product_id = ? AND variation_id = ?`,
        [session_id, product_id, variation_id]
      );
    }

    if (existing.length) {
      if (user_id) {
        await db.query(
          `UPDATE carts SET quantity = quantity + ? WHERE user_id = ? AND product_id = ? AND variation_id = ?`,
          [quantity, user_id, product_id, variation_id]
        );
      } else {
        await db.query(
          `UPDATE carts SET quantity = quantity + ? WHERE session_id = ? AND product_id = ? AND variation_id = ?`,
          [quantity, session_id, product_id, variation_id]
        );
      }
    } else {
      // product does not exist in cart, so you can insert a new row
      await db.query(
        `INSERT INTO carts (user_id, session_id, product_id, variation_id, quantity)
          VALUES (?, ?, ?, ?, ?)`,
        [user_id || null, session_id, product_id, variation_id, quantity]
      );
    }
  },

  // update by assuming item is already in the cart (both auth and anon users)
  updateCartItem: async (user_id, session_id, product_id, variation_id, quantity) => {
    if (user_id) {
      await db.query(
        `UPDATE carts SET quantity = ? WHERE user_id = ? AND product_id = ? AND variation_id = ?`,
        [quantity, user_id, product_id, variation_id]
      );
    } else {
      await db.query(
        `UPDATE carts SET quantity = ? WHERE session_id = ? AND product_id = ? AND variation_id = ?`,
        [quantity, session_id, product_id, variation_id]
      );
    }
  },

  // remove by assuming item is already in the cart (both auth and anon users)
  removeCartItem: async (user_id, session_id, product_id, variation_id) => {
    if (user_id) {
      await db.query(
        `DELETE FROM carts WHERE user_id = ? AND product_id = ? AND variation_id = ?`,
        [user_id, product_id, variation_id]
      );
    } else {
      await db.query(
        `DELETE FROM carts WHERE session_id = ? AND product_id = ? AND variation_id = ?`,
        [session_id, product_id, variation_id]
      );
    }
  },

  // remove multiple items from cart after checkout given user_id and product_id
  removeItemsAfterCheckout: async (user_id, items) => {
    if (!items.length) return;
    const conditions = items.map(() => '(product_id = ? AND variation_id = ?)').join(' OR ');
    const values = items.flatMap(i => [i.product_id, i.variation_id]);

    // for that specific user, delete all the items in the cart that match the product_id and variation_id
    await db.query(
      `DELETE FROM carts WHERE user_id = ? AND (${conditions})`,
      [user_id, ...values]
    );
  },

  // update cart rows for a session that has an authenticated user
  updateCartUserId: async (user_id, session_id) => {
    if (!user_id || !session_id) return;
    await db.query(
      `UPDATE carts SET user_id = ? WHERE session_id = ? AND user_id IS NULL`,
      [user_id, session_id]
    );
  },
};

module.exports = Cart; // Export the cart model for controller use