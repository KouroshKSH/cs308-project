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
('T-Shirts', 9), ('Shirts', 9), ('Sweaters', 9), ('Jackets', 9),
('Jeans', 10), ('Pants', 10), ('Shorts', 10), ('Skirts', 10), 
('Sneakers', 11), ('Boots', 11), ('Sandals', 11), ('Heels', 11), 
('Watches', 12), ('Bags', 12), ('Hats', 12), ('Glasses', 12), ('Jewellery', 12);

-- Subcategories under "Kids"
INSERT INTO categories (name, parent_category_id)
VALUES
('Tops', 3), ('Bottoms', 3), ('Shoes', 3), ('Accessories', 3);

-- Further subcategories under "Kids"
INSERT INTO categories (name, parent_category_id)
VALUES
('T-Shirts', 14), ('Shirts', 14), ('Sweaters', 14), ('Jackets', 14),
('Jeans', 15), ('Pants', 15), ('Shorts', 15), ('Skirts', 15), 
('Sneakers', 16), ('Boots', 16), ('Sandals', 16),
('Watches', 17), ('Bags', 17), ('Hats', 17), ('Glasses', 17), ('Jewellery', 17);
