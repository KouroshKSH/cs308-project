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
        pr.comment_approval,
        pr.created_at,
        u.username
      FROM product_reviews pr
      JOIN users u ON pr.user_id = u.user_id
      WHERE pr.product_id = ?
      ORDER BY pr.created_at DESC;
    `;
    const [rows] = await pool.query(query, [productId]);
    return rows;
  },

  async updateReviewStatus(reviewId, newStatus) {
    const query = `
      UPDATE product_reviews 
      SET comment_approval = ? 
      WHERE review_id = ?
    `;
    const [result] = await pool.query(query, [newStatus, reviewId]);
    return result;
  },

  async getAllReviewsByStatus(status) {
    let query = `
      SELECT 
        review_id, 
        product_id, 
        user_id, 
        rating, 
        comment, 
        comment_approval 
      FROM product_reviews
    `;
    const params = [];

    if (status !== 'all') {
      query += ` WHERE comment_approval = ?`;
      params.push(status);
    }

    const [rows] = await pool.query(query, params);
    return rows;
  }
};

module.exports = Review;
