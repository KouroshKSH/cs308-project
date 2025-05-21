const Category = require("../models/category");

const categoryController = {
  getAllCategories: async (req, res) => {
    try {
      const categories = await Category.getAllWithParent();
      res.status(200).json(categories);
    } catch (err) {
      console.error("Error fetching categories:", err);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  },

    getDescendants: async (req, res) => {
        try {
        const { categoryId } = req.params;
        const descendants = await Category.getDescendants(categoryId);
        res.status(200).json(descendants);
        } catch (err) {
        console.error("Error fetching descendants:", err);
        res.status(500).json({ message: "Failed to fetch descendants" });
        }
  },
};

module.exports = categoryController;