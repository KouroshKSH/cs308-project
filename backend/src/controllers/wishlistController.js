const Wishlist = require('../models/wishlist');

exports.getWishlistByUser = async (req, res) => {
  try {
    const user_id = req.user.user_id
    const wishlist = await Wishlist.getWishlistByUserId(user_id);
    res.json(wishlist);
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ message: 'Error fetching wishlist' });
  }
};

exports.addToWishlist = async (req, res) => {
    try {
      const user_id = req.user.user_id;
      const { product_id, variation_id } = req.body;
  
      const wishlistId = await Wishlist.addToWishlist(user_id, product_id, variation_id ?? null);
      res.status(201).json({ message: 'Item added to wishlist', wishlistId });
  
    } catch (error) {
      if (error.message === 'Item already in wishlist') {
        return res.status(409).json({ message: 'This item is already in your wishlist.' });
      }
  
      console.error('Error adding to wishlist:', error);
      res.status(500).json({ message: 'Error adding to wishlist' });
    }
};  

exports.removeFromWishlist = async (req, res) => {
  try {
    const user_id = req.user.user_id
    const { product_id, variation_id } = req.body;
    const result = await Wishlist.removeFromWishlist(user_id, product_id, variation_id);
    if (result > 0) {
      res.json({ message: 'Item removed from wishlist' });
    } else {
      res.status(404).json({ message: 'Item not found in wishlist' });
    }
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({ message: 'Error removing from wishlist' });
  }
};
