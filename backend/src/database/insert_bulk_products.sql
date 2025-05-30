USE fashion_ecommerce;

-- inserting products
-- Men (department_id = 1)
INSERT IGNORE INTO products (serial_number, name, description, price, department_id, category_id, material, image_url, stock_quantity, warranty_status, distributor_info, popularity_score) VALUES
('SN10', 'Cotton T-Shirt', 'Premium cotton t-shirt', 19.99, 1, 8, 'Cotton', 'url_SN10', 300, '1 Year', 'Dist1', RAND() * 10), -- category_id: 8 (Men's T-Shirts)
('SN11', 'Cargo Pants', 'Multi-functional neutral cargo pants', 45.00, 1, 13, 'Cotton', 'url_SN11', 220, '1 Year', 'Dist3', RAND() * 10), -- category_id: 13 (Men's Pants)
('SN12', 'Leather Boots', 'High quality leather boots', 75.00, 1, 16, 'Leather', 'url_SN12', 300, 'Lifetime', 'DistL', RAND() * 10), -- category_id: 16 (Men's Boots)
('SN13', 'Wrist Watch', 'Premium wrist watch', 60.00, 1, 18, 'Steel', 'url_SN13', 30, 'Lifetime', 'DistJ', RAND() * 10), -- category_id: 18 (Men's Watches)
('SN14', 'Steel Ring Set', '5 piece stainless steel ring set', 54.99, 1, 22, 'Steel', 'url_SN14', 100, 'Lifetime', 'DistJ', RAND() * 10); -- category_id: 22 (Men's Jewellery)

-- Women (department_id = 2)
INSERT IGNORE INTO products (serial_number, name, description, price, department_id, category_id, material, image_url, stock_quantity, warranty_status, distributor_info, popularity_score) VALUES
('SN20', 'Floral Shirt', 'Floral patterned short sleeve shirt', 24.99, 2, 28, 'Viscose', 'url_SN20', 125, '6 Months', 'Dist2', RAND() * 10), -- category_id: 28 (Women's Shirts)
('SN21', 'Fitted Jacket', 'Fitted jacket with pocket detailed lining', 44.99, 2, 30, 'Polyester', 'url_SN21', 175, '6 Months', 'Dist5', RAND() * 10), -- category_id: 30 (Women's Jackets)
('SN22', 'Maxi Skirt', 'Maxi skirt with polka dot pattern', 39.99, 2, 34, 'Cotton', 'url_SN22', 200, '1 Year', 'DistP', RAND() * 10), -- category_id: 34 (Women's Skirts)
('SN23', 'Light Wash Jeans', 'Light wash skinny denim jeans', 45.99, 2, 31, 'Denim', 'url_SN23', 250, '2 Years', 'DistD', RAND() * 10), -- category_id: 31 (Women's Jeans)
('SN24', 'Metallic High Heels', 'High Heels with a reflective coating', 65.00, 2, 38, 'Faux Leather', 'url_SN24', 200, '1 Year', 'DistS', RAND() * 10); -- category_id: 38 (Women's Heels)

-- Kids (department_id = 3)
INSERT IGNORE INTO products (serial_number, name, description, price, department_id, category_id, material, image_url, stock_quantity, warranty_status, distributor_info, popularity_score) VALUES
('SN30', 'Tie-Dye Cotton T-Shirt', 'Premium cotton t-shirt with tie dye effect', 21.00, 3, 48, 'Cotton', 'url_SN30', 125, '1 Year', 'DistK', RAND() * 10), -- category_id: 48 (Kid's T-Shirts)
('SN31', 'Denim Shorts', 'Denim shorts with patches', 34.99, 3, 54, 'Denim', 'url_SN31', 125, '6 Months', 'DistD', RAND() * 10), -- category_id: 54 (Kid's Shorts)
('SN32', 'Wool Sweater', 'Premium wool sweater', 40.00, 3, 50, 'Wool', 'url_SN32', 225, '1 Year', 'DistT', RAND() * 10), -- category_id: 50 (Kid's Sweaters)
('SN33', 'Sporty Sandals', 'Active wear sport sandals', 50.00, 3, 58, 'Mesh', 'url_SN33', 300, '1 Year', 'DistS', RAND() * 10), -- category_id: 58 (Kid's Sandals)
('SN34', 'Glittery Bucket Hat', 'Bucket Hat with glittery fabric', 24.99, 3, 61, 'Canvas', 'url_SN34', 100, '1 Year', 'DistH', RAND() * 10); -- category_id: 61 (Kid's Hats)