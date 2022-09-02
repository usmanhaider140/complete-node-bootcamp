const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleCastDuplicateErrorDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value ${value} entered. Please use another value`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const message = Object.values(err.errors).map((val) => val.message);
  return new AppError(message.join(' and '), 400);
};

const devError = (err, req, res, next) => {
  res.status(err.statusCode).json({
    message: err.message,
    status: err.status,
    error: err,
    stack: err.stack,
  });
};

const prodError = (err, req, res, next) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      message: err.message,
      status: err.status,
    });
  } else {
    res.status(500).json({
      message: 'Something went wrong',
      status: 'error',
    });
  }
};

const handleJwtError = (err = new AppError(
  'Invalid token. Please log in again.',
  401
));

const handleJwtExpiredError = (err = new AppError(
  'Your token has expired. Please log in again.',
  401
));

module.exports = (err, req, res, next) => {
  //   console.log(err.stack);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process && process.env && process.env.NODE_ENV === 'development') {
    devError(err, req, res, next);
  } else if (process && process.env && process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleCastDuplicateErrorDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJwtError();
    if (error.name === 'TokenExpiredError') error = handleJwtExpiredError();
    prodError(error, req, res, next);
  }
};
