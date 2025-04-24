const express = require("express");
const router = express.Router();

// Import route modules
const authRoutes = require("./authRoutes");
const cartRoutes = require("./cartRoutes");
const productRoutes = require("./productRoutes");
const orderRoutes = require("./orderRoutes");
const orderItemRoutes = require("./orderItemRoutes");
const returnsRoutes = require("./returnsRoutes");
const deliveriesRoutes = require("./deliveriesRoutes");

// Mount authentication-related routes under /auth
router.use("/auth", authRoutes);

// Mount cart-related routes under /cart
router.use("/cart", cartRoutes);

// Mount product-related routes under /products
router.use("/products", productRoutes);

// Mount order-related routes under /orders
router.use("/orders", orderRoutes);

// Mount order item-related routes under /order-items
router.use("/order-items", orderItemRoutes);

// Mount returns-related routes under /returns
router.use("/returns", returnsRoutes);

// Mount deliveries-related routes under /deliveries
router.use("/deliveries", deliveriesRoutes);

module.exports = router;