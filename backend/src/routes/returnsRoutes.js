const express = require('express');
const router = express.Router();

const returnsController = require('../controllers/returnsController');
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, returnsController.createReturn);
router.get("/", authMiddleware, returnsController.getAllReturns);
router.patch("/:id", authMiddleware, returnsController.updateReturnStatus);

module.exports = router;