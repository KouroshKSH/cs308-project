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
    },

    // Get all descendants of a category (including itself)
    async getDescendants(categoryId) {
    const query = `
        WITH RECURSIVE descendants AS (
        SELECT category_id, name, parent_category_id
        FROM categories
        WHERE category_id = ?
        UNION ALL
        SELECT c.category_id, c.name, c.parent_category_id
        FROM categories c
        INNER JOIN descendants d ON c.parent_category_id = d.category_id
        )
        SELECT * FROM descendants WHERE category_id != ? ORDER BY category_id ASC;
    `;
    const [rows] = await pool.query(query, [categoryId, categoryId]);
    return rows;
    },
};

module.exports = Category;