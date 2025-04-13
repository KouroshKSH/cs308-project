-- Create the database and use it
CREATE DATABASE IF NOT EXISTS fashion_ecommerce;
USE fashion_ecommerce;

-- Run all schema files
-- do NOT include any files regarding insertion
-- that should be handled separately
SOURCE users_schema.sql;
SOURCE categories_schema.sql;
SOURCE products_schema.sql;
SOURCE sizes_schema.sql;
SOURCE colors_schema.sql;
SOURCE product_variations_schema.sql;
