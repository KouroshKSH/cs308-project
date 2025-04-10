const express = require("express");
const router = express.Router();

const cartController = require("../controllers/cartController");
const authMiddleware = require("../middleware/authMiddleware"); // Middleware to check JWT token

// All routes below are protected — only logged-in users can access them
router.post("/add", authMiddleware, cartController.addToCart); //  Add product to cart
router.put("/update", authMiddleware, cartController.updateCartItem); // Update quantity
router.delete("/remove", authMiddleware, cartController.removeFromCart); // Remove product
router.get("/", authMiddleware, cartController.getCart); // Get all cart items

module.exports = router;
