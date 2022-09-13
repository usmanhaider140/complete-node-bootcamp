const express = require('express');
const morgan = require('morgan');
const router = require('./routes');
const app = express();
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/error.controller');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
// Global middleware
app.use(morgan('dev'));

// Rate limiting
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: true, // Return rate limit info in the `X-RateLimit-*` headers
});

app.use('/api', limiter);

// Set security HTTP headers
app.use(helmet());

// Body parser, reading data from body into req.body
app.use(express.json());

// Data Sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data Sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

// Serving Static Files
app.use(express.static(`${__dirname}/public`));

// Routes
app.use('/api/v1', router);

app.get('/', (req, res) =>
  res.status(200).send({ message: 'Hello World!', status: 200 })
);

// Error Handling
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on the server`,
  // });
  const err = new Error(`Can't find ${req.originalUrl} on the server`);
  err.status = 'fail';
  err.statusCode = 404;
  next(err);
  next(new AppError(`Can't find ${req.originalUrl} on the server`, 404));
});

app.use(globalErrorHandler);

app.post('/', (req, res) => {
  res.send('You can post to this endpoint');
});

// app.post('/api/v1/tours', createTour);

// app.get('/api/v1/tours', getAllTours);

// app.get('/api/v1/tours/:id', getTourById);

// app.patch('/api/v1/tours/:id', updateTourById);

// app.delete('/api/v1/tours/:id', deleteTourById);

module.exports = app;
