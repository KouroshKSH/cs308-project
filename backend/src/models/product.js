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
      WHERE p.department_id = ? AND p.price > 0;
    `;
    const [rows] = await pool.query(query, [departmentId]);
    return rows;
  },

  // Fetch and sort products by price for a given department
  async getProductsByDepartmentSortedByPrice(departmentId) {
    const query = `
      SELECT 
        p.product_id,
        p.name,
        p.description,
        p.price AS original_price,
        p.image_url,
        p.stock_quantity,
        p.warranty_status,
        p.popularity_score,
        s.discount_percent,
        CAST((p.price * (100 - s.discount_percent) / 100) AS DECIMAL(10, 2)) AS discounted_price
      FROM products p
      LEFT JOIN sales_campaigns s 
        ON p.product_id = s.product_id
        AND CURDATE() BETWEEN s.start_date AND s.end_date
      WHERE p.department_id = ? AND p.price > 0
      ORDER BY 
        CASE 
          WHEN s.discount_percent IS NOT NULL THEN (p.price * (100 - s.discount_percent) / 100)
          ELSE p.price
        END ASC;
    `;
    const [rows] = await pool.query(query, [departmentId]);
    return rows;
  },

  // Fetch and sort products by popularity for a given department
  async getProductsByDepartmentSortedByPopularity(departmentId) {
    const query = `
      SELECT 
        p.product_id,
        p.name,
        p.description,
        p.price AS original_price,
        p.image_url,
        p.stock_quantity,
        p.warranty_status,
        p.popularity_score,
        s.discount_percent,
        CAST((p.price * (100 - s.discount_percent) / 100) AS DECIMAL(10, 2)) AS discounted_price
      FROM products p
      LEFT JOIN sales_campaigns s 
        ON p.product_id = s.product_id
        AND CURDATE() BETWEEN s.start_date AND s.end_date
      WHERE p.department_id = ? AND p.price > 0
      ORDER BY p.popularity_score DESC;
    `;
    const [rows] = await pool.query(query, [departmentId]);
    return rows;
  },

  // Fetch products by department for searching
  async searchProducts(query, departmentId) {
    const searchTerm = `%${query}%`;
    const sql = `
      SELECT 
        p.product_id, 
        p.name, 
        p.description, 
        p.price AS original_price, 
        p.material, 
        p.image_url, 
        p.stock_quantity, 
        p.warranty_status, 
        p.popularity_score,
        s.discount_percent,
        CAST((p.price * (100 - s.discount_percent) / 100) AS DECIMAL(10, 2)) AS discounted_price
      FROM products p
      LEFT JOIN sales_campaigns s 
        ON p.product_id = s.product_id
        AND CURDATE() BETWEEN s.start_date AND s.end_date
      WHERE p.department_id = ?
        AND p.price > 0
        AND (p.name LIKE ? OR p.description LIKE ? OR p.material LIKE ?)
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
          p.warranty_status,
          p.distributor_info,
          s.discount_percent,
          s.start_date,
          s.end_date,
          CAST((p.price * (100 - s.discount_percent) / 100) AS DECIMAL(10, 2)) AS discounted_price
        FROM products p
        LEFT JOIN sales_campaigns s 
          ON p.product_id = s.product_id
          AND CURDATE() BETWEEN s.start_date AND s.end_date
        WHERE p.product_id = ? AND p.price > 0;
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
      WHERE category_id IN (SELECT category_id FROM category_hierarchy)
        AND p.price > 0;
    `;
    const [rows] = await pool.query(query, [categoryId]);
    return rows;
  },

  // Fetch products filtered by both department ID and category ID
  // WITH RESPECT TO the hierarchical structure of categories
  async getProductsByDepartmentAndCategory(departmentId, categoryId) {
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
      SELECT 
        p.product_id, 
        p.name, 
        p.description, 
        p.price AS original_price, 
        p.image_url, 
        p.stock_quantity, 
        p.warranty_status, 
        p.popularity_score,
        s.discount_percent,
        CAST((p.price * (100 - s.discount_percent) / 100) AS DECIMAL(10, 2)) AS discounted_price
      FROM products p
      LEFT JOIN sales_campaigns s 
        ON p.product_id = s.product_id
        AND CURDATE() BETWEEN s.start_date AND s.end_date
      WHERE p.department_id = ?
        AND p.category_id IN (SELECT category_id FROM category_hierarchy)
        AND p.price > 0;
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

  // Add new product with its variations
  async createProductWithVariations(productData, variations) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // Insert product with default price -1 and popularity_score 0
      const [productResult] = await connection.query(
        `INSERT INTO products 
          (serial_number, name, description, price, cost, department_id, category_id, material, image_url, stock_quantity, warranty_status, distributor_info, popularity_score)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          productData.serial_number,
          productData.name,
          productData.description,
          -1, // default price
          productData.cost,
          productData.department_id,
          productData.category_id,
          productData.material,
          productData.image_url,
          productData.stock_quantity,
          productData.warranty_status,
          productData.distributor_info,
          0 // popularity_score
        ]
      );

      const productId = productResult.insertId;

      // Insert variations
      const variationIds = [];
      for (const variation of variations) {
        const [variationResult] = await connection.query(
          `INSERT INTO product_variations 
            (product_id, serial_number, size_id, color_id, stock_quantity)
          VALUES (?, ?, ?, ?, ?)`,
          [
            productId,
            variation.serial_number,
            variation.size_id,
            variation.color_id,
            variation.stock_quantity
          ]
        );
        variationIds.push(variationResult.insertId);
      }

      await connection.commit();
      return {
        success: true,
        message: `Successfully added new product ${productId} with variations [${variationIds.join(", ")}].`,
      };
    } catch (err) {
      await connection.rollback();
      console.error("Model - Failed to add product:", err);
      throw err;
    } finally {
      connection.release();
    }
  },

  async deleteProductById(productId) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
  
      // Product variations will be deleted automatically due to ON DELETE CASCADE
      await connection.query(`DELETE FROM products WHERE product_id = ?`, [productId]);
  
      await connection.commit();
      return { message: `Product ${productId} and its variations deleted.` };
    } catch (error) {
      await connection.rollback();
      console.error("Model - Failed to delete product:", error);
      throw error;
    } finally {
      connection.release();
    }
  },
  
  async getProductsWithNoPrice() {
    const [rows] = await pool.query(
      "SELECT * FROM products WHERE price = -1"
    );
    return rows;
  },

  async assignPriceToProduct(productId, newPrice) {
    const connection = await pool.getConnection();
  
    try {
      await connection.beginTransaction();
  
      const [[product]] = await connection.query(
        "SELECT cost FROM products WHERE product_id = ?",
        [productId]
      );
  
      if (!product) {
        throw new Error("Product not found.");
      }
  
      const cost = parseFloat(product.cost);
      const shouldUpdateCost = Math.abs(cost - (-0.5)) < 0.00001;
      const updatedCost = shouldUpdateCost ? (newPrice / 2) : cost;
  
      await connection.query(
        "UPDATE products SET price = ?, cost = ? WHERE product_id = ?",
        [newPrice, updatedCost, productId]
      );
  
      await connection.commit();
      return { message: `Price set to ${newPrice} for product ${productId}.` };
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  },

  async deleteProductVariation(productId, variationId) {
    const connection = await pool.getConnection();
  
    try {
      await connection.beginTransaction();
  
      const [result] = await connection.query(
        `DELETE FROM product_variations 
         WHERE product_id = ? AND variation_id = ?`,
        [productId, variationId]
      );
  
      await connection.commit();
  
      if (result.affectedRows === 0) {
        return { message: `No variation found for product ${productId} with variation ${variationId}.` };
      }
  
      return { message: `Variation ${variationId} deleted from product ${productId}.` };
    } catch (err) {
      await connection.rollback();
      console.error("Model - Failed to delete variation:", err);
      throw err;
    } finally {
      connection.release();
    }
  }  
  
};

module.exports = Product;
