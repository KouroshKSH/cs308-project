const ProductVariations = require("../models/productVariations");

const productVariationsController = {
  // GET /api/product-variations?product_id=...
  async getAll(req, res) {
    try {
        const { product_id } = req.query;
        // for logging
        console.log("product_id", product_id);
        
        const variations = await ProductVariations.getAll(product_id);
        // for logging
        console.log("variations", variations);
        
        res.json(variations);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch product variations" });
    }
  },

  // GET /api/product-variations/product-ids
  async getAllProductIds(req, res) {
    try {
      const ids = await ProductVariations.getAllProductIds();
      res.json(ids);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch product IDs" });
    }
  },

  // PUT /api/product-variations/:variation_id/stock
  async updateStock(req, res) {
    try {
      const { variation_id } = req.params;
      const { stock_quantity } = req.body;
      if (!Number.isInteger(stock_quantity) || stock_quantity <= 0) {
        return res.status(400).json({ message: "Stock quantity must be a positive integer" });
      }
      const ok = await ProductVariations.updateStock(variation_id, stock_quantity);
      if (!ok) return res.status(404).json({ message: "Variation not found" });
      res.json({ message: "Stock updated" });
    } catch (err) {
      res.status(500).json({ message: "Failed to update stock" });
    }
  }
};

module.exports = productVariationsController;