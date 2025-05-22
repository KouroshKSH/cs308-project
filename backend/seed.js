
require('dotenv').config();
console.log({
  DB_HOST:     process.env.DB_HOST,
  DB_USER:     process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD?.length > 0 ? '******' : '(empty)',
  DB_NAME:     process.env.DB_NAME
});

const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

async function seed() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  // 1) Create users
  const passwordHash = await bcrypt.hash('password123', 10);
  await conn.execute(
    `INSERT IGNORE INTO users (username, email, password_hash, role)
     VALUES 
       ('Alice', 'alice@example.com', ?, 'customer'),
       ('Bob',   'bob@example.com',   ?, 'salesManager')`,
    [passwordHash, passwordHash]
  );

  // 2) Create products
  await conn.execute(
    `INSERT IGNORE INTO products 
      (serial_number, name, description, price, department_id, category_id, material, image_url, stock_quantity, warranty_status, distributor_info, popularity_score)
     VALUES
      ('SN100','T-Shirt','Cotton Tee',19.99,2,10,'Cotton','url_sn100',50,'1 Year','Acme Inc',5),
      ('SN200','Jeans','Blue Denim',49.99,1,20,'Denim','url_sn200',30,'2 Years','Denim Co',4)`
  );

  // 3) Create variations for each
  await conn.execute(
    `INSERT IGNORE INTO product_variations (product_id, size_id, color_id, stock_quantity)
     VALUES
       (1,1,1,50),
       (2,2,1,30)`
  );

  // 4) Create an order for Alice
  const [orderResult] = await conn.execute(
    `INSERT INTO orders (user_id, delivery_address, total_price)
     VALUES ((SELECT user_id FROM users WHERE email='alice@example.com'), '123 Main St', 39.98)`
  );
  const orderId = orderResult.insertId;

  // 5) Create order items
  await conn.execute(
    `INSERT INTO order_items (order_id, product_id, variation_id, quantity, price_at_purchase)
     VALUES (?, 1, 1, 2, 19.99)`,
    [orderId]
  );

  console.log('Database seeded successfully.');
  await conn.end();
}

seed().catch(err => {
  console.error('Seeding error:', err);
  process.exit(1);
});
