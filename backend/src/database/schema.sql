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

-- Inserting further subcategories under "Men"
INSERT INTO categories (name, parent_category_id)
VALUES
('T-Shirts', 4), ('Shirts', 4), ('Sweaters', 4),
('Jeans', 5), ('Pants', 5),
('Watches', 7), ('Bags', 7), ('Hats', 7);

-- Inserting subcategories under "Women"
INSERT INTO categories (name, parent_category_id)
VALUES
('Tops', 2), ('Bottoms', 2), ('Shoes', 2), ('Accessories', 2);

-- Inserting further subcategories under "Women"
INSERT INTO categories (name, parent_category_id)
VALUES
('T-Shirts', 9), ('Shirts', 9),
('Jeans', 10), ('Pants', 10),
('Watches', 12), ('Bags', 12), ('Hats', 12);

-- Inserting Subcategories under "Kids"
INSERT INTO categories (name, parent_category_id)
VALUES
('Tops', 3), ('Bottoms', 3), ('Shoes', 3), ('Accessories', 3);

-- Inserting further subcategories under "Kids"
INSERT INTO categories (name, parent_category_id)
VALUES
('T-Shirts', 14), ('Shirts', 14),
('Jeans', 15), ('Pants', 15),
('Watches', 17), ('Bags', 17), ('Hats', 17);