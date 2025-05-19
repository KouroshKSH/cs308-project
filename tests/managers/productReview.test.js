// tests/managers/productReviewManagerTests.js
const reviewsController = require('../../backend/src/controllers/reviewsController');
const Review = require('../../backend/src/models/reviews');

// Mock the database module
jest.mock('../../backend/src/models/reviews');

describe('Product Review Management Tests', () => {
  let req, res;
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup mock request and response objects
    req = {
      params: {},
      query: {},
      body: {}
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  test('getAllReviews should fetch all reviews when status is not specified', async () => {
    // Arrange
    req.query.status = 'all';
    const mockReviews = [
      { review_id: 1, product_id: 1, comment: 'Great product', comment_approval: 'pending' }
    ];
    Review.getAllReviewsByStatus.mockResolvedValue(mockReviews);
    
    // Act
    await reviewsController.getAllReviews(req, res);
    
    // Assert
    expect(Review.getAllReviewsByStatus).toHaveBeenCalledWith('all');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockReviews);
  });

  test('getAllReviews should fetch reviews by status when specified', async () => {
    // Arrange
    req.query.status = 'pending';
    const mockReviews = [
      { review_id: 1, product_id: 1, comment: 'Great product', comment_approval: 'pending' }
    ];
    Review.getAllReviewsByStatus.mockResolvedValue(mockReviews);
    
    // Act
    await reviewsController.getAllReviews(req, res);
    
    // Assert
    expect(Review.getAllReviewsByStatus).toHaveBeenCalledWith('pending');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockReviews);
  });

  test('updateReviewStatus should update a review status', async () => {
    // Arrange
    req.params.reviewId = '1';
    req.body.newStatus = 'approved';
    Review.updateReviewStatus.mockResolvedValue({ affectedRows: 1 });
    
    // Act
    await reviewsController.updateReviewStatus(req, res);
    
    // Assert
    expect(Review.updateReviewStatus).toHaveBeenCalledWith('1', 'approved');
    expect(res.json).toHaveBeenCalledWith({ message: 'Review status updated.' });
  });

  test('updateReviewStatus should handle errors', async () => {
    // Arrange
    req.params.reviewId = '1';
    req.body.newStatus = 'approved';
    const error = new Error('Database error');
    Review.updateReviewStatus.mockRejectedValue(error);
    
    // Act
    await reviewsController.updateReviewStatus(req, res);
    
    // Assert
    expect(Review.updateReviewStatus).toHaveBeenCalledWith('1', 'approved');
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: error.message });
  });

  test('updateReview should update user review', async () => {
    // Arrange
    req.params.id = '1';
    req.user = { user_id: 5 };
    req.body = { rating: 4, comment: 'Updated review' };
    Review.updateReview.mockResolvedValue({ affectedRows: 1 });
    
    // Act
    await reviewsController.updateReview(req, res);
    
    // Assert
    expect(Review.updateReview).toHaveBeenCalledWith('1', 5, 4, 'Updated review');
    expect(res.json).toHaveBeenCalledWith({ 
      message: 'Review updated successfully and marked pending for re-approval.' 
    });
  });
});