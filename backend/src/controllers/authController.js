const { userModel } = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Cart = require("../models/cart");

const authController = {
  // Handles user registration
  register: async (req, res) => {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({ message: "Username, email, and password are required" });
      }

      const existingUser = await userModel.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
      }

      const result = await userModel.create({ username, email, password });
      const user = await userModel.findByEmail(email);

      const token = jwt.sign(
        { user_id: user.user_id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "3h" }
      );

      const session_id = req.headers["x-session-id"];
      console.log("Session ID:", session_id);

      if (session_id) {
        await Cart.updateCartUserId(user.user_id, session_id);
      }

      return res.status(201).json({
        message: "User registered successfully",
        user_id: result.insertId,
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

      const user = await userModel.findByEmail(email);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid password" });
      }

      const token = jwt.sign(
        { user_id: user.user_id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "3h" }
      );

      const session_id = req.headers["x-session-id"];
      console.log("Session ID:", session_id);

      if (session_id) {
        await Cart.updateCartUserId(user.user_id, session_id);
      }

      return res.status(200).json({ token, message: "Login successful" });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Login failed" });
    }
  },

  // Handles manager login
  loginManager: async (req, res) => {
    try {
      const { email, password, role } = req.body;

      if (!email || !password || !role) {
        return res.status(400).json({ message: "Missing email, password, or role" });
      }

      const user = await userModel.findByEmail(email);
      if (!user || user.role.toLowerCase() !== role.toLowerCase()) {
        return res.status(404).json({ message: "Invalid credentials or role mismatch" });
      }

      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid password" });
      }

      const token = jwt.sign(
        { user_id: user.user_id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "3h" }
      );

      return res.status(200).json({ token, message: "Manager login successful" });
    } catch (error) {
      console.error("Manager login error:", error);
      return res.status(500).json({ message: "Manager login failed" });
    }
  },
};

module.exports = authController;
