USE fashion_ecommerce;

-- Inserting products example
INSERT INTO products (serial_number, name, description, price, category_id, material, image_url, stock_quantity, warranty_status, distributor_info)
VALUES
('SN11111', 'Cotton T-Shirt', 'Premium cotton t-shirt', 19.99, 5, 'Cotton', 'tshirt.jpg', 300, '1 Year', 'Distributor A'),
('SN22222', 'Denim Jeans', 'Trendy dark blue denim jeans', 49.99, 6, 'Denim', 'jeans.jpg', 200, '2 Years', 'Distributor B');

-- Inserting product variations example
INSERT INTO product_variations (product_id, serial_number, size_id, color_id, stock_quantity)
VALUES
(1, 'SN11111-1', 1, 1, 100), (1, 'SN11111-2', 1, 2, 150), (1, 'SN11111-3', 2, 1, 50), (1, 'SN11111-4', 2, 2, 80),
(2, 'SN22222-1', 3, 1, 30), (2, 'SN22222-2', 3, 2, 45);