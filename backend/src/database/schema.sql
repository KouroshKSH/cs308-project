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

-- Inserting Main Categories
INSERT INTO departments (name) VALUES
('Men'),      -- department_id: 1
('Women'),    -- department_id: 2
('Kids');     -- department_id: 3

-- Main clothing categories
INSERT INTO categories (name) VALUES
('Tops'),          -- id: 1
('Bottoms'),       -- id: 2
('Shoes'),         -- id: 3
('Accessories');   -- id: 4

-- Tops subcategories
INSERT INTO categories (name, parent_category_id) VALUES
('T-Shirts', 1),
('Shirts', 1),
('Sweaters', 1),
('Jackets', 1);

-- Bottoms subcategories
INSERT INTO categories (name, parent_category_id) VALUES
('Jeans', 2),
('Pants', 2),
('Shorts', 2),
('Skirts', 2); 

-- Shoes subcategories
INSERT INTO categories (name, parent_category_id) VALUES
('Sneakers', 3),
('Boots', 3),
('Sandals', 3),
('Heels', 3); 

-- Accessories subcategories
INSERT INTO categories (name, parent_category_id) VALUES
('Watches', 4),
('Bags', 4),
('Hats', 4),
('Glasses', 4),
('Jewellery', 4);