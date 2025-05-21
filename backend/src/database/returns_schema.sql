CREATE TABLE IF NOT EXISTS returns (
  return_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id BIGINT UNSIGNED NOT NULL,
  user_id INT,
  refund_amount DECIMAL(10,2),
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
);