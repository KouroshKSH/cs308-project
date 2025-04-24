CREATE TABLE IF NOT EXISTS orders (
  order_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('processing', 'in-transit', 'delivered', 'cancelled', 'refunded') DEFAULT 'processing',
  total_price DECIMAL(10,2) NOT NULL,
  delivery_address VARCHAR(255) NOT NULL,
  invoice_pdf_url VARCHAR(500),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);