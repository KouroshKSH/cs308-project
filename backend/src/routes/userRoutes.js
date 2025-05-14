const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const userController = require("../controllers/userController");

// Route to get user profile (requires authentication)
router.get("/profile", authMiddleware, userController.getUserProfile);

module.exports = router;