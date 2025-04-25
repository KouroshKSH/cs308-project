// backend/src/index.js
const express = require("express");
const app = express();
const cartRoutes = require("./routes/cartRoutes");
const userRoutes = require("./routes/userRoutes");

// REMINDER: no Turkish comments please!!!
app.use(express.json());

// anything related to cart
app.use("/api/cart", cartRoutes);

// anything related to user
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
