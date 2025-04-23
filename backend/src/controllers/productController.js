const Product = require("../models/product");
const Review = require("../models/reviews");

const productController = {
  // Fetch products by department
  getProductsByDepartment: async (req, res) => {
    try {
      const { departmentId } = req.params;
      if (!departmentId) {
        return res.status(400).json({ message: "Department ID is required" });
      }

      const products = await Product.getProductsByDepartment(departmentId);
      return res.status(200).json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      return res.status(500).json({ message: "Failed to fetch products" });
    }
  },

  // Fetch and sort products by price for a given department
  getProductsByDepartmentSortedByPrice: async (req, res) => {
    try {
      const { departmentId } = req.params;
      if (!departmentId) {
        return res.status(400).json({ message: "Department ID is required" });
      }

      const products = await Product.getProductsByDepartmentSortedByPrice(departmentId);
      return res.status(200).json(products);
    } catch (error) {
      console.error("Error fetching sorted products:", error);
      return res.status(500).json({ message: "Failed to fetch sorted products" });
    }
  },

  // Fetch and sort products by popularity for a given department
  getProductsByDepartmentSortedByPopularity: async (req, res) => {
    try {
      const { departmentId } = req.params;
      if (!departmentId) {
        return res.status(400).json({ message: "Department ID is required" });
      }

      const products = await Product.getProductsByDepartmentSortedByPopularity(departmentId);
      return res.status(200).json(products);
    } catch (error) {
      console.error("Error fetching sorted products by popularity:", error);
      return res.status(500).json({ message: "Failed to fetch sorted products by popularity" });
    }
  },

  // Get reviews by productId
  getProductReviews: async (req, res) => {
    try {
      const { productId } = req.params;
      if (!productId) {
        return res.status(400).json({ message: "Product ID is required" });
      }

      const reviews = await Review.getReviewsByProductId(productId);
      return res.status(200).json(reviews);
    } catch (error) {
      console.error("Error fetching product reviews:", error);
      return res.status(500).json({ message: "Failed to fetch reviews" });
    }
  },

  // Search products by name in a given department
  searchProducts: async (req, res) => {
    const { departmentId } = req.params;
    const query = req.query.q; // Fetch the search query from the query parameter

    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
    }

    try {
      // Search for products by name and departmentId, using case-insensitive matching
      const results = await Product.searchProducts(query, departmentId);

      if (results.length === 0) {
        return res.status(404).json({ message: "No products found" });
      }

      res.status(200).json(results);
    } catch (err) {
      console.error("Search error:", err.message);
      res.status(500).json({ error: "Search failed" });
    }
  },

  // Fetch product variation stock status from 'variation_stock_view'
  getPvStock: async (req, res) => {
    try {
      const stockData = await Product.getPvStock();
      res.status(200).json(stockData);
    } catch (error) {
      console.error("Error fetching stock data:", error);
      return res.status(500).json({ message: "Failed to fetch product variation stock data" });
    }
  },
};

module.exports = productController;
