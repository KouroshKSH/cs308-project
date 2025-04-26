const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// Route to fetch products by department
// NOTE: "Women" is 2, "Men" is 1, "Kids" is 3
router.get("/department/:departmentId", productController.getProductsByDepartment);

// Route to fetch and sort products by price for a given department
router.get("/department/:departmentId/sort/price", productController.getProductsByDepartmentSortedByPrice);

// Route to fetch and sort products by popularity for a given department
router.get("/department/:departmentId/sort/popularity", productController.getProductsByDepartmentSortedByPopularity);

// Route to fetch reviews for a specific product
router.get("/:productId/reviews", productController.getProductReviews);

// Route to search by department
router.get("/department/:departmentId/search", productController.searchProducts);

// Route to fetch product variation stock status
router.get("/pv-stock", productController.getPvStock);

// Route to get all the info of a product based on its ID
router.get("/:productId", productController.getProductInfo);

// Get the variations of a product given its ID
router.get("/:productId/variations", productController.getProductVariations);

module.exports = router;