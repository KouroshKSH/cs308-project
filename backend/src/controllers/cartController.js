// backend/src/controllers/cartController.js
const Cart = require("../models/cart");

exports.getCart = async (req, res) => {
  try {
    // Get the authenticated user's ID from the decoded token
    const userId = req.user.userId;

    // Retrieve the cart items for the user from the database
    const cart = await Cart.getCartByUserId(userId);

    // Return the cart contents
    res.status(200).json(cart);
  } catch (err) {
    // Handle unexpected errors
    res.status(500).json({ error: err.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    // Log the decoded user info (optional for debugging)
    console.log("👤 decoded user:", req.user);

    // Extract userId from the JWT payload
    const userId = req.user.userId;
    console.log("userId:", userId);

    // Extract productId and quantity from the request body
    const { productId, quantity } = req.body;

    // Add the product to the user's cart, or update quantity if it already exists
    await Cart.addOrUpdateCartItem(userId, productId, quantity);

    // Send success response
    res.status(200).json({ message: "Product added to cart." });
  } catch (err) {
    // Handle validation or logical errors
    res.status(400).json({ error: err.message });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    // Get the authenticated user's ID
    const userId = req.user.userId;

    // Get productId and the new quantity from the request body
    const { productId, quantity } = req.body;

    // Update the quantity of the specific product in the cart
    await Cart.updateCartItem(userId, productId, quantity);

    // Send success message
    res.status(200).json({ message: "Cart item updated successfully." });
  } catch (err) {
    // Handle unexpected errors
    res.status(500).json({ error: err.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    // Get the authenticated user's ID
    const userId = req.user.userId;

    // Get the productId to be removed from the cart
    const { productId } = req.body;

    // Remove the product from the user's cart
    await Cart.removeCartItem(userId, productId);

    // Send success response
    res.status(200).json({ message: "Product removed from cart." });
  } catch (err) {
    // Handle unexpected errors
    res.status(500).json({ error: err.message });
  }
};
