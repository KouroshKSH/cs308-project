const express = require("express");
const { userModel } = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Login Endpoint
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await userModel.findByEmail(email);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if the password is valid
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) return res.status(401).json({ message: "Invalid credentials" });

    // Generate a JWT token
    const token = jwt.sign({ email: user.email, user_id: user.user_id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Set the token in cookies
    res.cookie("token", token, { httpOnly: true, secure: false }); // Use `secure: true` in production with HTTPS
    res.json({ message: "Login successful", token }); // Also return the token in the response
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;