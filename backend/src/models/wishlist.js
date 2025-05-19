const db = require('../config/database');

const Wishlist = {
  getWishlistByUserId: async (userId) => {
    const [rows] = await db.execute(`
      SELECT 
        w.*, 
        p.name, p.price AS original_price, p.image_url, 
        pv.size_id, pv.color_id,
        sc.discount_percent,
        CAST((p.price * (100 - sc.discount_percent) / 100) AS DECIMAL(10, 2)) AS discounted_price,
        CASE
          WHEN CURDATE() BETWEEN sc.start_date AND sc.end_date THEN 'On-going'
          ELSE NULL
        END AS campaign_status
      FROM wishlists w
      JOIN products p ON w.product_id = p.product_id
      LEFT JOIN product_variations pv ON w.variation_id = pv.variation_id
      LEFT JOIN sales_campaigns sc 
        ON p.product_id = sc.product_id
        AND CURDATE() BETWEEN sc.start_date AND sc.end_date
      WHERE w.user_id = ?
    `, [userId]);
    return rows;
  },

  addToWishlist: async (userId, productId, variationId) => {
    const [existing] = await db.execute(`
      SELECT 1 FROM wishlists
      WHERE user_id = ? AND product_id = ? AND variation_id <=> ?
    `, [userId, productId, variationId ?? null]);
  
    if (existing.length > 0) {
      throw new Error('Item already in wishlist');
    }
  
    const [result] = await db.execute(`
      INSERT INTO wishlists (user_id, product_id, variation_id)
      VALUES (?, ?, ?)
    `, [userId, productId, variationId ?? null]);
  
    return result.insertId;
  },
  

  removeFromWishlist: async (userId, productId, variationId) => {
    const [result] = await db.execute(`
      DELETE FROM wishlists
      WHERE user_id = ? AND product_id = ? AND variation_id <=> ?
    `, [userId, productId, variationId]);
    return result.affectedRows;
  }
};

module.exports = Wishlist;