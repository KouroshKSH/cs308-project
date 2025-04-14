const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// Route to fetch products by department
// NOTE: "Women" is 2, "Men" is 1, "Kids" is 3
router.get("/department/:departmentId", productController.getProductsByDepartment);

// Route to fetch and sort products by price for a given category
router.get("/category/:categoryId/sort/price", productController.getProductsByCategorySortedByPrice);

module.exports = router;