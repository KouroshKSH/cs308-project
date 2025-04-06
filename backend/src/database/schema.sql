CREATE DATABASE IF NOT EXISTS fashion_ecommerce;
USE fashion_ecommerce;

CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('customer', 'salesManager', 'productManager') DEFAULT 'customer',
    address VARCHAR(255),
    phone_number VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- self-referencing categories table
CREATE TABLE IF NOT EXISTS categories (
    category_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    parent_category_id BIGINT UNSIGNED NULL,
    FOREIGN KEY (parent_category_id) REFERENCES categories(category_id) ON DELETE CASCADE
);

-- products table
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

-- sizes table
CREATE TABLE IF NOT EXISTS sizes (
    size_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

-- colors table
CREATE TABLE IF NOT EXISTS colors (
    color_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

-- product variations table
CREATE TABLE IF NOT EXISTS product_variations (
    variation_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT UNSIGNED NOT NULL,
    serial_number VARCHAR(255) UNIQUE NOT NULL,
    size_id BIGINT UNSIGNED NOT NULL,
    color_id BIGINT UNSIGNED NOT NULL,
    stock_quantity INT UNSIGNED DEFAULT 0,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    FOREIGN KEY (size_id) REFERENCES sizes(size_id),
    FOREIGN KEY (color_id) REFERENCES colors(color_id)
);

-- cart table 
CREATE TABLE cart (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  productId BIGINT UNSIGNED NOT NULL,
  quantity INT UNSIGNED NOT NULL,
  UNIQUE KEY unique_cart_item (userId, productId),
  FOREIGN KEY (userId) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (productId) REFERENCES products(product_id) ON DELETE CASCADE
);


--for testing postman
INSERT INTO products (
  product_id, name, stock_quantity, price, serial_number, category_id
)
VALUES (
  61, 'tsforması', 10, 199.99, 'SN-TRABZON-61', 1
);




INSERT INTO cart (userId, productId, quantity)
VALUES (1, 2, 3);

INSERT INTO cart (userId, productId, quantity)
VALUES (1, 4, 1);


INSERT INTO cart (userId, productId, quantity)
VALUES (2, 2, 2);

-- Inserting Main Categories
INSERT INTO categories (name)
VALUES
('Men'),   -- category_id: 1
('Women'), -- category_id: 2
('Kids');  -- category_id: 3

-- Inserting subcategories under "Men"
INSERT INTO categories (name, parent_category_id)
VALUES
('Tops', 1), ('Bottoms', 1), ('Shoes', 1), ('Accessories', 1);

-- Further subcategories under "Men"
INSERT INTO categories (name, parent_category_id)
VALUES
('T-Shirts', 4), ('Shirts', 4), ('Sweaters', 4), ('Jackets', 4),
('Jeans', 5), ('Pants', 5), ('Shorts', 5), 
('Sneakers', 6), ('Boots', 6), ('Sandals', 6),
('Watches', 7), ('Bags', 7), ('Hats', 7), ('Glasses', 7), ('Jewellery', 7);

-- Subcategories under "Women"
INSERT INTO categories (name, parent_category_id)
VALUES
('Tops', 2), ('Bottoms', 2), ('Shoes', 2), ('Accessories', 2);

-- Further subcategories under "Women"
INSERT INTO categories (name, parent_category_id)
VALUES
('T-Shirts', 23), ('Shirts', 23), ('Sweaters', 23), ('Jackets', 23),
('Jeans', 24), ('Pants', 24), ('Shorts', 24), ('Skirts', 24),
('Sneakers', 25), ('Boots', 25), ('Sandals', 25), ('Heels', 25), 
('Watches', 26), ('Bags', 26), ('Hats', 26), ('Glasses', 26), ('Jewellery', 26);

-- Subcategories under "Kids"
INSERT INTO categories (name, parent_category_id)
VALUES
('Tops', 3), ('Bottoms', 3), ('Shoes', 3), ('Accessories', 3);

-- Further subcategories under "Kids"
INSERT INTO categories (name, parent_category_id)
VALUES
('T-Shirts', 44), ('Shirts', 44), ('Sweaters', 44), ('Jackets', 44), 
('Jeans', 45), ('Pants', 45), ('Shorts', 45), ('Skirts', 45),
('Sneakers', 46), ('Boots', 46), ('Sandals', 46), 
('Watches', 47), ('Bags', 47), ('Hats', 47), ('Glasses', 47), ('Jewellery', 47); 
