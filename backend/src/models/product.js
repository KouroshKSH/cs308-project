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


  // Search products by department
  async searchProducts(query, departmentId) {
    const searchTerm = `%${query}%`;
    const sql = `
      SELECT product_id, name, description, price, stock_quantity, warranty_status, popularity_score
      FROM products
      WHERE department_id = ?
        AND (name LIKE ? OR description LIKE ?)
      LIMIT 5;
    `;
    const [rows] = await pool.query(sql, [departmentId, searchTerm, searchTerm]);
    return rows;
  },

  // Get product variation stock status
  async getPvStock() {
    const query = `SELECT * FROM variation_stock_view;`;
    const [rows] = await pool.query(query);
    return rows;
  }
};

module.exports = Product;