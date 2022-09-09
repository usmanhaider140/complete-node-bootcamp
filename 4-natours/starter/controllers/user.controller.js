const User = require('../models/user.model');
const AppError = require('../utils/appError');
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

const updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTS password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400 // Bad request
      )
    );
  }
  const filteredBody = filterObj(req.body, 'name', 'email');
  // 2) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
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
  updateMe,
  getUserById,
  updateUserById,
  deleteUserById,
};
