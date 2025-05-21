const db = require('../config/database');

const ProductVariations = {
  increaseStock: async (variation_id, quantity) => {
    await db.execute(
      "UPDATE product_variations SET stock_quantity = stock_quantity + ? WHERE variation_id = ?",
      [quantity, variation_id]
    );
  }
};

module.exports = ProductVariations;