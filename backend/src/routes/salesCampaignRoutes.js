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

module.exports = router;