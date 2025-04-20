const Cart = require("../models/cart"); // Import the Cart model (uses MySQL)

// GET /api/cart
// get all items in the authenticated user's cart
exports.getCart = async (req, res) => {
  try {
    const user_id = req.user?.user_id || null; // get user_id from JWT if available
    const session_id = req.headers["x-session-id"]; // get session_id from headers

    // for logging purposes
    console.log("Session ID:", session_id);
    console.log("User ID:", user_id);

    if (!user_id && !session_id) {
      return res.status(400).json({ error: "User ID or session ID is required" });
    }

    const cart = await Cart.getCart(user_id, session_id); // call DB
    res.status(200).json(cart);
  } catch (err) {
    console.error("Error fetching cart:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// POST /api/cart/add
// Add a product to the cart
exports.addToCart = async (req, res) => {
  try {
    const user_id = req.user?.user_id || null;
    const session_id = req.headers["x-session-id"];
    const { product_id, quantity } = req.body; // what product and how many

    // for logging purposes
    console.log("Session ID:", session_id);
    console.log("User ID:", user_id);
    console.log("Product ID:", product_id, "Quantity:", quantity);


    if (!session_id && !user_id) {
      // logging for debugging
      console.log("Are session ID and user ID both null?");
      console.log("Session ID:", session_id);
      console.log("User ID:", user_id);
      return res.status(400).json({ error: "User ID or session ID is required" });
    }

    await Cart.addOrUpdateCartItem(user_id, session_id, product_id, quantity);
    // logging for debugging
    console.log("Product ID:", product_id);
    console.log("Quantity:", quantity);
    console.log("User ID:", user_id);
    console.log("Session ID:", session_id);

    res.status(200).json({ message: "Product added to cart." });
  } catch (err) {
    console.error("Error adding to cart:", err.message);
    res.status(400).json({ error: err.message });
  }
};

// PUT /api/cart/update
// Update the quantity of a product in the cart
exports.updateCartItem = async (req, res) => {
  try {
    const user_id = req.user?.user_id || null;
    const session_id = req.headers["x-session-id"];
    const { product_id, quantity } = req.body;

    if (!session_id && !user_id) {
      return res.status(400).json({ error: "User ID or session ID is required" });
    }

    await Cart.updateCartItem(user_id, session_id, product_id, quantity);

    res.status(200).json({ message: "Cart item updated successfully." });
  } catch (err) {
    console.log("Error updating cart item:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/cart/remove
exports.removeFromCart = async (req, res) => {
  try {
    const user_id = req.user?.user_id || null;
    const session_id = req.headers["x-session-id"];
    const { product_id } = req.body;

    // for logging purposes
    console.log("Session ID:", session_id);
    console.log("User ID:", user_id);
    console.log("Product ID:", product_id);

    if (!session_id && !user_id) {
      return res.status(400).json({ error: "User ID or session ID is required" });
    }

    await Cart.removeCartItem(user_id, session_id, product_id);

    res.status(200).json({ message: "Product removed from cart." });
  } catch (err) {
    console.log("Error removing from cart:", err.message);
    res.status(500).json({ error: err.message });
  }
};

