USE fashion_ecommerce;

-- inserting products
-- Men
INSERT IGNORE INTO products (serial_number, name, description, price, category_id, material, image_url, stock_quantity, warranty_status, distributor_info) VALUES
('SN10', 'Cotton T-Shirt', 'Premium cotton t-shirt', 19.99, 5, 'Cotton', 'url_SN10', 300, '1 Year', 'Dist1'), -- category_id: 5 (T-Shirts)
('SN11', 'Cargo Pants', 'Multi-functional neutral cargo pants', 45.00, 9, 'Cotton', 'url_SN11', 220, '1 Year', 'Dist3'), -- category_id: 9 (Jeans)
('SN12', 'Leather Boots', 'High quality leather boots', 75.00, 14, 'Leather', 'url_SN12', 300, 'Lifetime', 'DistL'), -- category_id: 14 (Boots)
('SN13', 'Wrist Watch', 'Premium wrist watch', 60.00, 17, 'Steel', 'url_SN13', 30, 'Lifetime', 'DistJ'), -- category_id: 17 (Watches)
('SN14', 'Steel Ring Set', '5 piece stainless steel ring set', 54.99, 21, 'Steel', 'url_SN14', 100, 'Lifetime', 'DistJ'); -- category_id: 21 (Jewellery)

-- Women
INSERT IGNORE INTO products (serial_number, name, description, price, category_id, material, image_url, stock_quantity, warranty_status, distributor_info) VALUES
('SN20', 'Floral Shirt', 'Floral patterned short sleeve shirt', 24.99, 6, 'Viscose', 'url_SN20', 125, '6 Months', 'Dist2'), -- category_id: 6 (Shirts)
('SN21', 'Fitted Jacket', 'Fitted jacket with pocket detailed lining', 44.99, 8, 'Polyester', 'url_SN21', 175, '6 Months', 'Dist5'), -- category_id: 8 (Jackets)
('SN22', 'Maxi Skirt', 'Maxi skirt with polka dot pattern', 39.99, 12, 'Cotton', 'url_SN22', 200, '1 Year', 'DistP'), -- category_id: 12 (Skirts)
('SN23', 'Light Wash Jeans', 'Light wash skinny denim jeans', 45.99, 9, 'Denim', 'url_SN23', 250, '2 Years', 'DistD'), -- category_id: 9 (Jeans)
('SN24', 'Metallic High Heels', 'High Heels with a reflective coating', 65.00, 16, 'Faux Leather', 'url_SN24', 200, '1 Year', 'DistS'); -- category_id: 16 (Heels)

-- Kids
INSERT IGNORE INTO products (serial_number, name, description, price, category_id, material, image_url, stock_quantity, warranty_status, distributor_info) VALUES
('SN30', 'Tie-Dye Cotton T-Shirt', 'Premium cotton t-shirt with tie dye effect', 21.00, 5, 'Cotton', 'url_SN30', 125, '1 Year', 'DistK'), -- category_id: 5 (T-Shirts)
('SN31', 'Denim Shorts', 'Denim shorts with patches', 34.99, 11, 'Denim', 'url_SN31', 125, '6 Months', 'DistD'), -- category_id: 11 (Shorts)
('SN32', 'Wool Sweater', 'Premium wool sweater', 40.00, 7, 'Wool', 'url_SN32', 225, '1 Year', 'DistT'), -- category_id: 7 (Sweaters)
('SN33', 'Sporty Sandals', 'Active wear sport sandals', 50.00, 15, 'Mesh', 'url_SN33', 300, '1 Year', 'DistS'), -- category_id: 15 (Sandals)
('SN34', 'Glittery Bucket Hat', 'Bucket Hat with glittery fabric', 24.99, 19, 'Canvas', 'url_SN34', 100, '1 Year', 'DistH'); -- category_id: 19 (Hats)