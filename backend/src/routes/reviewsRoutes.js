const express = require("express");
const router = express.Router();
const reviewsController = require("../controllers/reviewsController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, reviewsController.getAllReviews); // ?status=approved/pending/rejected
router.patch("/:reviewId/status", authMiddleware, reviewsController.updateReviewStatus);

module.exports = router;