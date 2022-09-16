const User = require('../models/user.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Factory = require('./handlingFactory');

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

const getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

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

const deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
const createUser = (req, res) => {
  res.status(500).send({
    status: 'fail',
    message: 'This route is not yet defined! Please use /signup instead',
  });
};

const getUserById = Factory.getOne(User);
// Do NOT update passwords with this!
const updateUserById = Factory.updateOne(User);

const deleteUserById = Factory.deleteOne(User);

module.exports = {
  getAllUsers,
  createUser,
  getMe,
  updateMe,
  getUserById,
  updateUserById,
  deleteUserById,
  deleteMe,
};
