const pool = require("../config/database"); // Use the MySQL connection pool
// do NOT use sequelize and stick to pool

// Define the Product model that maps to the 'products' table in the database
const Product = {
  // Fetch products by department
  async getProductsByDepartment(departmentId) {
    const query = `
      SELECT product_id, name, description, price, stock_quantity, warranty_status, popularity_score
      FROM products
      WHERE department_id = ?;
    `;
    const [rows] = await pool.query(query, [departmentId]);
    return rows;
  },

  // Fetch and sort products by price for a given department
  async getProductsByDepartmentSortedByPrice(departmentId) {
    const query = `
      SELECT product_id, name, description, price, stock_quantity, warranty_status, popularity_score
      FROM products
      WHERE department_id = ?
      ORDER BY price ASC;
    `;
    const [rows] = await pool.query(query, [departmentId]);
    return rows;
  },
};

module.exports = Product;