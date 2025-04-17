require("dotenv").config();
const express = require("express");
const cors = require("cors");
const routes = require("./routes");

const app = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.use("/api", routes); // All routes use /api prefix

app.get("/", (req, res) => res.send("API is running..."));

// Eski portu yorum haline getirdik ve yeni port numarasını atadık
// const PORT = process.env.PORT || 5000;  // Eski port
const PORT = process.env.PORT || 5012;  // Yeni port (örneğin 5012) 

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
