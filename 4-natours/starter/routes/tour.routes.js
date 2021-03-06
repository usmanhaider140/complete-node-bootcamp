const router = require('express').Router();
const toursController = require('../controllers/tour.controller');

router.get(
  '/top-5-cheap',
  toursController.aliasTopTours,
  toursController.getAllTours
);

router.get('/tour-stats', toursController.getTourStats);
router.get('/monthly-plan/:year', toursController.getMonthlyPlan);
router.get('/', toursController.getAllTours);
router.post('/', toursController.createTour);

router
  .route('/:id')
  .get(toursController.getTourById)
  .patch(toursController.updateTourById)
  .delete(toursController.deleteTourById);

module.exports = router;
