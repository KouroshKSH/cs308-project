const express = require('express');
const router = express.Router();

const deliveriesController = require('../controllers/deliveriesController');

router.post('/', deliveriesController.createDelivery);
router.get('/', deliveriesController.getAllDeliveries);
router.get('/:orderId', deliveriesController.getDeliveryByOrder);
router.patch('/:id/status', deliveriesController.updateDeliveryStatus);

module.exports = router;