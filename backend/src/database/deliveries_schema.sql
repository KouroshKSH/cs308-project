CREATE TABLE IF NOT EXISTS deliveries (
  delivery_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id BIGINT UNSIGNED NOT NULL,
  shipped_date TIMESTAMP NULL,
  delivery_status ENUM('pending', 'shipped', 'delivered') DEFAULT 'pending',
  FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
);