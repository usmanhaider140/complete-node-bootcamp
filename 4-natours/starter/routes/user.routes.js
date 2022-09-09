const router = require('express').Router();
const userController = require('../controllers/user.controller');
const authController = require('../controllers/auth.controller');
const { protectRoute } = require('../utils/protectRoutes');
router.post('/signup', authController.signUp);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgetPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch('/updateMyPassword', protectRoute, authController.updatePassword);
router.patch('/updateMe', protectRoute, userController.updateMe);
router.delete('/deleteMe', protectRoute, userController.deleteMe);
router
  .route('/')
  .get(protectRoute, userController.getAllUsers)
  .post(userController.createUser);
router
  .route('/:id')
  .get(protectRoute, userController.getUserById)
  .patch(protectRoute, userController.updateUserById)
  .delete(protectRoute, userController.deleteUserById);

module.exports = router;
