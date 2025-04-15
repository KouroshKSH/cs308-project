UPDATE products
SET popularity_score = RAND() * 10;
-- This SQL statement updates the popularity_score of all products in the products table to a random value between 0 and 10.
-- The actual popularity calculation methods will be done later.