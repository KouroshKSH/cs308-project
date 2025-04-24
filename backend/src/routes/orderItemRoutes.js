const express = require('express');
const router = express.Router();

const orderItemController = require('../controllers/orderItemController');

router.get('/order/:orderId', orderItemController.getItemsByOrder);
router.patch('/:id', orderItemController.updateOrderItem);

module.exports = router;