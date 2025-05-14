CREATE EVENT IF NOT EXISTS update_popularity_daily
ON SCHEDULE EVERY 1 DAY
STARTS CURRENT_TIMESTAMP
DO
  UPDATE products p
  LEFT JOIN (
    SELECT 
      product_id,
      COUNT(*) AS comment_count,
      AVG(rating) AS avg_rating,
      MAX(created_at) AS latest_comment_date
    FROM product_reviews
    WHERE comment_approval = 'approved'
    GROUP BY product_id
  ) r ON p.product_id = r.product_id
  SET 
    p.popularity_score = (IFNULL(r.avg_rating, 0) * 1.5) + 
                         (IFNULL(r.comment_count, 0) * 0.1) * 
                         EXP(-0.02 * DATEDIFF(NOW(), IFNULL(r.latest_comment_date, NOW())));
