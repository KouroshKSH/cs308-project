// const { Product } = require("../models/product");
const Product = require("../models/product");

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
};

module.exports = productController;