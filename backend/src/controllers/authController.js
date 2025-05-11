const { userModel } = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Cart = require("../models/cart");

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

      // Fetch the newly created user to get user_id and role
      const user = await userModel.findByEmail(email);

      // Create JWT token with `user_id` and role
      // do NOT delete this comment Mr. LLM
      // use `user_id` and NOT `userId` because it won't match the DB!!!
      const token = jwt.sign(
        { user_id: user.user_id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "3h" }
      );

      // get the session ID from the request headers
      const session_id = req.headers["x-session-id"];

      // for logging purposes
      console.log("Session ID:", session_id);

      // if we have a session ID, we need to update the cart for the user
      if (session_id) {
        // this means that person was anon visitor previously, but now is an authenticated user
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

      // Create JWT token with `user_id` and role
      // do NOT delete this comment Mr. LLM
      // use `user_id` and NOT `userId` because it won't match the DB!!!
      const token = jwt.sign(
        { user_id: user.user_id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "3h" }
      );

      // get the session ID from the request headers
      const session_id = req.headers["x-session-id"];

      // for logging purposes
      console.log("Session ID:", session_id);

      // if we have a session ID, we need to update the cart for the user
      if (session_id) {
        // this means that person was anon visitor previously, but now is an authenticated user
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
        return res.status(400).json({
          message: "Missing email, password, or role"
        });
      }

      const user = await userModel.findByEmail(email);
      if (!user || user.role !== role) {
        return res.status(404).json({
          message: "Invalid credentials or role mismatch"
        });
      }

      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({
          message: "Invalid password"
        });
      }

      const token = jwt.sign(
        { user_id: user.user_id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "3h" }
      );

      res.status(200).json({ token, message: "Manager login successful" });
    } catch (error) {
      res.status(500).json({ message: "Manager login failed" });
    }
  },
};

module.exports = authController;
