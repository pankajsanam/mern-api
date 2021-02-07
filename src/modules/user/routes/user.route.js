const express = require('express');

const authMiddleware = require('../middlewares/authMiddleware');
const validateMiddleware = require('../middlewares/validateMiddleware');
const userValidation = require('../validations/user.validation');
const userController = require('../controllers/user.controller');
const uploadMiddleware = require('../middlewares/uploadMiddleware');

const router = express.Router();

router
  .route('/logout/:refreshToken')
  .delete(authMiddleware('login'), userController.logoutUser);

router
  .route('/')
  .post(authMiddleware('manageUsers'), validateMiddleware(userValidation.createUser), userController.createUser)
  .get(authMiddleware('getUsers'), validateMiddleware(userValidation.getUsers), userController.getUsers);

router
  .route('/profile')
  .get(authMiddleware('manageUsers'), userController.getProfile)
  .put(authMiddleware('manageUsers'), uploadMiddleware.single('avatar'), userController.updateProfile);

router
  .route('/:userId')
  .get(authMiddleware('getUsers'), validateMiddleware(userValidation.getUser), userController.getUser)
  .patch(authMiddleware('manageUsers'), validateMiddleware(userValidation.updateUser), userController.updateUser)
  .delete(authMiddleware('manageUsers'), validateMiddleware(userValidation.deleteUser), userController.deleteUser);

module.exports = router;
