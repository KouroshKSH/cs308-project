CREATE TABLE IF NOT EXISTS deliveries (
  delivery_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id BIGINT UNSIGNED NOT NULL,
  delivery_address VARCHAR(255),
  shipped_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  delivery_status ENUM('pending', 'shipped', 'delivered') DEFAULT 'pending',
  tracking_number VARCHAR(255) NULL,
  FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
);