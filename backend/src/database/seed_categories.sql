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
('T-Shirts', 4), ('Shirts', 4), ('Sweaters', 4),
('Jeans', 5), ('Pants', 5),
('Watches', 7), ('Bags', 7), ('Hats', 7);

-- Subcategories under "Women"
INSERT INTO categories (name, parent_category_id)
VALUES
('Tops', 2), ('Bottoms', 2), ('Shoes', 2), ('Accessories', 2);

-- Further subcategories under "Women"
INSERT INTO categories (name, parent_category_id)
VALUES
('T-Shirts', 9), ('Shirts', 9),
('Jeans', 10), ('Pants', 10),
('Watches', 12), ('Bags', 12), ('Hats', 12);

-- Subcategories under "Kids"
INSERT INTO categories (name, parent_category_id)
VALUES
('Tops', 3), ('Bottoms', 3), ('Shoes', 3), ('Accessories', 3);

-- Further subcategories under "Kids"
INSERT INTO categories (name, parent_category_id)
VALUES
('T-Shirts', 14), ('Shirts', 14),
('Jeans', 15), ('Pants', 15),
('Watches', 17), ('Bags', 17), ('Hats', 17);
