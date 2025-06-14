const SalesCampaign = require("../models/salesCampaign");
const db = require('../config/database');
const Product = require('../models/product');
const { sendWishlistSaleNotification } = require('../mailer');

const salesCampaignController = {
    // Get all sales campaigns
    getAllSalesCampaigns: async (req, res) => {
        try {
            const campaigns = await SalesCampaign.getAllSalesCampaigns();

            // for logging
            console.log("Fetched sales campaigns:", campaigns);
            
            res.status(200).json(campaigns);
        } catch (error) {
            console.error("Error fetching sales campaigns:", error);
            res.status(500).json({ message: "Failed to fetch sales campaigns" });
        }
    },

    // Create a new sales campaign
    createSalesCampaign: async (req, res) => {
        try {
            const { productId, discountPercent, startDate, endDate } = req.body;

            if (!productId || !discountPercent || !startDate || !endDate) {
            console.error("Missing required fields:", { productId, discountPercent, startDate, endDate });
            return res.status(400).json({ message: "Missing required fields" });
            }

            // Check for overlapping sales campaigns
            const hasOverlap = await SalesCampaign.checkOverlappingSalesCampaign(productId, startDate, endDate);
            if (hasOverlap) {
            return res.status(400).json({ message: "Can't have multiple sales at the same time for the same product!" });
            }

            const salesId = await SalesCampaign.createSalesCampaign(productId, discountPercent, startDate, endDate);

            console.log("Created sales campaign:", { productId, discountPercent, startDate, endDate, salesId });
            res.status(201).json({ salesId });
        } catch (error) {
            console.error("Error creating sales campaign:", error);
            res.status(500).json({ message: "Failed to create sales campaign" });
        }
    },

    // Delete a sales campaign
    deleteSalesCampaign: async (req, res) => {
        try {
            const { salesId } = req.params;

            if (!salesId) {
                // for logging
                console.error("Sales ID is required");
                return res.status(400).json({ message: "Sales ID is required" });
            }

            const affectedRows = await SalesCampaign.deleteSalesCampaign(salesId);

            if (affectedRows === 0) {
                return res.status(404).json({ message: "Sales campaign not found" });
            }

            res.status(200).json({ message: "Sales campaign deleted successfully" });
        } catch (error) {
            console.error("Error deleting sales campaign:", error);
            res.status(500).json({ message: "Failed to delete sales campaign" });
        }
    },

    // Get all sales campaigns with product details
    getAllSalesCampaignsWithDetails: async (req, res) => {
        try {
            const campaigns = await SalesCampaign.getAllSalesCampaignsWithDetails();
            res.status(200).json(campaigns);
        } catch (error) {
            console.error("Error fetching sales campaigns with details:", error);
            res.status(500).json({ message: "Failed to fetch sales campaigns" });
        }
    },

    // Get filtered sales campaigns
    getFilteredSalesCampaigns: async (req, res) => {
        try {
            const { filter } = req.query; // Get the filter query parameter
            // for logging
            console.log("Filter for sales campaigns:", filter);
            const campaigns = await SalesCampaign.getFilteredSalesCampaigns(filter);
            res.status(200).json(campaigns);
        } catch (error) {
            console.error("Error fetching filtered sales campaigns:", error);
            res.status(500).json({ message: "Failed to fetch sales campaigns" });
        }
    },

    // Get products with discounts by department
    getProductsWithDiscountsByDepartment: async (req, res) => {
        try {
            const { departmentId } = req.params;

            if (!departmentId) {
            return res.status(400).json({ message: "Department ID is required" });
            }

            const ongoingSales = await SalesCampaign.getOngoingSalesCampaignsByDepartment(departmentId);
            res.status(200).json(ongoingSales);
        } catch (error) {
            console.error("Error fetching products with discounts:", error);
            res.status(500).json({ message: "Failed to fetch products with discounts" });
        }
    },

    getProductsWithDiscounts: async (req, res) => {
        try {
            const { departmentId } = req.params;

            if (!departmentId) {
            return res.status(400).json({ message: "Department ID is required" });
            }

            const productsWithDiscounts = await SalesCampaign.getProductsWithDiscounts(departmentId);
            res.status(200).json(productsWithDiscounts);
        } catch (error) {
            console.error("Error fetching products with discounts:", error);
            res.status(500).json({ message: "Failed to fetch products with discounts" });
        }
    },
};

module.exports = salesCampaignController;