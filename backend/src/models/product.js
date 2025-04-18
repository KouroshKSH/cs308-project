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

  // Fetch and sort products by popularity for a given department
  async getProductsByDepartmentSortedByPopularity(departmentId) {
    const query = `
      SELECT product_id, name, description, price, stock_quantity, warranty_status, popularity_score
      FROM products
      WHERE department_id = ?
      ORDER BY popularity_score DESC;
    `;
    const [rows] = await pool.query(query, [departmentId]);
    return rows;
  },

  // Fetch products by department for searching
  async searchProducts(query, departmentId) {
    const searchTerm = `%${query}%`;
    const sql = `
      SELECT product_id, name, description, price, material, stock_quantity, warranty_status, popularity_score
      FROM products
      WHERE department_id = ?
        AND (name LIKE ? OR description LIKE ? OR material LIKE ?)
      LIMIT 5;
    `;
    const [rows] = await pool.query(sql, [departmentId, searchTerm, searchTerm]);
    return rows;
    // we can show up to 5 results to avoid showing too many results
    // the user's search term will be tried to match to `name`, `description`, or `material`
  }
};

module.exports = Product;