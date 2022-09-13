const router = require('express').Router();
const toursController = require('../controllers/tour.controller');
const { protectRoute } = require('../utils/protectRoutes');
const authController = require('../controllers/auth.controller');
const reviewRouter = require('./review.routes');
router.get(
  '/top-5-cheap',
  toursController.aliasTopTours,
  toursController.getAllTours
);

router.get('/tour-stats', toursController.getTourStats);
router.get('/monthly-plan/:year', toursController.getMonthlyPlan);
router.get('/', protectRoute, toursController.getAllTours);
router.post('/', toursController.createTour);

router
  .route('/:id')
  .get(toursController.getTourById)
  .patch(toursController.updateTourById)
  .delete(
    protectRoute,
    authController.restrictTo('admin', 'lead-guide'),
    toursController.deleteTourById
  );

router.use('/:tourId/reviews', reviewRouter);

// router
//   .route('/:tourId/reviews')
//   .post(
//     protectRoute,
//     authController.restrictTo('user'),
//     reviewController.createReview
//   );

module.exports = router;
