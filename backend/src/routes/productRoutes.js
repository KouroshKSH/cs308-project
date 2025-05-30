const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { getProductsByCategory } = require("../controllers/productController");
const authMiddleware = require("../middleware/authMiddleware");

// Route to fetch products by department
// NOTE: "Women" is 2, "Men" is 1, "Kids" is 3
router.get(
  "/department/:departmentId",
  productController.getProductsByDepartment
);

// Route to fetch and sort products by price for a given department
router.get(
  "/department/:departmentId/sort/price",
  productController.getProductsByDepartmentSortedByPrice
);

// Route to fetch and sort products by popularity for a given department
router.get(
  "/department/:departmentId/sort/popularity",
  productController.getProductsByDepartmentSortedByPopularity
);

// Route to fetch reviews for a specific product
router.get("/:productId/reviews", productController.getProductReviews);

// Route to search by department
router.get(
  "/department/:departmentId/search",
  productController.searchProducts
);

// Route to fetch product variation stock status
router.get("/pv-stock", productController.getPvStock);

// Route to fetch unpriced products (where price is currently set as -1)
router.get("/get-unpriced-products", authMiddleware, productController.getUnpricedProducts);

// Route to set price for a product (requires authentication)
router.put("/set-price/:productId", authMiddleware, productController.setProductPrice);

// Route to get all the info of a product based on its ID
router.get("/:productId", productController.getProductInfo);

// Get the variations of a product given its ID
router.get("/:productId/variations", productController.getProductVariations);

// Route to delete a product variation
router.delete("/:productId/variations/:variationId", authMiddleware, productController.deleteProductVariation);

// Route to create a review for a product (requires authentication)
router.post(
  "/:productId/reviews",
  authMiddleware,
  productController.createProductReview
);
 
// Route to create a new product (requires authentication)
router.post('/add-product-with-variation', authMiddleware, productController.createProductWithVariations);

// Route to delete a product (requires authentication)
router.delete(
  "/delete-product/:productId", authMiddleware, productController.deleteProduct);

// Route to create a category under one or more departments
router.post("/categories/under-department", authMiddleware, productController.createCategoryUnderDepartments);

// Route to create a subcategory under one or more parent categories
router.post("/categories/under-category", authMiddleware, productController.createSubcategoryUnderCategories);

// ROUTE: Filter products by department and category
// Example: GET /api/products/filter/2/4
// Will return all products in department ID 2 (e.g., Women) and category ID 4 (e.g., Tops)
router.get(
  "/filter/:departmentId/:categoryId",
  productController.getFilteredProducts
);
router.get("/category/:categoryId", getProductsByCategory);

// Route to fetch all products
router.get("/", productController.getAllProducts);

module.exports = router;
