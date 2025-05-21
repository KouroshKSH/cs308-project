const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

// GET /api/categories
router.get("/", categoryController.getAllCategories);

// GET /api/categories/descendants/:categoryId
router.get("/descendants/:categoryId", categoryController.getDescendants);


module.exports = router;