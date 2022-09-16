const fs = require('fs');
const Tour = require('../models/tour.model');
const catchAsync = require('../utils/catchAsync');
const Factory = require('./handlingFactory');

const createTour = Factory.createOne(Tour);

const aliasTopTours = async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

const getAllTours = Factory.getAll(Tour);
const getTourById = Factory.getOne(Tour, { path: 'reviews' });
const updateTourById = Factory.updateOne(Tour);

const deleteTourById = Factory.deleteOne(Tour);

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
