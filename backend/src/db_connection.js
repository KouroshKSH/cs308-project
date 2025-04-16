require("dotenv").config({ path: "../.env" });
const mysql = require("mysql2");

// Create a persistent single connection
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Connect to the database 
connection.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err.message);
        process.exit(1);
    }
});

// Display products 
function displayProducts(products) {
    console.log("\n Product List:");
    if (products.length === 0) {
        console.log("No products found.");
    } else {
        products.forEach((prod, index) => {
            console.log(
                `${index + 1}. ${prod.name} | Department: ${prod.department_id} | Category: ${prod.category_id} | Price: $${prod.price}`
            );
        });
    }
    console.log("\n");
}

// Get products by department (Men=1, Women=2, Kids=3)
function getProductsByDepartment(departmentId, callback) {
    const query = `
        SELECT product_id, name, price, category_id, department_id
        FROM products
        WHERE department_id = ?;
    `;
    connection.query(query, [departmentId], (err, results) => {
        if (err) {
            console.error("Error fetching department products:", err.message);
            return;
        }
        callback(results);
    });
}

// Sort products: High to Low price
function sortByPriceHighToLow(callback) {
    const query = `
        SELECT product_id, name, price, category_id
        FROM products
        ORDER BY price DESC;
    `;
    connection.query(query, (err, results) => {
        if (err) {
            console.error("Error sorting products (high to low):", err.message);
            return;
        }
        callback(results);
    });
}

// Sort products: Low to High price
function sortByPriceLowToHigh(callback) {
    const query = `
        SELECT product_id, name, price, category_id
        FROM products
        ORDER BY price ASC;
    `;
    connection.query(query, (err, results) => {
        if (err) {
            console.error("Error sorting products (low to high):", err.message);
            return;
        }
        callback(results);
    });
}

module.exports = {connection, displayProducts, getProductsByDepartment, sortByPriceHighToLow, sortByPriceLowToHigh};
