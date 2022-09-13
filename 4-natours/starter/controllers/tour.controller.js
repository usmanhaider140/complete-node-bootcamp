const fs = require('fs');
const Tour = require('../models/tour.model');
const APIFeature = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  res.status(201).send({ status: 'success', data: newTour });
});

const aliasTopTours = async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

const getAllTours = catchAsync(async (req, res, next) => {
  const features = new APIFeature(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const tours = await features.query;

  res.send({
    status: 'success',
    results: tours.length,
    page: req.query.page,
    limit: req.query.limit,
    data: tours,
  });
});

const getTourById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const tour = await Tour.findById(id);

  if (!tour) {
    // res.status(404).send({ status: 'fail', message: 'Invalid ID' });
    return next(new AppError('Invalid ID', 404));
  }
  res.send({ status: 'success', data: tour });
});

const updateTourById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const tour = await Tour.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!tour) {
    // res.status(404).send({ status: 'fail', message: 'Invalid ID' });
    return next(new AppError('Invalid ID', 404));
  }

  res.status(200).send({ status: 'success', data: tour });
});

const deleteTourById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const tour = await Tour.findByIdAndDelete(id);
  if (!tour) {
    // res.status(404).send({ status: 'fail', message: 'Invalid ID' });
    return next(new AppError('Invalid ID', 404));
  }
  res.status(204).send({ status: 'success', data: {} });
});

const getTourStats = async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: {
        ratingsAverage: {
          $gte: 4,
        },
      },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: {
          $sum: '$ratingsQuantity',
        },
        avgRating: {
          $avg: '$ratingsAverage',
        },
        avgPrice: {
          $avg: '$price',
        },
        minPrice: {
          $min: '$price',
        },
        maxPrice: {
          $max: '$price',
        },
      },
    },
    {
      $sort: {
        avgPrice: 1,
      },
    },
    {
      $match: {
        _id: { $ne: 'EASY' },
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: stats,
  });
};

const getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31 `),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStart: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: {
        numTourStart: -1,
      },
    },
    {
      $limit: 4,
    },
  ]);
  res.status(200).json({
    status: 'success',
    results: plan.length,
    data: plan,
  });
});

module.exports = {
  createTour,
  aliasTopTours,
  getAllTours,
  getTourById,
  updateTourById,
  deleteTourById,
  getTourStats,
  getMonthlyPlan,
};
