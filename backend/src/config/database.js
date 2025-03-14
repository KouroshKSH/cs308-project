// initiate connection to MySQL database
const mysql = require('mysql2/promise');

// load environment variables (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME)
// it's different for each person
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

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

// Why?
// Creating a new database connection for each request is expensive.
// Connection pools reuse existing connections, reducing overhead and improving performance.

// if curl problem happens, run this for logging
// console.log("DB_HOST:", process.env.DB_HOST);
// console.log("DB_USER:", process.env.DB_USER);
// console.log("DB_PASSWORD:", process.env.DB_PASSWORD ? "*******" : "NOT SET");
// console.log("DB_NAME:", process.env.DB_NAME);

// make the database connection pool reusable across the app
module.exports = pool;