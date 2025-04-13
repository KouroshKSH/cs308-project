USE fashion_ecommerce;

-- Inserting Main Categories
INSERT INTO categories (name)
VALUES
('Men'),   -- category_id: 1
('Women'), -- category_id: 2
('Kids');  -- category_id: 3

-- Inserting subcategories under "Men"
INSERT INTO categories (name, parent_category_id)
VALUES
('Tops', 1), ('Bottoms', 1), ('Shoes', 1), ('Accessories', 1); -- ids : 4,5,6,7

-- Further subcategories under "Men"
INSERT INTO categories (name, parent_category_id)
VALUES
('T-Shirts', 4), ('Shirts', 4), ('Sweaters', 4), ('Jackets', 4), -- ids: 8,9,10,11
('Jeans', 5), ('Pants', 5), ('Shorts', 5), -- ids: 12,13,14
('Sneakers', 6), ('Boots', 6), ('Sandals', 6), -- ids: 15,16,17
('Watches', 7), ('Bags', 7), ('Hats', 7), ('Glasses', 7), ('Jewellery', 7); -- ids: 18,19,20,21,22

-- Subcategories under "Women"
INSERT INTO categories (name, parent_category_id)
VALUES
('Tops', 2), ('Bottoms', 2), ('Shoes', 2), ('Accessories', 2); -- ids: 23,24,25,26

-- Further subcategories under "Women"
INSERT INTO categories (name, parent_category_id)
VALUES
('T-Shirts', 23), ('Shirts', 23), ('Sweaters', 23), ('Jackets', 23), -- ids: 27,28,29,30
('Jeans', 24), ('Pants', 24), ('Shorts', 24), ('Skirts', 24),  -- ids: 31,32,33,34
('Sneakers', 25), ('Boots', 25), ('Sandals', 25), ('Heels', 25),  -- ids: 35,36,37,38
('Watches', 26), ('Bags', 26), ('Hats', 26), ('Glasses', 26), ('Jewellery', 26);  -- ids: 39,40,41,42,43

-- Subcategories under "Kids"
INSERT INTO categories (name, parent_category_id)
VALUES
('Tops', 3), ('Bottoms', 3), ('Shoes', 3), ('Accessories', 3);  -- ids: 44,45,46,47

-- Further subcategories under "Kids"
INSERT INTO categories (name, parent_category_id)
VALUES
('T-Shirts', 44), ('Shirts', 44), ('Sweaters', 44), ('Jackets', 44),  -- ids: 48,49,50,51
('Jeans', 45), ('Pants', 45), ('Shorts', 45), ('Skirts', 45),  -- ids:52,53,54,55
('Sneakers', 46), ('Boots', 46), ('Sandals', 46),  -- ids:56,57,58
('Watches', 47), ('Bags', 47), ('Hats', 47), ('Glasses', 47), ('Jewellery', 47);  -- ids:59,60,61,62,63
