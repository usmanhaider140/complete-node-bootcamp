const router = require('express').Router();
const toursController = require('../controllers/tour.controller');

router.param('id', (req, res, next, val) => {
  console.log('Tour id is', val);
  next( );
});

router
  .route('/')
  .get(toursController.getAllTours)
  .post(toursController.createTour);
router
  .route('/:id')
  .get(toursController.getTourById)
  .patch(toursController.updateTourById)
  .delete(toursController.deleteTourById);

module.exports = router;
