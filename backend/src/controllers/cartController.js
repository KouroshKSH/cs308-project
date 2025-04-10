const Cart = require("../models/cart"); // Import the Cart model (uses MySQL)

// GET /api/cart → Get all items in the authenticated user's cart
exports.getCart = async (req, res) => {
  try {
    const userId = req.user.userId; // Get userId from decoded JWT token
    const cart = await Cart.getCartByUserId(userId); // Fetch cart items from DB
    res.status(200).json(cart); // Return the cart items as JSON
  } catch (err) {
    res.status(500).json({ error: err.message }); // Server error
  }
};

// POST /api/cart/add → Add a product to the cart
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.userId; // Extract user ID from JWT
    const { productId, quantity } = req.body; // Get product and quantity from request body

    await Cart.addOrUpdateCartItem(userId, productId, quantity); // Insert or update cart item

    res.status(200).json({ message: "Product added to cart." }); // Success response
  } catch (err) {
    res.status(400).json({ error: err.message }); // Handle errors (e.g., stock error)
  }
};

// PUT /api/cart/update → Update the quantity of a product in the cart
exports.updateCartItem = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId, quantity } = req.body;

    await Cart.updateCartItem(userId, productId, quantity); // Run UPDATE SQL query

    res.status(200).json({ message: "Cart item updated successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/cart/remove → Remove a product from the cart
exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.body;

    await Cart.removeCartItem(userId, productId); // Run DELETE SQL query

    res.status(200).json({ message: "Product removed from cart." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
