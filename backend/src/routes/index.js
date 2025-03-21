const express = require('express');
const router = express.Router();
const { authController } = require('../controllers/authController'); // Correctly import authController

// Register route
router.post('/register', authController.register);

// Login route
router.post('/auth/login', authController.login);

module.exports = router;