// initiate connection to MySQL database
const mysql = require('mysql2/promise');

// load environment variables (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME)
require('dotenv').config(); // it's different for each person

// create a connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// // why?
// Creating a new database connection for each request is expensive.
// Connection pools reuse existing connections, reducing overhead and improving performance.

// make the database connection pool reusable across the app
module.exports = pool;