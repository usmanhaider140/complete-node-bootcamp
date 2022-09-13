const router = require('express').Router();

router.use('/tours', require('./tour.routes'));
router.use('/users', require('./user.routes'));
router.use('/reviews', require('./review.routes'));
module.exports = router;
