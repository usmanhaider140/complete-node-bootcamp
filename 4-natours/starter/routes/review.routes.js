const reviewController = require('../controllers/review.controller');
const authController = require('../controllers/auth.controller');
const { protectRoute } = require('../utils/protectRoutes');

const router = require('express').Router({ mergeParams: true });
router.use(protectRoute);
router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview
  );
router
  .route('/:id')
  .get(reviewController.getReviewById)
  .patch(
    authController.restrictTo('admin', 'user'),
    reviewController.updateReview
  )
  .delete(
    authController.restrictTo('admin', 'user'),
    reviewController.deleteReview
  );
module.exports = router;
