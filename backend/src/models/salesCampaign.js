const pool = require("../config/database");

const SalesCampaign = {
  // Fetch all sales campaigns
  async getAllSalesCampaigns() {
    const query = `SELECT * FROM sales_campaigns;`;
    const [rows] = await pool.query(query);
    return rows;
  },

  // Fetch sales campaigns by product ID
  async getSalesCampaignsByProductId(productId) {
    const query = `SELECT * FROM sales_campaigns WHERE product_id = ?;`;
    const [rows] = await pool.query(query, [productId]);
    return rows;
  },

    // Insert a new sales campaign
    async createSalesCampaign(productId, discountPercent, startDate, endDate) {
        const query = `
            INSERT INTO sales_campaigns (product_id, discount_percent, start_date, end_date)
            VALUES (?, ?, ?, ?);
        `;
        const [result] = await pool.query(query, [
            productId,
            discountPercent,
            startDate,
            endDate,
        ]);
        return result.insertId;
  },

    // Delete a sales campaign by ID
    async deleteSalesCampaign(salesId) {
        const query = `DELETE FROM sales_campaigns WHERE sales_id = ?;`;
        const [result] = await pool.query(query, [salesId]);
        return result.affectedRows;
    },

    // Fetch all sales campaigns with product details
    async getAllSalesCampaignsWithDetails() {
        const query = `
            SELECT 
            s.sales_id,
            s.product_id,
            s.discount_percent,
            s.start_date,
            s.end_date,
            p.name AS product_name,
            CAST(p.price AS DECIMAL(10, 2)) AS original_price,
            CAST((p.price * (100 - s.discount_percent) / 100) AS DECIMAL(10, 2)) AS discounted_price,
            CASE
                WHEN CURDATE() BETWEEN s.start_date AND s.end_date THEN 'On-going'
                WHEN CURDATE() < s.start_date THEN 'Not Started'
                ELSE 'Ended'
            END AS campaign_status
            FROM sales_campaigns s
            JOIN products p ON s.product_id = p.product_id;
        `;
        const [rows] = await pool.query(query);

        // Convert prices to numbers
        return rows.map(row => ({
            ...row,
            original_price: parseFloat(row.original_price),
            discounted_price: parseFloat(row.discounted_price),
        }));
    },

    // Fetch filtered sales campaigns
    async getFilteredSalesCampaigns(filter) {
        // Get current date in YYYY-MM-DD format
        const currentDate = new Date().toISOString().split("T")[0];

        let query = `
            SELECT 
            s.sales_id,
            s.product_id,
            s.discount_percent,
            s.start_date,
            s.end_date,
            p.name AS product_name,
            CAST(p.price AS DECIMAL(10, 2)) AS original_price,
            CAST((p.price * (100 - s.discount_percent) / 100) AS DECIMAL(10, 2)) AS discounted_price,
            CASE
                WHEN CURDATE() BETWEEN s.start_date AND s.end_date THEN 'On-going'
                WHEN CURDATE() < s.start_date THEN 'Not Started'
                ELSE 'Ended'
            END AS campaign_status
            FROM sales_campaigns s
            JOIN products p ON s.product_id = p.product_id
        `;

        // Add filtering logic
        switch (filter) {
            case "ongoing":
            query += ` WHERE CURDATE() BETWEEN s.start_date AND s.end_date`;
            break;
            case "not-started":
            query += ` WHERE CURDATE() < s.start_date`;
            break;
            case "ended":
            query += ` WHERE CURDATE() > s.end_date`;
            break;
            default:
            // No filter, return all campaigns
            break;
        }

        const [rows] = await pool.query(query);

        // Convert prices to numbers
        return rows.map((row) => ({
            ...row,
            original_price: parseFloat(row.original_price),
            discounted_price: parseFloat(row.discounted_price),
        }));
    },

    // Check for overlapping sales campaigns
    async checkOverlappingSalesCampaign(productId, startDate, endDate) {
        const query = `
            SELECT COUNT(*) AS count
            FROM sales_campaigns
            WHERE product_id = ?
            AND (
                (start_date <= ? AND end_date >= ?) OR
                (start_date <= ? AND end_date >= ?) OR
                (start_date >= ? AND end_date <= ?)
            );
        `;
        const [rows] = await pool.query(query, [
            productId,
            startDate, startDate,
            endDate, endDate,
            startDate, endDate,
        ]);
        return rows[0].count > 0; // Return true if overlapping campaigns exist
    },

    // Fetch ongoing sales campaigns for products
    async getOngoingSalesCampaignsByDepartment(departmentId) {
        const query = `
            SELECT 
            s.product_id,
            s.discount_percent,
            p.price AS original_price,
            CAST((p.price * (100 - s.discount_percent) / 100) AS DECIMAL(10, 2)) AS discounted_price
            FROM sales_campaigns s
            JOIN products p ON s.product_id = p.product_id
            WHERE p.department_id = ?
            AND CURDATE() BETWEEN s.start_date AND s.end_date;
        `;
        const [rows] = await pool.query(query, [departmentId]);
        return rows;
    },

    // Fetch products with discounts for a specific department
    async getProductsWithDiscounts(departmentId) {
        const query = `
            SELECT 
            p.product_id,
            p.name,
            p.description,
            p.price AS original_price,
            p.image_url,
            p.popularity_score,
            s.discount_percent,
            CAST((p.price * (100 - s.discount_percent) / 100) AS DECIMAL(10, 2)) AS discounted_price,
            CASE
                WHEN CURDATE() BETWEEN s.start_date AND s.end_date THEN 'On-going'
                ELSE NULL
            END AS campaign_status
            FROM products p
            LEFT JOIN sales_campaigns s ON p.product_id = s.product_id
            AND CURDATE() BETWEEN s.start_date AND s.end_date
            WHERE p.department_id = ?;
        `;
        const [rows] = await pool.query(query, [departmentId]);
        return rows;
    },
};

module.exports = SalesCampaign;