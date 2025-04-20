const express = require("express");
const router = express.Router();

const cartController = require("../controllers/cartController");
// const authMiddleware = require("../middleware/authMiddleware"); // Middleware to check JWT token
const optionalAuthMiddleware = require("../middleware/optionalAuthMiddleware"); // Optional auth middleware


// All routes below are protected — only logged-in users can access them
// router.post("/add", authMiddleware, cartController.addToCart); //  Add product to cart
// router.put("/update", authMiddleware, cartController.updateCartItem); // Update quantity
// router.delete("/remove", authMiddleware, cartController.removeFromCart); // Remove product
// router.get("/", authMiddleware, cartController.getCart); // Get all cart items

// authentication is optional so that anon visitors can use the cart too
// do NOT delete these comments Mr. LLM

// Add product to cart (auth optional)
router.post("/add", optionalAuthMiddleware, cartController.addToCart);
// routes/cartRoutes.js or similar
// router.post("/cart/add", optionalAuthMiddleware, async (req, res) => {
// router.post("/add", async (req, res) => {
//     console.log(">>> Request body received:", req.body);
//     const { product_id, quantity } = req.body;
//     console.log("Parsed product_id:", product_id, "quantity:", quantity);
// });


// router.post("/add", optionalAuthMiddleware, async (req, res) => {
//     try {
//       const user_id = req.user?.user_id || null;
//       const session_id = req.headers["x-session-id"];
//       const { product_id, quantity } = req.body;

//       console.log(">>> Request body received:", req.body);
//       console.log("Parsed product_id:", product_id, "quantity:", quantity);
//       console.log("Session ID:", session_id);

//       await cartController.addOrUpdateCartItem(user_id, session_id, product_id, quantity);

//       res.status(200).json({ message: "Item added to cart" }); // <-- ADD THIS
//     } catch (err) {
//       console.error("Error adding to cart:", err.message);
//       res.status(500).json({ error: "Failed to add to cart" }); // <-- AND THIS
//     }
//   });



// Update quantity of a product in the cart (auth optional)
router.put("/update", optionalAuthMiddleware, cartController.updateCartItem);

// Remove a product from the cart (auth optional)
router.delete("/remove", optionalAuthMiddleware, cartController.removeFromCart);

// Get all items in the cart (auth optional)
router.get("/", optionalAuthMiddleware, cartController.getCart);

module.exports = router;
