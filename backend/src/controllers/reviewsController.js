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