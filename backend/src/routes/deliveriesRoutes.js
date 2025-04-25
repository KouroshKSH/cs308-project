const express = require('express');
const router = express.Router();

const deliveriesController = require('../controllers/deliveriesController');
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, deliveriesController.createDelivery);
router.get("/", authMiddleware, deliveriesController.getAllDeliveries);
router.get("/:orderId", authMiddleware, deliveriesController.getDeliveryByOrder);
router.patch("/:id/status", authMiddleware, deliveriesController.updateDeliveryStatus);

module.exports = router;