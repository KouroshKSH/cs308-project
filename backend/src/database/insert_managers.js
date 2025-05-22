require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

async function insertManagers() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        const hashedPassword = await bcrypt.hash('pas123', 10);

        const users = [
            ['productmanager1@email.com', 'ProductMan1', 'productManager', 'Main HQ', '123-456-7890'],
            ['salesmanager1@email.com', 'SalesMan1', 'salesManager', 'Sales Branch', '444-555-6666']
        ];

        for (const [email, username, role, address, phone] of users) {
            await connection.execute(
                'INSERT INTO users (username, email, password_hash, role, address, phone_number) VALUES (?, ?, ?, ?, ?, ?)',
                [username, email, hashedPassword, role, address, phone]
            );
        }

        console.log('Managers inserted.');
        await connection.end();
    } catch (err) {
        console.error('Error inserting managers:', err);
    }
}

insertManagers();
