require('dotenv').config({ path: '../../.env' });
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

//Connection to database
function connectToDatabase(callback) {
    connection.connect((err) => {
        if (err) {
            console.error("Database connection failed:", err.message);
            process.exit(1); 
        }
        console.log("Successfully connected to the database:", process.env.DB_NAME);
        callback(connection); 
    });
}

//Function to display products
function displayProducts(products) {
    console.log("\nProduct List:");
    if (products.length === 0) {
        console.log("No products found.");
    } else {
        products.forEach((prod, index) => {
            console.log(`${index + 1}. ${prod.name} | Department: ${prod.department_id} | Category: ${prod.category_id} | Price: $${prod.price}`);
        });
    }
    console.log("\n");
}

//Function for getting products by category (Men, Women, Kids)
function getProductsByDepartment(departmentId, callback) {
    const query = `
        SELECT p.name, p.price, p.category_id, p.department_id
        FROM products p
        WHERE p.department_id = ?;
    `;

    connection.query(query, [departmentId], (err, results) => {
        if (err) {
            console.error("Error fetching products by department:", err.message);
            return;
        }
        callback(results);
    });
}

//Function for sorting products by price (high to low)
function sortByPriceHighToLow(callback) {
    const query = `
        SELECT p.name, p.price, p.category_id
        FROM products p
        ORDER BY p.price DESC;
    `;
    
    connection.query(query, (err, results) => {
        if (err) {
            console.error("Error sorting products by price:", err.message);
            return;
        }
        callback(results);
    });
}

//Function for sorting products by price (low to high)
function sortByPriceLowToHigh(callback) {
    const query = `
        SELECT p.name, p.price, p.category_id
        FROM products p
        ORDER BY p.price ASC;
    `;
    
    connection.query(query, (err, results) => {
        if (err) {
            console.error("Error sorting products by price:", err.message);
            return;
        }
        callback(results);
    });
}

module.exports = { connection, connectToDatabase, displayProducts, getProductsByDepartment, sortByPriceHighToLow, sortByPriceLowToHigh };

