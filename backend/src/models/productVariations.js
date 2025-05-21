const db = require('../config/database');

const ProductVariations = {
  // Get all product variations, optionally filtered by product_id
  async getAll(product_id = null) {
    let query = `
      SELECT pv.variation_id, pv.product_id, p.name AS product_name, pv.size_id, pv.color_id, pv.stock_quantity
      FROM product_variations pv
      JOIN products p ON pv.product_id = p.product_id
    `;
    const params = [];
    if (product_id) {
      query += " WHERE pv.product_id = ?";
      params.push(product_id);
    }
    query += " ORDER BY pv.product_id, pv.variation_id";
    const [rows] = await db.query(query, params);
    return rows;
  },

  // Get all unique product IDs and names
  async getAllProductIds() {
    const [rows] = await db.query(
      "SELECT DISTINCT p.product_id, p.name FROM products p JOIN product_variations pv ON p.product_id = pv.product_id ORDER BY p.product_id"
    );
    return rows;
  },

  // Update stock quantity for a variation
  async updateStock(variation_id, new_quantity) {
    const [result] = await db.query(
      "UPDATE product_variations SET stock_quantity = ? WHERE variation_id = ?",
      [new_quantity, variation_id]
    );
    return result.affectedRows > 0;
  },

  // Increase stock quantity for a variation
  increaseStock: async (variation_id, quantity) => {
    await db.execute(
      "UPDATE product_variations SET stock_quantity = stock_quantity + ? WHERE variation_id = ?",
      [quantity, variation_id]
    );
  }
};

module.exports = ProductVariations;