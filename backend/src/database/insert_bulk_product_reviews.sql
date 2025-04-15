USE fashion_ecommerce;

-- Bulk insert for product_reviews

INSERT INTO product_reviews (product_id, user_id, rating, comment) VALUES
-- Men's Department (department_id = 1)
(1, 6, 5, 'This shirt is soft and fits great!'),
(1, 17, 4, 'Decent quality. I might buy again.'),
(1, 19, NULL, 'The material feels okay, nothing special.'),
(2, 21, 5, 'Love the pockets! Super practical.'),
(2, 31, 3, 'Color is not as expected.'),
(2, 17, 2, NULL),
(3, 19, 5, 'These boots are amazing. Durable and stylish!'),
(3, 6, 4, 'Comfortable but took time to break in.'),
(3, 31, 1, 'Sole came off after a few wears. Disappointed.'),
(4, 21, 4, 'Classy look, decent value for money.'),
(4, 33, 3, NULL),
(5, 33, 5, 'Excellent quality. Look better than the photos!'),
(5, 23, 4, 'Very unique design. Feels a bit heavy though.'),
(5, 19, NULL, 'Nice set, would recommend to others.');

-- Women's Department (department_id = 2)
INSERT INTO product_reviews (product_id, user_id, rating, comment) VALUES
(6, 15, 5, 'GORGEOUS shirt! Perfect fit.'),
(6, 16, 4, 'Colors pop just like in the pictures.'),
(6, 20, 2, 'Did not suit me as I hoped.'),
(6, 24, NULL, 'Soft and breathable material.'),
(7, 22, 5, 'Very stylish and warm. Love it!'),
(7, 26, 4, 'Great jacket for spring.'),
(7, 32, NULL, 'Good quality, sleeves are a bit short.'),
(8, 16, 5, 'This skirt flows beautifully when you walk!'),
(8, 18, 3, 'Nice design, but sizing runs large.'),
(8, 34, 4, NULL),
(8, 20, 5, 'Best purchase this season!'),
(9, 32, 3, 'Average quality. Stitching could be better.'),
(9, 34, 5, 'Looks great and fits like a glove.'),
(10, 15, 2, 'Too high for daily wear.'),
(10, 26, NULL, 'Gorgeous but not super comfy.'),
(10, 18, 4, 'Great for parties!!');

-- Kids Department (department_id = 3)
INSERT INTO product_reviews (product_id, user_id, rating, comment) VALUES
(11, 24, 5, 'My son LOVES this t-shirt.'),
(11, 23, 4, 'Nice colors and material.'),
(11, 21, NULL, 'Bought for nephew, he wears it all the time.'),
(12, 33, 3, 'Looks cool but runs small.'),
(12, 22, 2, 'Too tight around the waist.'),
(12, 20, 4, NULL),
(13, 26, 5, 'So warm and soft! Perfect for winter.'),
(13, 16, NULL, 'My daughter wears it all the time.'),
(13, 34, 4, 'Really cozy.'),
(13, 18, 3, 'Nice but shrank a bit after wash.'),
(14, 25, 5, 'Perfect for active kids. Easy to clean.'),
(14, 23, 3, NULL),
(14, 33, 4, 'Solid build. Velcro could be stronger.'),
(15, 20, 5, 'This hat is adorable!!'),
(15, 24, 4, 'Really sparkly, my kid loves it.'),
(15, 26, NULL, 'Great for sunny days.');

-- Bonus: A few additional scattered realistic reviews
INSERT INTO product_reviews (product_id, user_id, rating, comment) VALUES
(3, 31, 5, 'Looks even better in person.'),
(5, 33, 4, 'These rings got me so many compliments.'),
(6, 32, 2, 'Did not match my expectations.'),
(10, 18, 5, 'Killer heels!!'),
(15, 34, 3, 'Cute but slightly flimsy.');
