const fs = require('fs');
const Tour = require('../models/tour');

const createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).send({ status: 'success', data: newTour });
  } catch (error) {
    res.status(400).send({ status: 'fail', message: error.message });
  }
};

const getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find();
    res.send({ status: 'success', data: tours });
  } catch (error) {
    res.status(400).send({ status: 'fail', message: error.message });
  }
};

const getTourById = async (req, res) => {
  try {
    const { id } = req.params;
    const tour = Tour.findById(id);
    if (!tour) {
      res.status(404).send({ status: 'fail', message: 'Invalid ID' });
    }
    res.send({ status: 'success', data: tour });
  } catch (error) {
    res.status(400).send({ status: 'fail', message: error.message });
  }
};

const updateTourById = async (req, res) => {
  try {
    const { id } = req.params;

    const tour = Tour.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!tour) {
      res.status(404).send({ status: 'fail', message: 'Invalid ID' });
    }

    res.status(200).send({ status: 'success', data: tour });
  } catch (error) {
    res.status(400).send({ status: 'fail', message: error.message });
  }
};

const deleteTourById = async (req, res) => {
  try {
    const { id } = req.params;
    Tour.findByIdAndDelete(id);
    res.status(204).send({ status: 'success', data: {} });
  } catch (error) {
    res.status(400).send({ status: 'fail', message: error.message });
  }
};

module.exports = {
  createTour,
  getAllTours,
  getTourById,
  updateTourById,
  deleteTourById,
};
