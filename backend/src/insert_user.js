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

        const hashedPassword = await bcrypt.hash('pas123', 10);

        const [result] = await connection.execute(
            'INSERT INTO users (username, email, password_hash, role, address, phone_number) VALUES (?, ?, ?, ?, ?, ?)',
            ['user2', 'user2@email.com', hashedPassword, 'customer', '456 New St', '9876543210']
        );

        console.log('User inserted:', result);
        await connection.end();
    } catch (error) {
        console.error('Error inserting user:', error);
    }
}

registerUser();

// some examples for doing CURL and checking per customer
// example 1:
// email: `newuser@example.com`
// password: `password123`
// the CURL command to run:
/*
curl -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{
  "email": "newuser@example.com",
  "password": "password123"
}'
*/
// paste everything in between the forward slashes into the terminal
// change the email and password to the ones you want to test

// example 2:
// email: `newuser1@example.com`
// password: `password1234`
// the CURL command to run:
/*
curl -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{
  "email": "newuser1@example.com",
  "password": "password1234"
}'
*/

// example 3:
// email: `john.doe@email.com`
// password: `=R7Py@Dh?K#Cqd&`
// the CURL command to run:
/*
curl -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{
  "email": "john.doe@example.com",
  "password": "=R7Py@Dh?"
}'
*/