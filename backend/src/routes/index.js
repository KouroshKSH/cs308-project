const express = require("express");
const router = express.Router();

// Import route modules
const authRoutes = require("./authRoutes");
const cartRoutes = require("./cartRoutes");
const productRoutes = require("./productRoutes");
const searchRoutes = require("./searchRoutes");

// Mount authentication-related routes under /auth
router.use("/auth", authRoutes);

// Mount cart-related routes under /cart
router.use("/cart", cartRoutes);

// Mount product-related routes under /products
router.use("/products", productRoutes);

//Mount search-related routes under /search
router.use("/search", searchRoutes);

module.exports = router;