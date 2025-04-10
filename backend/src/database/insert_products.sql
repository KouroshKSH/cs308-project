USE fashion_ecommerce;

-- Inserting sizes
INSERT IGNORE INTO sizes (name)
VALUES
('Extra Small'),  -- size_id: 1
('Small'),  -- size_id: 2
('Medium'), -- size_id: 3
('Large'),  -- size_id: 4
('Extra Large'), -- size_id: 5
('Standart'), -- size_id: 6
('25-27'), -- size_id: 7
('28-30'), -- size_id: 8
('31-34'), -- size_id: 9
('35-37'), -- size_id: 10
('38'), -- size_id: 11
('39'), -- size_id: 12
('40'), -- size_id: 13
('41'), -- size_id: 14
('42'), -- size_id: 15
('43'), -- size_id: 16
('44'), -- size_id: 17
('45'); -- size_id: 18



-- Inserting colors
INSERT IGNORE INTO colors (name)
VALUES
('Red'), -- color_id: 1
('Orange'), -- color_id: 2
('Yellow'), -- color_id: 3
('Green'), -- color_id: 4
('Blue'), -- color_id: 5
('Pink'), -- color_id: 6
('Purple'), -- color_id: 7
('Black'), -- color_id: 8
('Gray'), -- color_id: 9
('Brown'), -- color_id: 10
('White'), -- color_id: 11
('Multiple Colors'); -- color_id: 12


-- inserting products
-- Men (department_id = 1)
INSERT IGNORE INTO products (serial_number, name, description, price, department_id, category_id, material, image_url, stock_quantity, warranty_status, distributor_info, popularity_score) VALUES
('SN10', 'Cotton T-Shirt', 'Premium cotton t-shirt', 19.99, 1, 5, 'Cotton', 'url_SN10', 300, '1 Year', 'Dist1', 0.000), -- category_id: 5 (T-Shirts)
('SN11', 'Cargo Pants', 'Multi-functional neutral cargo pants', 45.00, 1, 9, 'Cotton', 'url_SN11', 220, '1 Year', 'Dist3', 0.000), -- category_id: 9 (Jeans)
('SN12', 'Leather Boots', 'High quality leather boots', 75.00, 1, 14, 'Leather', 'url_SN12', 300, 'Lifetime', 'DistL', 0.000), -- category_id: 14 (Boots)
('SN13', 'Wrist Watch', 'Premium wrist watch', 60.00, 1, 17, 'Steel', 'url_SN13', 30, 'Lifetime', 'DistJ', 0.000), -- category_id: 17 (Watches)
('SN14', 'Steel Ring Set', '5 piece stainless steel ring set', 54.99, 1, 21, 'Steel', 'url_SN14', 100, 'Lifetime', 'DistJ', 0.000); -- category_id: 21 (Jewellery)

-- Women (department_id = 2)
INSERT IGNORE INTO products (serial_number, name, description, price, department_id, category_id, material, image_url, stock_quantity, warranty_status, distributor_info, popularity_score) VALUES
('SN20', 'Floral Shirt', 'Floral patterned short sleeve shirt', 24.99, 2, 6, 'Viscose', 'url_SN20', 125, '6 Months', 'Dist2', 0.000), -- category_id: 6 (Shirts)
('SN21', 'Fitted Jacket', 'Fitted jacket with pocket detailed lining', 44.99, 2, 8, 'Polyester', 'url_SN21', 175, '6 Months', 'Dist5', 0.000), -- category_id: 8 (Jackets)
('SN22', 'Maxi Skirt', 'Maxi skirt with polka dot pattern', 39.99, 2, 12, 'Cotton', 'url_SN22', 200, '1 Year', 'DistP', 0.000), -- category_id: 12 (Skirts)
('SN23', 'Light Wash Jeans', 'Light wash skinny denim jeans', 45.99, 2, 9, 'Denim', 'url_SN23', 250, '2 Years', 'DistD', 0.000), -- category_id: 9 (Jeans)
('SN24', 'Metallic High Heels', 'High Heels with a reflective coating', 65.00, 2, 16, 'Faux Leather', 'url_SN24', 200, '1 Year', 'DistS', 0.000); -- category_id: 16 (Heels)

-- Kids (department_id = 3)
INSERT IGNORE INTO products (serial_number, name, description, price, department_id, category_id, material, image_url, stock_quantity, warranty_status, distributor_info, popularity_score) VALUES
('SN30', 'Tie-Dye Cotton T-Shirt','Premium cotton t-shirt with tie dye effect', 21.00, 3, 5, 'Cotton', 'url_SN30', 125, '1 Year', 'DistK', 0.000), -- category_id: 5 (T-Shirts)
('SN31', 'Denim Shorts', 'Denim shorts with patches', 34.99, 3, 11, 'Denim', 'url_SN31', 125, '6 Months', 'DistD', 0.000), -- category_id: 11 (Shorts)
('SN32', 'Wool Sweater', 'Premium wool sweater', 40.00, 3, 7, 'Wool', 'url_SN32', 225, '1 Year', 'DistT', 0.000), -- category_id: 7 (Sweaters)
('SN33', 'Sporty Sandals', 'Active wear sport sandals', 50.00, 3, 15, 'Mesh', 'url_SN33', 300, '1 Year', 'DistS', 0.000), -- category_id: 15 (Sandals)
('SN34', 'Glittery Bucket Hat', 'Bucket Hat with glittery fabric', 24.99, 3, 19, 'Canvas', 'url_SN34', 100, '1 Year', 'DistH', 0.000); -- category_id: 19 (Hats)


-- Some product variations
INSERT INTO product_variations (product_id, serial_number, size_id, color_id, stock_quantity)
VALUES
(1, 'SN10-1', 2, 1, 100), (1, 'SN10-2', 3, 5, 150), (1, 'SN10-3', 5, 8, 50), (1, 'SN10-4', 5, 2, 0),-- mens tshirt
(10, 'SN24-1', 11, 9, 100), (10, 'SN24-2', 13, 12, 91), (10, 'SN24-3', 12, 1, 9),-- womens high heel
(15, 'SN34-1', 6, 11, 45), (15, 'SN34-2', 6, 12, 50), (15, 'SN34-3', 6, 3, 5); -- kids bucket hat

