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

        // Read the `create_db_run_schema.sql` file
        const initSchemaPath = path.join(__dirname, 'create_db_run_schema.sql');
        const initSchemaContent = fs.readFileSync(initSchemaPath, 'utf8');

        // Extract file paths from SOURCE commands
        const sourceFiles = initSchemaContent
            .split('\n')
            .filter(line => line.trim().toUpperCase().startsWith('SOURCE'))
            .map(line => line.split(' ')[1].trim().replace(';', ''));

        // Execute each referenced schema file
        for (const file of sourceFiles) {
            const filePath = path.join(__dirname, file);
            if (fs.existsSync(filePath)) {
                const sqlContent = fs.readFileSync(filePath, 'utf8');
                const statements = sqlContent.split(';').filter(stmt => stmt.trim());
                for (const statement of statements) {
                    await pool.query(statement);
                }
                console.log(`Executed schema file: ${file}`);
            } else {
                console.warn(`Schema file not found: ${file}`);
            }
        }

        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Database initialization failed:', error);
    }
}

initDatabase();