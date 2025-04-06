const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const authenticateToken = require("../middleware/authMiddleware");

router.post("/add", authenticateToken, cartController.addToCart);
router.put("/update", authenticateToken, cartController.updateCartItem);
router.delete("/remove", authenticateToken, cartController.removeFromCart);
router.get("/", authenticateToken, cartController.getCart);

module.exports = router;
