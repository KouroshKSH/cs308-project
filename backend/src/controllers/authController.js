const { userModel } = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const authController = {
  register: async (req, res) => {
    try {
      const { email, password, address, phone_number } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      // Check if user already exists by email
      const existingUser = await userModel.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
      }
      
      // Generate a unique username from email.
      // E.g., for "john.doe@email.com", extract "john.doe"
      const emailPrefix = email.split('@')[0];
      const randomSix = Math.floor(100000 + Math.random() * 900000); // generates a 6-digit number
      const username = `${emailPrefix}_${randomSix}`;

      // Create new user using generated username and provided data
      const result = await userModel.create({ username, email, password, address, phone_number });
      
      return res.status(201).json({ message: "User registered successfully", userId: result.insertId });
    } catch (error) {
      console.error("Registration error:", error);
      return res.status(500).json({ message: "Registration failed" });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Missing email or password" });
      }
      
      // Find user by email
      const user = await userModel.findByEmail(email);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Compare password
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid password" });
      }
      
      // Generate JWT
      const token = jwt.sign(
        { userId: user.user_id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      
      return res.status(200).json({ token, message: "Login successful" });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Login failed" });
    }
  }
};

module.exports = { authController };
