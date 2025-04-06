const { userModel } = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authController = {
  // Handles user registration
  register: async (req, res) => {
    try {
      const { email, password, address, phone_number } = req.body;

      // Check if required fields are provided
      if (!email || !password) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Check if a user with the same email already exists
      const existingUser = await userModel.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
      }

      // Generate a unique username based on email prefix and a random number
      const emailPrefix = email.split("@")[0];
      const randomSix = Math.floor(100000 + Math.random() * 900000);
      const username = `${emailPrefix}_${randomSix}`;

      // Create the new user in the database
      const result = await userModel.create({
        username,
        email,
        password,
        address,
        phone_number,
      });

      // Return success response with the new user's ID
      return res.status(201).json({
        message: "User registered successfully",
        userId: result.insertId,
      });
    } catch (error) {
      console.error("Registration error:", error);
      return res.status(500).json({ message: "Registration failed" });
    }
  },

  // Handles user login
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return res.status(400).json({ message: "Missing email or password" });
      }

      // Look up the user by email
      const user = await userModel.findByEmail(email);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Compare provided password with stored hash
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid password" });
      }

      // Generate JWT token containing user ID and role
      const token = jwt.sign(
        { userId: user.user_id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      // Return token and success message
      return res.status(200).json({ token, message: "Login successful" });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Login failed" });
    }
  },
};

module.exports = authController;
