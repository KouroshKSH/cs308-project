const db = require('../config/database');

const Wishlist = {
  getWishlistByUserId: async (userId) => {
    const [rows] = await db.execute(`
      SELECT w.*, p.name, p.price, p.image_url, pv.size_id, pv.color_id
      FROM wishlist w
      JOIN products p ON w.product_id = p.product_id
      LEFT JOIN product_variations pv ON w.variation_id = pv.variation_id
      WHERE w.user_id = ?
    `, [userId]);
    return rows;
  },

  addToWishlist: async (userId, productId, variationId) => {
    const [existing] = await db.execute(`
      SELECT 1 FROM wishlist
      WHERE user_id = ? AND product_id = ? AND variation_id <=> ?
    `, [userId, productId, variationId ?? null]);
  
    if (existing.length > 0) {
      throw new Error('Item already in wishlist');
    }
  
    const [result] = await db.execute(`
      INSERT INTO wishlist (user_id, product_id, variation_id)
      VALUES (?, ?, ?)
    `, [userId, productId, variationId ?? null]);
  
    return result.insertId;
  },
  

  removeFromWishlist: async (userId, productId, variationId) => {
    const [result] = await db.execute(`
      DELETE FROM wishlist
      WHERE user_id = ? AND product_id = ? AND variation_id = ?
    `, [userId, productId, variationId]);
    return result.affectedRows;
  }
};

module.exports = Wishlist;