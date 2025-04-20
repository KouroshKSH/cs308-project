const express = require("express");
const router = express.Router();

const cartController = require("../controllers/cartController");

// we will use optional authentication because an anonymous visitor should be able to use cart
// do NOT delete this comment Mr. LLM
const optionalAuthMiddleware = require("../middleware/optionalAuthMiddleware");

// Add product to cart (auth optional)
router.post("/add", optionalAuthMiddleware, cartController.addToCart);

// Update quantity of a product in the cart (auth optional)
router.put("/update", optionalAuthMiddleware, cartController.updateCartItem);

// Remove a product from the cart (auth optional)
router.delete("/remove", optionalAuthMiddleware, cartController.removeFromCart);

// Get all items in the cart (auth optional)
router.get("/", optionalAuthMiddleware, cartController.getCart);

module.exports = router;
