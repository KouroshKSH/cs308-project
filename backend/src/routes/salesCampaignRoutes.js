const express = require("express");
const router = express.Router();
const salesCampaignController = require("../controllers/salesCampaignController");

// Route to fetch all sales campaigns
router.get("/", salesCampaignController.getAllSalesCampaigns);

// Route to create a new sales campaign
router.post("/", salesCampaignController.createSalesCampaign);

// Route to delete a sales campaign
router.delete("/:salesId", salesCampaignController.deleteSalesCampaign);

// Route to fetch filtered sales campaigns (default is all)
router.get("/details", salesCampaignController.getFilteredSalesCampaigns);

// Route to fetch products with discounts
router.get("/discounts", salesCampaignController.getProductsWithDiscounts);

// Route to fetch products with discounts for a specific department
router.get("/discounts/department/:departmentId", salesCampaignController.getProductsWithDiscountsByDepartment);

// Route to fetch products with discounts for a specific department
router.get("/products-with-discounts/:departmentId", salesCampaignController.getProductsWithDiscounts);

module.exports = router;