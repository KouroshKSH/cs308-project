const express = require('express');
const router = express.Router();

const orderController = require('../controllers/orderController');
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, orderController.createOrder);
router.get("/user", authMiddleware, orderController.getOrdersByUser);
router.get("/:id", orderController.getOrderById);
router.patch("/:id/status", orderController.updateOrderStatus);
router.delete("/:id", orderController.deleteOrder);

module.exports = router;
