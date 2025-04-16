USE fashion_ecommerce;

-- Bulk insert for product_reviews

INSERT INTO product_reviews (product_id, user_id, rating, comment) VALUES
-- Men's Department (department_id = 1)
(32, 6, 5, 'This shirt is soft and fits great!'),
(32, 17, 4, 'Decent quality. I might buy again.'),
(32, 19, NULL, 'The material feels okay, nothing special.'),
(33, 11, 5, 'Love the pockets! Super practical.'),
(33, 13, 3, 'Color is not as expected.'),
(33, 17, 2, NULL),
(34, 19, 5, 'These boots are amazing. Durable and stylish!'),
(34, 6, 4, 'Comfortable but took time to break in.'),
(34, 11, 1, 'Sole came off after a few wears. Disappointed.'),
(35, 14, 4, 'Classy look, decent value for money.'),
(35, 15, 3, NULL),
(35, 18, 5, 'Excellent quality. Look better than the photos!'),
(36, 2, 4, 'Very unique design. Feels a bit heavy though.'),
(36, 19, NULL, 'Nice set, would recommend to others.');

-- Women's Department (department_id = 2)
INSERT INTO product_reviews (product_id, user_id, rating, comment) VALUES
(37, 15, 5, 'GORGEOUS shirt! Perfect fit.'),
(37, 16, 4, 'Colors pop just like in the pictures.'),
(37, 20, 2, 'Did not suit me as I hoped.'),
(37, 2, NULL, 'Soft and breathable material.'),
(38, 12, 5, 'Very stylish and warm. Love it!'),
(38, 16, 4, 'Great jacket for spring.'),
(38, 11, NULL, 'Good quality, sleeves are a bit short.'),
(39, 16, 5, 'This skirt flows beautifully when you walk!'),
(39, 18, 3, 'Nice design, but sizing runs large.'),
(39, 14, 4, NULL),
(40, 20, 5, 'Best purchase this season!'),
(40, 3, 3, 'Average quality. Stitching could be better.'),
(40, 14, 5, 'Looks great and fits like a glove.'),
(41, 15, 2, 'Too high for daily wear.'),
(41, 9, NULL, 'Gorgeous but not super comfy.'),
(41, 18, 4, 'Great for parties!!');

-- Kids Department (department_id = 3)
INSERT INTO product_reviews (product_id, user_id, rating, comment) VALUES
(42, 14, 5, 'My son LOVES this t-shirt.'),
(42, 13, 4, 'Nice colors and material.'),
(42, 11, NULL, 'Bought for nephew, he wears it all the time.'),
(43, 7, 3, 'Looks cool but runs small.'),
(43, 8, 2, 'Too tight around the waist.'),
(43, 5, 4, NULL),
(44, 1, 5, 'So warm and soft! Perfect for winter.'),
(44, 6, NULL, 'My daughter wears it all the time.'),
(44, 14, 4, 'Really cozy.'),
(44, 18, 3, 'Nice but shrank a bit after wash.'),
(45, 15, 5, 'Perfect for active kids. Easy to clean.'),
(45, 13, 3, NULL),
(45, 18, 4, 'Solid build. Velcro could be stronger.'),
(46, 20, 5, 'This hat is adorable!!'),
(46, 14, 4, 'Really sparkly, my kid loves it.'),
(46, 17, NULL, 'Great for sunny days.');

-- Bonus: A few additional scattered realistic reviews
INSERT INTO product_reviews (product_id, user_id, rating, comment) VALUES
(33, 10, 5, 'Looks even better in person.'),
(35, 19, 4, 'These rings got me so many compliments.'),
(46, 12, 2, 'Did not match my expectations.'),
(40, 18, 5, 'Killer heels!!'),
(45, 1, 3, 'Cute but slightly flimsy.');
