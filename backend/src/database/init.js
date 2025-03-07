const fs = require('fs');
const path = require('path');
const pool = require('../config/database');

async function initDatabase() {
    try {
        const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
        const statements = schema.split(';').filter(stmt => stmt.trim());
        
        for (let statement of statements) {
            if (statement.trim()) {
                await pool.execute(statement);
            }
        }
        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Database initialization failed:', error);
    }
}

// for most applications, exporting the initDatabase function explicitly is recommended
module.exports = { initDatabase };