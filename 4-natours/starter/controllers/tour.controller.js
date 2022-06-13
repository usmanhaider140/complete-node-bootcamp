const fs = require('fs');
const Tour = require('../models/tour');

const createTour = async (req, res) => {
  try {
    const newTour = res.status(201).send({ status: 'success', data: req.body });
  } catch (error) {}
};

const getAllTours = (req, res) => {
  res.send({ status: 'success', data: tours });
};

const getTourById = (req, res) => {
  const { id } = req.params;
  // if (id >= tours.length) {
  //   res.status(404).send({ status: 'fail', message: 'Invalid ID' });
  // }
  const tour = tours.find((el) => el.id === +id);
  if (!tour) {
    res.status(404).send({ status: 'fail', message: 'Invalid ID' });
  }
  res.send({ status: 'success', data: tour });
};

const updateTourById = (req, res) => {
  const { id } = req.params;

  const tour = tours.find((el) => el.id === +id);
  if (!tour) {
    res.status(404).send({ status: 'fail', message: 'Invalid ID' });
  }

  const index = tours.indexOf(tour);
  const newTour = { ...tour, ...req.body };
  tours[index] = newTour;
  fs.writeFileSync(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours)
  );
  res.status(200).send({ status: 'success', data: newTour });
};

const deleteTourById = (req, res) => {
  const { id } = req.params;
  const tour = tours.find((el) => el.id === +id);
  if (!tour) {
    res.status(404).send({ status: 'fail', message: 'Invalid ID' });
  }
  const index = tours.indexOf(tour);
  tours.splice(index, 1);
  fs.writeFileSync(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours)
  );
  res.status(204).send({ status: 'success', data: {} });
};

module.exports = {
  createTour,
  getAllTours,
  getTourById,
  updateTourById,
  deleteTourById,
};
