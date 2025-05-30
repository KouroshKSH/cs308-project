const express = require('express');
const router = express.Router();

const orderController = require('../controllers/orderController');
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, orderController.createOrder);
router.get("/user", authMiddleware, orderController.getOrdersByUser);
router.get("/with-items/:id", authMiddleware, orderController.getOrderWithItems);
router.get("/orders-between-dates", authMiddleware, orderController.getOrdersBetweenDates);
router.patch("/:orderId/cancel", authMiddleware, orderController.cancelOrder);
router.get("/:id", orderController.getOrderById);
router.patch("/:id/status", orderController.updateOrderStatus);
router.delete("/:id", orderController.deleteOrder);
router.get("/stats/products", authMiddleware, orderController.getProductSalesStats);
router.get("/stats/variations", authMiddleware, orderController.getVariationSalesStats);
router.get("/stats/variations/product/:productId", authMiddleware, orderController.getVariationSalesStatsByProduct);
router.get('/stats/daily-revenue-profit', authMiddleware, orderController.getDailyRevenueAndProfit);
router.get('/stats/cumulative', authMiddleware, orderController.getCumulativeRevenueAndProfit);
router.get('/stats/cumulative/date-range', authMiddleware, orderController.getCumulativeRevenueAndProfitBetweenDates);
router.get('/stats/daily-revenue-profit/date-range', authMiddleware, orderController.getDailyRevenueAndProfitBetweenDates);
router.get("/with-items-public/:id", orderController.getOrderWithItemsPublic);

module.exports = router;
