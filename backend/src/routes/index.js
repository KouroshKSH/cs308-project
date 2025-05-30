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
const userRoutes = require("./userRoutes");
const reviewsRoutes = require("./reviewsRoutes");
const wishlistRoutes = require("./wishlistRoutes");
const salesCampaignRoutes = require("./salesCampaignRoutes");
const productVariationsRoutes = require("./productVariationsRoutes");
const categoryRoutes = require("./categoryRoutes");

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

//  Mount user-related routes under /users
router.use("/user", userRoutes);

// Mount review-related routes under /reviews
router.use("/reviews", reviewsRoutes);

// Mount wishlist-related routes under /wishlist
router.use("/wishlist", wishlistRoutes);

// Mount sales campaign-related routes under /sales-campaigns
router.use("/sales-campaigns", salesCampaignRoutes);

// Mount product variations-related routes under /product-variations
router.use("/product-variations", productVariationsRoutes);

// Mount category-related routes under /categories
router.use("/categories", categoryRoutes);

module.exports = router;