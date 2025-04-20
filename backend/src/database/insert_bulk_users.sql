USE fashion_ecommerce;

-- Bulk insert of 20 unique users
INSERT INTO users (username, email, password_hash, role, address, phone_number)
VALUES
('testuser', 'testuser@example.com', '$2b$10$ul6lIoQFrGLHtbkGXwvxxedT/1nqFFKQUOqy7gQPngWpqfDNGt3KS', 'customer', '123 Test St', '1234567890'),
('newuser', 'newuser@example.com', '$2b$10$r5bBW5xLIKY04uE3FqYQjusv1AN80RgrGMxlm/q4WpMWGk1Nas0Wu', 'customer', '456 New St', '9876543210'),
('someotheruser', 'newuser1@example.com', '$2b$10$gQQW1JDiWvHkJ/qwE3hHmetnKoyMKPwB17mk/UuqhE5NYl8CuK1lq', 'customer', '456 New St', '9876543210'),
('user2', 'user2@email.com', '$2b$10$038zPI3qF5S2eoPYOlbDDelYGTmsbaIUg60gv0MeC/ozp64Sn5xYu', 'customer', '456 New St', '9876543210'),
('john.doe_541712', 'john.doe@email.com', '$2b$10$6xoso3.mvIqeR0Zm44jmJuH57hf6DMC1qUPbP2siM3qUiRgQJbEC2', 'customer', NULL, NULL),
('idontcare_242986', 'idontcare@example.com', '$2b$10$y9SnIbezrzXCTNP7SKIvEuc4uvG2S2ia6MDnSkPWdHbmrMFwPmuhO', 'customer', NULL, NULL),
('asd_547250', 'asd@asd.com', '$2b$10$5amst0ineX76Ug5PdPgT3.w0AtHPtSGkgaWaZ38lyaswsrztS.jBS', 'customer', NULL, NULL),
('somethingweird_632814', 'somethingweird@gmail.com', '$2b$10$muHJq8K.H.cAyh3sTm15Qeko0lZQ.6/PMKXczKx3zyCZuEVTf2Hm6', 'customer', NULL, NULL),
('asdfasd_202798', 'asdfasd@gasfds.com', '$2b$10$.WtFL5MmtuGmtK52FY42w.f1uHJJyAURFvkSWHwNa5mXTaTAfEDYC', 'customer', NULL, NULL),
('something1_399495', 'something1@example.com', '$2b$10$jTGFmf02H2Yn5rZjYLBRBO/8xHOj0apxGWl3I.ldtlx1DW6Q/.u0q', 'customer', NULL, NULL),
('something2_905353', 'something2@example.com', '$2b$10$SaQ8ur0kL/2SY8xvKh8MYOKTzHUOlYEuyMzr5nEi7d0hlyYTye0ti', 'customer', NULL, NULL),
('person5_150515', 'person5@gm.com', '$2b$10$XqHWbFwyZHby76qJVigYAeAr8e5cCdbw6TYU5UZknhCQ6KN4V3nDy', 'customer', NULL, NULL),
('person6_524040', 'person6@gm.com', '$2b$10$YmyF4hgEk4FAsUJBLaIUEuaLYu/MzjQ9zGNqO12EEQQf342pJebhq', 'customer', NULL, NULL),
('arya_940271', 'arya@gmail.com', '$2b$10$f86BbAP9QLcwghHyiPEucucreMO878xGXZUNox3EszGcuRiS4lIV2', 'customer', NULL, NULL),
('jane_smith', 'jane.smith@email.com', '$2b$10$ul6lIoQFrGLHtbkGXwvxxedT/1nqFFKQUOqy7gQPngWpqfDNGt3KS', 'customer', '456 Oak Ave, Somecity, Canada', '987-654-3210'),
('michael_brown', 'michael.brown@email.com', '$2b$10$ul6lIoQFrGLHtbkGXwvxxedT/1nqFFKQUOqy7gQPngWpqfDNGt3KS', 'customer', '789 Pine Ln, Otherville, UK', '+44 20 1234 5678'),
('emily_wilson', 'emily.wilson@email.com', '$2b$10$ul6lIoQFrGLHtbkGXwvxxedT/1nqFFKQUOqy7gQPngWpqfDNGt3KS', 'customer', '101 Elm Rd, Faraway, Australia', '+61 2 9876 5432'),
('david88', 'david88@email.com', '$2b$10$ul6lIoQFrGLHtbkGXwvxxedT/1nqFFKQUOqy7gQPngWpqfDNGt3KS', 'customer', '222 Maple Dr, Townsville, Germany', '+49 30 1234567'),
('sarah_jones', 'sarah.jones@email.com', '$2b$10$ul6lIoQFrGLHtbkGXwvxxedT/1nqFFKQUOqy7gQPngWpqfDNGt3KS', 'customer', '333 Willow Ct, Villagetown, France', '+33 1 23 45 67 89'),
('kevin_miller', 'kevin.miller@email.com', '$2b$10$ul6lIoQFrGLHtbkGXwvxxedT/1nqFFKQUOqy7gQPngWpqfDNGt3KS', 'customer', '444 Birch St, Countryside, Italy', '+39 06 12345678'),
('jessica_davis', 'jessica.davis@email.com', '$2b$10$ul6lIoQFrGLHtbkGXwvxxedT/1nqFFKQUOqy7gQPngWpqfDNGt3KS', 'customer', '555 Oakwood Ave, Hilltop, Spain', '+34 91 123 45 67'),
('andrew_garcia', 'andrew.garcia@email.com', '$2b$10$ul6lIoQFrGLHtbkGXwvxxedT/1nqFFKQUOqy7gQPngWpqfDNGt3KS', 'customer', '666 Pinecrest Ln, Lakeside, Netherlands', '+31 20 1234567'),
('olivia_rodriguez', 'olivia.rodriguez@email.com', '$2b$10$ul6lIoQFrGLHtbkGXwvxxedT/1nqFFKQUOqy7gQPngWpqfDNGt3KS', 'customer', '777 River Rd, Mountainview, Sweden', '+46 8 123 45 67'),
('mehmet_kaya', 'mehmet.kaya@email.com', '$2b$10$ul6lIoQFrGLHtbkGXwvxxedT/1nqFFKQUOqy7gQPngWpqfDNGt3KS', 'customer', 'Istanbul, Turkey', '+90 555 123 45 67'),
('ayse_demir', 'ayse.demir@email.com', '$2b$10$ul6lIoQFrGLHtbkGXwvxxedT/1nqFFKQUOqy7gQPngWpqfDNGt3KS', 'customer', 'Ankara, Turkey', '+90 532 987 65 43'),
('thomas_white', 'thomas.white@email.com', '$2b$10$ul6lIoQFrGLHtbkGXwvxxedT/1nqFFKQUOqy7gQPngWpqfDNGt3KS', 'salesManager', '888 Forest Dr, Valleyview, USA', '456-789-0123'),
('laura_hall', 'laura.hall@email.com', '$2b$10$ul6lIoQFrGLHtbkGXwvxxedT/1nqFFKQUOqy7gQPngWpqfDNGt3KS', 'salesManager', '999 Ocean Blvd, Seaside, Canada', '321-654-0987'),
('ryan_adams', 'ryan.adams@email.com', '$2b$10$ul6lIoQFrGLHtbkGXwvxxedT/1nqFFKQUOqy7gQPngWpqfDNGt3KS', 'productManager', '111 Hill Rd, Summit, UK', '+44 7700 900123'),
('sophia_baker', 'sophia.baker@email.com', '$2b$10$ul6lIoQFrGLHtbkGXwvxxedT/1nqFFKQUOqy7gQPngWpqfDNGt3KS', 'productManager', '222 Lake St, Clearwater, Australia', '+61 4 9999 8888'),
('daniel_clark', 'daniel.clark@email.com', '$2b$10$ul6lIoQFrGLHtbkGXwvxxedT/1nqFFKQUOqy7gQPngWpqfDNGt3KS', 'customer', '333 Park Ave, Uptown, Germany', '+49 176 12345678'),
('mia_lewis', 'mia.lewis@email.com', '$2b$10$ul6lIoQFrGLHtbkGXwvxxedT/1nqFFKQUOqy7gQPngWpqfDNGt3KS', 'customer', '444 Garden Ln, Downtown, France', '+33 6 12 34 56 78'),
('ethan_young', 'ethan.young@email.com', '$2b$10$ul6lIoQFrGLHtbkGXwvxxedT/1nqFFKQUOqy7gQPngWpqfDNGt3KS', 'customer', '555 Main Rd, Eastside, Italy', '+39 333 1234567'),
('ava_king', 'ava.king@email.com', '$2b$10$ul6lIoQFrGLHtbkGXwvxxedT/1nqFFKQUOqy7gQPngWpqfDNGt3KS', 'customer', '666 High St, Westend, Spain', '+34 600 123 45 67'),
('james_king', 'james.king@email.com', '$2b$10$ul6lIoQFrGLHtbkGXwvxxedT/1nqFFKQUOqy7gQPngWpqfDNGt3KS', 'customer', '777 High St, Westend, Spain', '+34 600 123 45 68');

-- for users table, Kourosh's DB will look a bit different because of user 4 being missing