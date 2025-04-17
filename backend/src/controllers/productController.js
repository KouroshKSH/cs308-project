// const { Product } = require("../models/product");
const Product = require("../models/product");
const Review = require("../models/reviews");

const productController = {
  // Fetch products by department
  // NOTE: "Women" is 2, "Men" is 1, "Kids" is 3
  getProductsByDepartment: async (req, res) => {
    try {
      const { departmentId } = req.params;

      if (!departmentId) {
        return res.status(400).json({ message: "Department ID is required" });
      }

      // Fetch products using the Product model
      const products = await Product.getProductsByDepartment(departmentId);
      console.log("Fetched products successfully:\n", products);
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

      // Fetch and sort products using the Product model
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

      // Fetch and sort products using the Product model
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

      // this will not care if there are NO reviews (0 comments and 0 ratings)
      // it'll still be 200 OK since some products might not have any reviews
      // do NOT change the logic here by saying `if (reviews.length === 0) return res.status(404).json({ message: "No reviews found" })`

    } catch (error) {
      console.error("Error fetching product reviews:", error);
      return res.status(500).json({ message: "Failed to fetch reviews" });
    }
  },

  searchProducts: async (req, res) => {
    const { departmentId } = req.params;
    const query = req.query.q;

    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
    }

    try {
      const results = await Product.searchProducts(query, departmentId);
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