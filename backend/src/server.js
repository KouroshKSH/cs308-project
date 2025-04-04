require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser"); // to parse cookies from incoming requests (e.g., dynamic user info)
const routes = require("./routes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(express.json());
app.use(cookieParser()); // Use cookie-parser middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// All API endpoints are now prefixed with /api
app.use('/api', routes); // FIX: i guess we should use this
// app.use('/', routes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes); // Register the auth routes under /api/auth

// Simple health-check route
app.get("/", (req, res) => res.send("API is running..."));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));