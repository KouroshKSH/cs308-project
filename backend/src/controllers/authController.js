const { userModel } = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authController = {
  // Handles user registration
  register: async (req, res) => {
    try {
      // for now, we'll pass username, email and password
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({ message: "Username, email, and password are required"  });
      }

      // Check if the user already exists
      const existingUser = await userModel.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
      }

      // Create user (password will be hashed inside userModel)
      const result = await userModel.create({
        username,
        email,
        password,
      });

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

      if (!email || !password) {
        return res.status(400).json({ message: "Missing email or password" });
      }

      // Find user by email
      const user = await userModel.findByEmail(email);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Compare given password with stored hash
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid password" });
      }

      // Create JWT token with userId and role
      const token = jwt.sign(
        { userId: user.user_id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      return res.status(200).json({ token, message: "Login successful" });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Login failed" });
    }
  },
};

module.exports = authController;
