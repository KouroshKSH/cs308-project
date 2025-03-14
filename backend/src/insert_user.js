// require('dotenv').config();
require('dotenv').config({ path: '../.env' });

const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

async function registerUser() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        const hashedPassword = await bcrypt.hash('password123', 10);

        const [result] = await connection.execute(
            'INSERT INTO users (username, email, password_hash, role, address, phone_number) VALUES (?, ?, ?, ?, ?, ?)',
            ['newuser', 'newuser@example.com', hashedPassword, 'customer', '456 New St', '9876543210']
        );

        console.log('User inserted:', result);
        await connection.end();
    } catch (error) {
        console.error('Error inserting user:', error);
    }
}

registerUser();