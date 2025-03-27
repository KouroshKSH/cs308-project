CREATE TABLE IF NOT EXISTS products (
    product_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    serial_number VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    price DECIMAL(10,2) NOT NULL,
    category_id BIGINT UNSIGNED NOT NULL,
    material VARCHAR(255) NULL,
    image_url VARCHAR(500) NULL,
    stock_quantity INT UNSIGNED DEFAULT 0,
    warranty_status ENUM('No Warranty', '6 Months', '1 Year', '2 Years', 'Lifetime') NOT NULL,
    distributor_info VARCHAR(255) NULL,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE
);
