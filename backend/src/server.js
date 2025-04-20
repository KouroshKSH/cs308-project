require("dotenv").config();
const express = require("express");
const cors = require("cors");
const routes = require("./routes");

const app = express();

app.use(express.json()); // a middleware to parse JSON request bodies
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true
}));

app.use((req, res, next) => {
    console.log("METHOD:", req.method);
    console.log("PATH:", req.path);
    console.log("BODY:", req.body); // <-- confirm JSON is parsed
    next();
});

app.use("/api", routes); // All routes use /api prefix

app.get("/", (req, res) => res.send("API is running..."));

app.post("/test-body", (req, res) => {
    console.log("TEST BODY:", req.body);
    res.json({ received: req.body });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
