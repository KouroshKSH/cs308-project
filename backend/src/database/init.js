const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function initDatabase() {
    try {
        // Create a connection to MySQL server (without specifying a database)
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD
        });

        // Create the database if it doesn't exist
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
        console.log(`Database ${process.env.DB_NAME} created or already exists.`);

        // Close the initial connection
        await connection.end();

        // Create a connection pool to the newly created database
        const pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

        // Read and execute the schema.sql file
        const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
        const statements = schema.split(';').filter(stmt => stmt.trim());

        for (let statement of statements) {
            if (statement.trim()) {
                await pool.query(statement);
            }
        }
        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Database initialization failed:', error);
    }
}

initDatabase();