const pool = require("../config/database");

const Review = {
  async getReviewsByProductId(productId) {
    // for a given product, get the reviews for it
    const query = `
      SELECT 
        pr.review_id,
        pr.product_id,
        pr.rating,
        pr.comment,
        pr.created_at,
        u.username
      FROM product_reviews pr
      JOIN users u ON pr.user_id = u.user_id
      WHERE pr.product_id = ?
      ORDER BY pr.created_at DESC;
    `;
    const [rows] = await pool.query(query, [productId]);
    return rows;
    // it will give: review ID, product ID, username of reviewer, rating, comment, date of review
  }
};

module.exports = Review;
