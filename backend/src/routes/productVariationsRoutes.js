const express = require("express");
const router = express.Router();
const controller = require("../controllers/productVariationsController");

// Get all product variations (optionally filter by product_id)
router.get("/", controller.getAll);

// Get all product IDs (for dropdown)
router.get("/product-ids", controller.getAllProductIds);

// Update stock for a variation
router.put("/:variation_id/stock", controller.updateStock);

module.exports = router;