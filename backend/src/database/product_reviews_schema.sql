CREATE TABLE IF NOT EXISTS product_reviews (
    review_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT UNSIGNED NOT NULL,
    user_id INT,  -- match users.user_id type exactly, otherwise error
    rating TINYINT UNSIGNED CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
);
-- The product_reviews table stores reviews for products, including the user who made the review, the rating given, and any comments.
-- A user can leave a comment, or a rating, or both. 
-- The rating is a number between 1 and 5, where 1 is the lowest and 5 is the highest.
-- There are no emojis or special characters in the comments to avoid possible SQL bugs.