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
};

module.exports = productController;