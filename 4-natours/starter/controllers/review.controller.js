const Review = require('../models/review.model');
const Factory = require('./handlingFactory');

exports.getAllReviews = Factory.getAll(Review);
exports.setTourUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.createReview = Factory.createOne(Review);
exports.getReviewById = Factory.getOne(Review);
exports.updateReview = Factory.updateOne(Review);
exports.deleteReview = Factory.deleteOne(Review);
