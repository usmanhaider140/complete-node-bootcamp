const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const AppError = require('./appError');
const User = require('../models/user.model');
const catchAsync = require('./catchAsync');

exports.protectRoute = catchAsync(async (req, res, next) => {
  //  1) Get token and check if it exists
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer')) {
    return next(new AppError('You are not logged in', 401));
  }
  const token = authorization.split(' ')[1];
  // Check the validity of the token
  if (!token) {
    return next(
      new AppError('You are not logged in. Please login to get access.', 401)
    );
  }
  //  2) Check if token is not expired
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  //  3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token does not exist', 401)
    );
  }

  //  4) Check if user changed password after the token was issued

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }
  // Grant access to protected route
  req.user = currentUser;
  next();
});
