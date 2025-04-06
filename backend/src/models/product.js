// backend/src/models/product.js

const { DataTypes } = require("sequelize");
const sequelize = require("../../config/db");

// Define the Product model that maps to the 'products' table in the database
const Product = sequelize.define(
  "Product",
  {
    // Name of the product
    name: DataTypes.STRING,

    // Detailed description of the product
    description: DataTypes.TEXT,

    // Price of the product (floating point number)
    price: DataTypes.FLOAT,

    // Available stock quantity
    stock: DataTypes.INTEGER,
  },
  {
    // Explicitly map this model to the 'products' table
    tableName: "products",

    // Disable automatic createdAt and updatedAt timestamps
    timestamps: false,
  }
);

module.exports = Product;
