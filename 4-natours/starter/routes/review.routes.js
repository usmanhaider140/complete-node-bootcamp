const reviewController = require('../controllers/review.controller');
const authController = require('../controllers/auth.controller');
const { protectRoute } = require('../utils/protectRoutes');

const router = require('express').Router({ mergeParams: true });

router
  .route('/')
  .get(protectRoute, reviewController.getAllReviews)
  .post(
    protectRoute,
    authController.restrictTo('user'),
    reviewController.createReview
  );

module.exports = router;
