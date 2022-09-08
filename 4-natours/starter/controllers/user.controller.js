const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');

const getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();
  if (users) {
    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users,
      },
    });
  } else {
    res.status(404).json({
      status: 'fail',
      message: 'No users found',
    });
  }
});

const createUser = (req, res) => {
  res
    .status(500)
    .send({ status: 'fail', message: 'This route is not yet defined' });
};
const getUserById = (req, res) => {
  res
    .status(500)
    .send({ status: 'fail', message: 'This route is not yet defined' });
};

const updateUserById = (req, res) => {
  res
    .status(500)
    .send({ status: 'fail', message: 'This route is not yet defined' });
};
const deleteUserById = (req, res) => {
  res
    .status(500)
    .send({ status: 'fail', message: 'This route is not yet defined' });
};

module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  updateUserById,
  deleteUserById,
};
