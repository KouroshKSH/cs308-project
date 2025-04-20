USE fashion_ecommerce;

-- Bulk insert for product_reviews with approved comments
-- but by default, they'll be pending once the user inserts them via the endpoint

-- Men's Department (department_id = 1)
INSERT INTO product_reviews (product_id, user_id, rating, comment, comment_approval) VALUES
(1, 6, 5, 'This shirt is soft and fits great!', 'approved'),
(1, 17, 4, 'Decent quality. I might buy again.', 'approved'),
(1, 19, NULL, 'The material feels okay, nothing special.', 'approved'),
(2, 21, 5, 'Love the pockets! Super practical.', 'approved'),
(2, 31, 3, 'Color is not as expected.', 'approved'),
(2, 17, 2, NULL, 'approved'),
(3, 19, 5, 'These boots are amazing. Durable and stylish!', 'approved'),
(3, 6, 4, 'Comfortable but took time to break in.', 'approved'),
(3, 31, 1, 'Sole came off after a few wears. Disappointed.', 'approved'),
(4, 21, 4, 'Classy look, decent value for money.', 'approved'),
(4, 33, 3, NULL, 'approved'),
(5, 33, 5, 'Excellent quality. Look better than the photos!', 'approved'),
(5, 23, 4, 'Very unique design. Feels a bit heavy though.', 'approved'),
(5, 19, NULL, 'Nice set, would recommend to others.', 'approved');

-- Women's Department (department_id = 2)
INSERT INTO product_reviews (product_id, user_id, rating, comment, comment_approval) VALUES
(6, 15, 5, 'GORGEOUS shirt! Perfect fit.', 'approved'),
(6, 16, 4, 'Colors pop just like in the pictures.', 'approved'),
(6, 20, 2, 'Did not suit me as I hoped.', 'approved'),
(6, 24, NULL, 'Soft and breathable material.', 'approved'),
(7, 22, 5, 'Very stylish and warm. Love it!', 'approved'),
(7, 26, 4, 'Great jacket for spring.', 'approved'),
(7, 32, NULL, 'Good quality, sleeves are a bit short.', 'approved'),
(8, 16, 5, 'This skirt flows beautifully when you walk!', 'approved'),
(8, 18, 3, 'Nice design, but sizing runs large.', 'approved'),
(8, 34, 4, NULL, 'approved'),
(8, 20, 5, 'Best purchase this season!', 'approved'),
(9, 32, 3, 'Average quality. Stitching could be better.', 'approved'),
(9, 34, 5, 'Looks great and fits like a glove.', 'approved'),
(10, 15, 2, 'Too high for daily wear.', 'approved'),
(10, 26, NULL, 'Gorgeous but not super comfy.', 'approved'),
(10, 18, 4, 'Great for parties!!', 'approved');

-- Kids Department (department_id = 3)
INSERT INTO product_reviews (product_id, user_id, rating, comment, comment_approval) VALUES
(11, 24, 5, 'My son LOVES this t-shirt.', 'approved'),
(11, 23, 4, 'Nice colors and material.', 'approved'),
(11, 21, NULL, 'Bought for nephew, he wears it all the time.', 'approved'),
(12, 33, 3, 'Looks cool but runs small.', 'approved'),
(12, 22, 2, 'Too tight around the waist.', 'approved'),
(12, 20, 4, NULL, 'approved'),
(13, 26, 5, 'So warm and soft! Perfect for winter.', 'approved'),
(13, 16, NULL, 'My daughter wears it all the time.', 'approved'),
(13, 34, 4, 'Really cozy.', 'approved'),
(13, 18, 3, 'Nice but shrank a bit after wash.', 'approved'),
(14, 25, 5, 'Perfect for active kids. Easy to clean.', 'approved'),
(14, 23, 3, NULL, 'approved'),
(14, 33, 4, 'Solid build. Velcro could be stronger.', 'approved'),
(15, 20, 5, 'This hat is adorable!!', 'approved'),
(15, 24, 4, 'Really sparkly, my kid loves it.', 'approved'),
(15, 26, NULL, 'Great for sunny days.', 'approved');

-- Bonus: A few additional scattered realistic reviews
INSERT INTO product_reviews (product_id, user_id, rating, comment, comment_approval) VALUES
(3, 31, 5, 'Looks even better in person.', 'approved'),
(5, 33, 4, 'These rings got me so many compliments.', 'approved'),
(6, 32, 2, 'Did not match my expectations.', 'approved'),
(10, 18, 5, 'Killer heels!!', 'approved'),
(15, 34, 3, 'Cute but slightly flimsy.', 'approved');
