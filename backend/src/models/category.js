const pool = require("../config/database");

const Category = {
  // Get all categories with parent info (one level up)
  async getAllWithParent() {
    const query = `
      SELECT 
        c.category_id,
        c.name AS category_name,
        c.parent_category_id,
        p.name AS parent_name
      FROM categories c
      LEFT JOIN categories p ON c.parent_category_id = p.category_id
      ORDER BY c.category_id ASC
    `;
    const [rows] = await pool.query(query);
    return rows;
  }
};

module.exports = Category;