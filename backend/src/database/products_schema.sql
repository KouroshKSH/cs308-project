CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  serial_number VARCHAR(50),
  name VARCHAR(255),
  description TEXT,
  price DECIMAL(10, 2),
  department_id INT,
  category_id INT,
  material VARCHAR(100),
  image_url VARCHAR(255),
  stock_quantity INT,
  warranty_status VARCHAR(100),
  distributor_info VARCHAR(100),
  popularity_score FLOAT,
  FOREIGN KEY (department_id) REFERENCES departments(id)
);

CREATE TABLE IF NOT EXISTS products (
    product_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    serial_number VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    department_id BIGINT UNSIGNED NOT NULL,
    category_id BIGINT UNSIGNED NOT NULL,
    material VARCHAR(255),
    image_url VARCHAR(500),
    stock_quantity INT UNSIGNED DEFAULT 0,
    warranty_status ENUM('No Warranty', '6 Months', '1 Year', '2 Years', 'Lifetime') NOT NULL,
    distributor_info VARCHAR(255),
    popularity_score DECIMAL(6,3),
    FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE
);
