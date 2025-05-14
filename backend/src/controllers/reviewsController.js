const Review = require("../models/reviews");

exports.getAllReviews = async (req, res) => {
  try {
    const status = req.query.status || "all";
    const reviews = await Review.getAllReviewsByStatus(status);
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateReviewStatus = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { newStatus } = req.body;
    await Review.updateReviewStatus(reviewId, newStatus);
    res.json({ message: "Review status updated." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const userId = req.user.user_id;
    const { rating, comment } = req.body;

    if (rating === undefined && comment === undefined) {
      return res.status(400).json({ error: 'At least one of rating or comment must be provided.' });
    }

    const result = await Review.updateReview(reviewId, userId, rating, comment);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Review not found or unauthorized.' });
    }

    res.json({ message: 'Review updated successfully and marked pending for re-approval.' });
  } catch (err) {
    console.error('Error updating review:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};
