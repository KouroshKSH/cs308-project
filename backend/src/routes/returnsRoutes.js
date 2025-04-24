const express = require('express');
const router = express.Router();

const returnsController = require('../controllers/returnsController');

router.post('/', returnsController.createReturn);
router.get('/', returnsController.getAllReturns);
router.patch('/:id', returnsController.updateReturnStatus);

module.exports = router;