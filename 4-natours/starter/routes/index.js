const router = require('express').Router();

router.use('/tours', require('./tour.routes'));
router.use('/users', require('./user.routes'));

module.exports = router;
