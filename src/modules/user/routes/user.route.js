const express = require('express');
const path = require('path');
const multer = require('multer');
const auth = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validateMiddleware');
const userValidation = require('../validations/user.validation');
const userController = require('../controllers/user.controller');

const router = express.Router();

router
  .route('/logout/:refreshToken')
  .delete(auth('login'), userController.logoutUser);

router
  .route('/')
  .post(auth('manageUsers'), validate(userValidation.createUser), userController.createUser)
  .get(auth('getUsers'), validate(userValidation.getUsers), userController.getUsers);

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(__dirname, '../../../public/uploads/'));
  },
  filename: (req, file, callback) => {
    callback(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5242880
  }
});

router
  .route('/profile')
  .get(auth('manageUsers'), userController.getProfile)
  .put(auth('manageUsers'), upload.single('avatar'), userController.updateProfile);

router
  .route('/:userId')
  .get(auth('getUsers'), validate(userValidation.getUser), userController.getUser)
  .patch(auth('manageUsers'), validate(userValidation.updateUser), userController.updateUser)
  .delete(auth('manageUsers'), validate(userValidation.deleteUser), userController.deleteUser);

module.exports = router;
