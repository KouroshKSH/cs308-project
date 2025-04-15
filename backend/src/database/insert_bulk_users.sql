USE fashion_ecommerce;

-- Bulk insert of 20 unique users
INSERT IGNORE INTO users (username, email, password_hash, role, address, phone_number) VALUES
('john.doe', 'john.doe@email.com', '$2b$10$ul6lIoQFrGLHtbkGXwvxxedT/1nqFFKQUOqy7gQPngWpqfDNGt3KS', 'customer', '123 Main St, Anytown, USA', '123-456-7890'),
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
('ava_king', 'ava.king@email.com', '$2b$10$ul6lIoQFrGLHtbkGXwvxxedT/1nqFFKQUOqy7gQPngWpqfDNGt3KS', 'customer', '666 High St, Westend, Spain', '+34 600 123 45 67');