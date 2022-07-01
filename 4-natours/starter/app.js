const express = require('express');
const morgan = require('morgan');
const router = require('./routes');
const app = express();
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/error.controller');

app.use(morgan('dev'));
app.use(express.json());
app.use('/api/v1', router);

app.get('/', (req, res) =>
  res.status(200).send({ message: 'Hello World!', status: 200 })
);

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   message: `Can't find ${req.originalUrl} on the server`,
  //   status: 'fail',
  // });
  // const err = new Error(`Can't find ${req.originalUrl} on the server`);
  // err.status = 'fail';
  // err.statusCode = 404;
  // next(err);
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
