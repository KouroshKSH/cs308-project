const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, wishlistController.getWishlistByUser);
router.post('/add', authMiddleware, wishlistController.addToWishlist);
router.delete('/remove', authMiddleware, wishlistController.removeFromWishlist);

module.exports = router;