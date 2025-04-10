const express = require("express");
const router = express.Router();

// Import route modules
const authRoutes = require("./authRoutes");
const cartRoutes = require("./cartRoutes");

// Mount authentication-related routes under /auth
router.use("/auth", authRoutes);

// Mount cart-related routes under /cart
router.use("/cart", cartRoutes);

// Export the combined routes to be used in the main server file
module.exports = router;
