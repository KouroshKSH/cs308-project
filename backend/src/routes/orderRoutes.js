const express = require('express');
const router = express.Router();

const orderController = require('../controllers/orderController');

router.post('/', orderController.createOrder);
router.get('/:id', orderController.getOrderById);
router.get('/user/:userId', orderController.getOrdersByUser);
router.patch('/:id/status', orderController.updateOrderStatus);
router.delete('/:id', orderController.deleteOrder);

module.exports = router;
