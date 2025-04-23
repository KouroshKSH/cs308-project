const readline = require('readline');
const reviewModel = require('./models/reviews');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const prompt = (q) => new Promise((resolve) => rl.question(q, resolve));

const showMenu = async () => {
  console.log('\n--- Review Moderation CLI ---');
  console.log('1. See all reviews');
  console.log('2. See approved reviews');
  console.log('3. See pending reviews');
  console.log('4. See rejected reviews');
  console.log('5. Exit');
  const choice = await prompt('Choose an option: ');
  return choice.trim();
};

const showReviewsByStatus = async (status) => {
  const reviews = await reviewModel.getAllReviewsByStatus(status);

  if (reviews.length === 0) {
    console.log(`No ${status} reviews found.`);
    return;
  }

  console.log(`\n--- ${status.toUpperCase()} Reviews ---`);
  reviews.forEach((review) => {
    console.log(`ID: ${review.review_id}, Product ID: ${review.product_id}, User ID: ${review.user_id}, Comment: ${review.comment}, Status: ${review.comment_approval}`);
  });
};

const moderatePendingReviews = async () => {
    while (true) {
      const reviews = await reviewModel.getAllReviewsByStatus('pending');
  
      if (reviews.length === 0) {
        console.log('No pending reviews to moderate.');
        return;
      }
  
      console.log(`\n--- PENDING Reviews ---`);
      reviews.forEach((review) => {
        console.log(`ID: ${review.review_id}, Product ID: ${review.product_id}, User ID: ${review.user_id}, Comment: ${review.comment}, Status: ${review.comment_approval}`);
      });
  
      const reviewId = await prompt('\nEnter review ID to moderate (or press Enter to return to main menu): ');
      if (!reviewId) return;
  
      const action = await prompt('1. Approve\n2. Reject\nChoose an action: ');
      if (action === '1') {
        await reviewModel.updateReviewStatus(reviewId, 'approved');
        console.log('Comment approved!');
      } else if (action === '2') {
        await reviewModel.updateReviewStatus(reviewId, 'rejected');
        console.log('Comment rejected.');
      } else {
        console.log('Invalid action.');
      }
    }
  };  

const startCLI = async () => {
  while (true) {
    const choice = await showMenu();
    if (choice === '1') {
      await showReviewsByStatus('all');
    } else if (choice === '2') {
      await showReviewsByStatus('approved');
    } else if (choice === '3') {
      await moderatePendingReviews();
    } else if (choice === '4') {
      await showReviewsByStatus('rejected');
    } else if (choice === '5') {
      console.log('Exiting...');
      rl.close();
      process.exit(0);
    } else {
      console.log('Invalid choice. Try again.');
    }
  }
};

startCLI();
