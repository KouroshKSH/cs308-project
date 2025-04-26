-- cart table
CREATE TABLE IF NOT EXISTS carts (
  cart_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT, -- null-able for anonymous carts
  session_id VARCHAR(255), -- for anonymous carts
  product_id BIGINT UNSIGNED NOT NULL,
  variation_id BIGINT UNSIGNED NOT NULL, -- can't add a product without specifying a variation
  quantity INT UNSIGNED NOT NULL,
  UNIQUE KEY unique_cart_item (user_id, session_id, product_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
  FOREIGN KEY (variation_id) REFERENCES product_variations(variation_id) ON DELETE CASCADE
);