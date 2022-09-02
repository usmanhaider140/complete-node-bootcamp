const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const AppError = require('./appError');
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
  console.log(decoded);
  //  3) Check if user still exists
  //  4) Check if user is confirmed
  //  5) Check if user is an admin
  //  6) Set user and role to req.user and req.role
  //  7) Call next()
  next();
});
