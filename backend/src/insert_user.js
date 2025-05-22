// backend/src/insert_user.js
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

async function insertTestManager() {
  // Read DB config from .env
  const {
    DB_HOST,
    DB_USER,
    DB_PASSWORD,
    DB_NAME,
    DB_PORT,
  } = process.env;

  let connection;

  try {
    connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      port: DB_PORT ? Number(DB_PORT) : undefined,
    });

    // Prepare test data
    const username = 'SalesMan2';
    const email    = 'salesmanager2@example.com';
    const role     = 'salesManager';
    const address  = 'Sales Branch';
    const phone    = '444-555-6666';
    const plainPwd = 'pas123456';

    // Hash the password
    const passwordHash = await bcrypt.hash(plainPwd, 10);

    // Insert into users table
    const [result] = await connection.execute(
      `INSERT INTO users 
         (username, email, password_hash, role, address, phone_number) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [username, email, passwordHash, role, address, phone]
    );

    console.log('✔️  Inserted user with ID:', result.insertId);
  } catch (err) {
    console.error('❌  Error inserting user:', err.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

insertTestManager();
