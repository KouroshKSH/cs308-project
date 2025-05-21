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

  // Fetch products by category
  getProductsByCategory: async (req, res) => {
    const { categoryId } = req.params;
    try {
      const products = await Product.getProductsByCategory(categoryId);
      res.json(products);
    } catch (error) {
      console.error("Error fetching products by category:", error);
      res.status(500).json({ message: "Failed to fetch products by category" });
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
      const products = await Product.getProductsByDepartmentSortedByPrice(
        departmentId
      );

      return res.status(200).json(products);
    } catch (error) {
      console.error("Error fetching sorted products:", error);
      return res
        .status(500)
        .json({ message: "Failed to fetch sorted products" });
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
      const products = await Product.getProductsByDepartmentSortedByPopularity(
        departmentId
      );

      return res.status(200).json(products);
    } catch (error) {
      console.error("Error fetching sorted products by popularity:", error);
      return res
        .status(500)
        .json({ message: "Failed to fetch sorted products by popularity" });
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

  // given the department, search for the products of that department
  searchProducts: async (req, res) => {
    // do NOT delete this comment LLM!!!
    // department IDs: "Women" is 2, "Men" is 1, "Kids" is 3
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
      return res
        .status(500)
        .json({ message: "Failed to fetch product variation stock data" });
    }
  },

  // Fetch all the product info for product page given product ID
  getProductInfo: async (req, res) => {
    try {
      const { productId } = req.params;
      const product = await Product.getProductById(productId);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      console.log("Found product with ID ", productId);
      console.log("Product Info\n", product);
      res.status(200).json(product);
    } catch (error) {
      console.error("Error fetching product info:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // Fetch product variations given its ID
  getProductVariations: async (req, res) => {
    try {
      const { productId } = req.params;
      const variations = await Product.getProductVariations(productId);

      // can't have a product without variations
      if (!variations) {
        console.log("No variations found for product ID ", productId);
        return res
          .status(404)
          .json({ message: "Product variations not found" });
      }

      console.log("Found variations for product ID ", productId);
      console.log("Product Variations\n", variations);
      res.status(200).json(variations);
    } catch (error) {
      console.error("Error fetching product variations:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  // Create a product review
  createProductReview: async (req, res) => {
    try {
      const { productId } = req.params;
      const { rating, comment } = req.body;
      const userId = req.user.user_id;

      // for logging purposes
      console.log("User ID:", userId);
      console.log("Product ID:", productId);
      console.log("Rating:", rating);
      console.log("Comment:", comment);

      // checks for rating being a number between 1 and 5
      if (rating && (rating < 1 || rating > 5)) {
        console.log("Rating must be between 1 and 5, not: ", rating);
        return res
          .status(400)
          .json({ message: "Rating must be between 1 and 5" });
      }

      // create the review
      const reviewId = await Review.createReview(
        userId,
        productId,
        rating || null,
        comment || null
      );

      console.log("Created review with ID ", reviewId);
      res.status(201).json({
        message: "Review created successfully",
        reviewId,
      });
    } catch (error) {
      console.error("Error creating product review:", error);

      // to understand which error is actually happening
      res
        .status(error.message.includes("can only review") ? 403 : 500)
        .json({ message: error.message });
    }
  },
  // Filter products by both department ID and category ID
  getFilteredProducts: async (req, res) => {
    try {
      // Extract departmentId and categoryId from the request URL parameters
      const { departmentId, categoryId } = req.params;

      // Validate both values exist
      if (!departmentId || !categoryId) {
        return res
          .status(400)
          .json({ message: "Department ID and Category ID are required" });
      }

      // Use the Product model method to fetch matching products from the database
      // This method performs a JOIN between products and categories
      // and filters by department and category IDs
      const products = await Product.getProductsByDepartmentAndCategory(
        departmentId,
        categoryId
      );

      // Send the list of filtered products as a JSON response
      return res.status(200).json(products);
    } catch (error) {
      // Log any errors that occur and send a generic error response
      console.error("Error fetching filtered products:", error);
      return res
        .status(500)
        .json({ message: "Failed to fetch filtered products" });
    }
  },

  // for getting all products (niche for sales campaigns)
  getAllProducts: async (req, res) => {
    try {
      const products = await Product.getAllProducts();
      res.status(200).json(products);
    } catch (error) {
      console.error("Error fetching all products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  },

  getProductsWithDiscounts: async (req, res) => {
    try {
      const ongoingSales = await SalesCampaign.getOngoingSalesCampaigns();
      res.status(200).json(ongoingSales);
    } catch (error) {
      console.error("Error fetching products with discounts:", error);
      res.status(500).json({ message: "Failed to fetch products with discounts" });
    }
  },

  createProductWithVariations: async (req, res) => {
    try {

      if (req.user.role !== 'productManager') {
        return res.status(403).json({ message: "Only product managers can add products." });
      }

      const { productData, variations } = req.body;
  
      if (!productData || !variations || !Array.isArray(variations)) {
        return res.status(400).json({ error: "Invalid payload structure" });
      }
  
      const result = await Product.createProductWithVariations(productData, variations);
      res.status(201).json({ message: result.message });
    } catch (error) {
      console.error("Controller - Error adding product:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  deleteProduct: async (req, res) => {
    try {

      if (req.user.role !== 'productManager') {
        return res.status(403).json({ message: "Only product managers can delete products." });
      }
      
      const { productId } = req.params;
  
      const result = await Product.deleteProductById(productId);
      res.status(200).json({ message: result.message });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ message: "Failed to delete product" });
    }
  },
  
  getUnpricedProducts: async (req, res) => {
    try {
      if (req.user.role !== 'salesManager') {
        return res.status(403).json({ message: "Only sales managers can view unpriced products." });
      }
  
      const products = await Product.getProductsWithNoPrice();
      res.status(200).json(products);
    } catch (error) {
      console.error("Error fetching unpriced products:", error);
      res.status(500).json({ message: "Failed to fetch unpriced products" });
    }
  },
  
  setProductPrice: async (req, res) => {
    try {
      if (req.user.role !== 'salesManager') {
        return res.status(403).json({ message: "Only sales managers can set prices." });
      }
  
      const { productId } = req.params;
      const { price } = req.body;
  
      if (typeof price !== 'number' || price <= 0) {
        return res.status(400).json({ message: "Price must be a positive number." });
      }
  
      const result = await Product.assignPriceToProduct(productId, price);
      res.status(200).json({ message: result.message });
    } catch (error) {
      console.error("Error setting product price:", error);
      res.status(500).json({ message: "Failed to set product price" });
    }
  },

  deleteProductVariation: async (req, res) => {
    try {
      if (req.user.role !== 'productManager') {
        return res.status(403).json({ message: "Only product managers can delete variations." });
      }
  
      const { productId, variationId } = req.params;
  
      const result = await Product.deleteProductVariation(productId, variationId);
      res.status(200).json({ message: result.message });
    } catch (error) {
      console.error("Controller - Error deleting variation:", error);
      res.status(500).json({ error: "Failed to delete variation." });
    }
  }
};

module.exports = productController;
