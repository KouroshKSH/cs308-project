const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function bulkInsert() {
    try {
        const pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

        // does bulk insertion for all tables besides the `users` table
        const bulkInsertFiles = [
            'insert_bulk_categories.sql',
            'insert_bulk_colors.sql',
            'insert_bulk_sizes.sql',
            'insert_bulk_products.sql',
            `insert_bulk_product_variations.sql`
        ];
        for (const file of bulkInsertFiles) {
            const filePath = path.join(__dirname, file);
            if (fs.existsSync(filePath)) {
                const sqlContent = fs.readFileSync(filePath, 'utf8');
                const statements = sqlContent.split(';').filter(stmt => stmt.trim());
                for (const statement of statements) {
                    await pool.query(statement);
                }
                console.log(`Executed bulk insertion for ${file}`);
            } else {
                console.warn(`Insertion file not found: ${file}`);
            }
        }

        console.log('Bulk insertion into database done successfully');
    } catch (error) {
        console.error('Bulk insertion into database failed:', error);
    }
}

bulkInsert();