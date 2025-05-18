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
};

module.exports = SalesCampaign;