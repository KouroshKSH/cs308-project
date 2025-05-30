// backend/src/index.js
const express = require("express");
const app = express();

// Route files
const cartRoutes = require("./routes/cartRoutes");
const productRoutes = require("./routes/productRoutes");

// TODO: no Turkish comments please!!!
// diğer middleware'ler
app.use(express.json());

app.use("/api/cart", cartRoutes);

app.use("/api/products", productRoutes);
// TODO: no Turkish comments please!!!
// port ayarları vs.
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
