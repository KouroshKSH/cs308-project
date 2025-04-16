USE fashion_ecommerce;

-- Inserting some product variations
INSERT INTO product_variations (product_id, serial_number, size_id, color_id, stock_quantity)
VALUES
(32, 'SN10-1', 2, 1, 100), (32, 'SN10-2', 3, 5, 150), (32, 'SN10-3', 5, 8, 50), (32, 'SN10-4', 5, 2, 0),-- mens tshirt
(41, 'SN24-1', 11, 9, 100), (41, 'SN24-2', 13, 12, 91), (41, 'SN24-3', 12, 1, 9),-- womens high heel
(46, 'SN34-1', 6, 11, 45), (46, 'SN34-2', 6, 12, 50), (46, 'SN34-3', 6, 3, 5); -- kids bucket hat

