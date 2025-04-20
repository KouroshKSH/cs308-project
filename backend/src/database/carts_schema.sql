-- cart table
CREATE TABLE IF NOT EXISTS cart (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT, -- null-able for anonymous carts
  sessionId VARCHAR(255), -- for anonymous carts
  productId BIGINT UNSIGNED NOT NULL,
  quantity INT UNSIGNED NOT NULL,
  UNIQUE KEY unique_cart_item (userId, sessionId, productId),
  FOREIGN KEY (userId) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (productId) REFERENCES products(product_id) ON DELETE CASCADE
);