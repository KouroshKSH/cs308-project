const pool = require("../config/database"); // Use the MySQL connection pool
// do NOT use sequelize and stick to pool

// Define the Product model that maps to the 'products' table in the database
const Product = {
  // Fetch products by department
  async getProductsByDepartment(departmentId) {
    const query = `
      SELECT 
        p.product_id,
        p.name,
        p.description,
        p.price AS original_price,
        p.image_url,
        p.popularity_score,
        p.stock_quantity,
        s.discount_percent,
        CAST((p.price * (100 - s.discount_percent) / 100) AS DECIMAL(10, 2)) AS discounted_price
      FROM products p
      LEFT JOIN sales_campaigns s 
        ON p.product_id = s.product_id
        AND CURDATE() BETWEEN s.start_date AND s.end_date
      WHERE p.department_id = ?;
    `;
    const [rows] = await pool.query(query, [departmentId]);
    return rows;
  },

  // Fetch and sort products by price for a given department
  async getProductsByDepartmentSortedByPrice(departmentId) {
    const query = `
      SELECT product_id, name, description, price, image_url, stock_quantity, warranty_status, popularity_score
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
      SELECT product_id, name, description, price, image_url, stock_quantity, warranty_status, popularity_score
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
      SELECT product_id, name, description, price, material, image_url, stock_quantity, warranty_status, popularity_score
      FROM products
      WHERE department_id = ?
        AND (name LIKE ? OR description LIKE ? OR material LIKE ?)
      LIMIT 5;
    `;
    const [rows] = await pool.query(sql, [
      departmentId,
      searchTerm,
      searchTerm,
      searchTerm,
    ]);
    return rows;
    // we can show up to 5 results to avoid showing too many results
    // the user's search term will be tried to match to `name`, `description`, or `material`
  },

  // Get product variation stock status
  async getPvStock() {
    const query = `SELECT * FROM variation_stock_view;`;
    const [rows] = await pool.query(query);
    return rows;
  },

  // Get product info given its ID
  async getProductById(productId) {
    // const sql = `
    //   SELECT *
    //   FROM products
    //   WHERE product_id = ?;
    // `;
      const sql = `
        SELECT 
          p.product_id,
          p.name,
          p.description,
          p.price AS original_price,
          p.image_url,
          p.popularity_score,
          p.stock_quantity,
          p.material,
          s.discount_percent,
          CAST((p.price * (100 - s.discount_percent) / 100) AS DECIMAL(10, 2)) AS discounted_price
        FROM products p
        LEFT JOIN sales_campaigns s 
          ON p.product_id = s.product_id
          AND CURDATE() BETWEEN s.start_date AND s.end_date
        WHERE p.product_id = ?;
      `;
    const [rows] = await pool.query(sql, [productId]);
    return rows[0];
  },

  // Get product variations given its ID
  async getProductVariations(productId) {
    const sql = `
      SELECT
        pv.variation_id, pv.product_id,
        s.name as size,
        pv.stock_quantity
      FROM product_variations pv
      JOIN sizes s ON pv.size_id = s.size_id
      WHERE pv.product_id = ?
      ORDER BY s.size_id
    `;
    const [rows] = await pool.query(sql, [productId]);
    return rows;
  },

  // fetch products given the category they belong to
  // considering the hierarchical structure of categories
  async getProductsByCategory(categoryId) {
    const query = `
      WITH RECURSIVE category_hierarchy AS (
        SELECT category_id
        FROM categories
        WHERE category_id = ?
        UNION ALL
        SELECT c.category_id
        FROM categories c
        INNER JOIN category_hierarchy ch ON c.parent_category_id = ch.category_id
      )
      SELECT *
      FROM products
      WHERE category_id IN (SELECT category_id FROM category_hierarchy);
    `;
    const [rows] = await pool.query(query, [categoryId]);
    return rows;
  },

  // Fetch products filtered by both department ID and category ID
  // WITH RESPECT TO the hierarchical structure of categories
  async getProductsByDepartmentAndCategory(departmentId, categoryId) {
    const query = `
      WITH RECURSIVE category_hierarchy AS (
        -- Start with the given category_id
        SELECT category_id
        FROM categories
        WHERE category_id = ?
        UNION ALL
        -- Recursively find all subcategories
        SELECT c.category_id
        FROM categories c
        INNER JOIN category_hierarchy ch ON c.parent_category_id = ch.category_id
      )
      SELECT p.product_id, p.name, p.description, p.price, p.image_url, p.stock_quantity, p.warranty_status, p.popularity_score
      FROM products p
      WHERE p.department_id = ?
        AND p.category_id IN (SELECT category_id FROM category_hierarchy);
    `;
    const [rows] = await pool.query(query, [categoryId, departmentId]);
    return rows;
  },

  // fetching for the sales campaigns basically (very niche i know)
  async getAllProducts() {
    const query = `
      SELECT product_id, name
      FROM products;
    `;
    const [rows] = await pool.query(query);
    return rows;
  },
};

module.exports = Product;
