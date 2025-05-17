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

  // for a specific review, update the comment's approval status (manager can do it)
  async updateReviewStatus(reviewId, newStatus) {
    const query = `
      UPDATE product_reviews 
      SET comment_approval = ? 
      WHERE review_id = ?
    `;
    const [result] = await pool.query(query, [newStatus, reviewId]);
    return result;
  },

  // get the reviews and show their status
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
  },

  // make a new review given the user ID, product ID, rating, and comment
  async createReview(userId, productId, rating, comment) {
    // first check if:
    // 1. the person is logged in (userId is not null)
    // 2. the user has purchased the product (check order_items table)
    // 3. the order's status is "delivered" (check orders table)

    // check if the user has already reviewed the product
    const existingReviewQuery =
    `SELECT review_id
      FROM product_reviews
      WHERE user_id = ? AND product_id = ?
    `;
    const [existingReview] = await pool.query(existingReviewQuery, [userId, productId]);
    if (existingReview.length > 0) {
      // let's not allow the user to review the same product multiple times
      throw new Error("You have already reviewed this product");
    }

    // check if user has purchased and
    // received the product (status must be "delivered")
    const checkOrderQuery =
    `SELECT DISTINCT o.order_id, o.status
      FROM orders o
      JOIN order_items oi ON o.order_id = oi.order_id
      WHERE o.user_id = ?
        AND oi.product_id = ?
        AND o.status = 'delivered'
      LIMIT 1
    `;

    const [orderCheck] = await pool.query(checkOrderQuery, [userId, productId]);

    if (!orderCheck.length) {
      // can't review something if it's not delivered
      throw new Error("You can only review products you have purchased and received");
    }

    // If all checks pass, insert the review
    const insertQuery =
    `INSERT INTO product_reviews
      (product_id, user_id, rating, comment, comment_approval, created_at)
      VALUES (?, ?, ?, ?, 'pending', CURRENT_TIMESTAMP)
    `;

    const [result] = await pool.query(insertQuery,
      [
        productId,
        userId,
        rating,
        comment
      ]);

   return result.insertId;
  },

  async updateReview(reviewId, userId, rating, comment) {
    const fields = [];
    const values = [];
  
    if (rating !== undefined) {
      fields.push("rating = ?");
      values.push(rating);
    }
  
    if (comment !== undefined) {
      fields.push("comment = ?");
      values.push(comment);
    }
  
    if (fields.length === 0) {
      throw new Error("Nothing to update.");
    }
  
    // Set approval back to pending and update timestamp
    fields.push("comment_approval = 'pending'");
    fields.push("created_at = CURRENT_TIMESTAMP");
  
    const query = `
      UPDATE product_reviews
      SET ${fields.join(", ")}
      WHERE review_id = ? AND user_id = ?
    `;
  
    values.push(reviewId, userId);
  
    const [result] = await pool.query(query, values);
    return result;
  }  
};

module.exports = Review;
