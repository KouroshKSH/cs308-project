const express = require("express");
const { userModel } = require("../models/user");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Middleware to authenticate user via token
const authenticateUser = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    console.log("Token is missing");
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);
    req.user = decoded; // Attach user info to the request
    next();
  } catch (err) {
    console.log("Invalid token:", err.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Route to get user info
router.get("/profile", authenticateUser, async (req, res) => {
  try {
    const user = await userModel.findByEmail(req.user.email);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Return only relevant user info
    const { username, email, address, phone_number } = user;
    res.json({ username, email, address: address || "Not Specified", phone_number: phone_number || "Not Specified" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;