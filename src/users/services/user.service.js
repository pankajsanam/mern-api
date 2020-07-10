const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const config = require('../../config/config');
const User = require('../models/user.model');
const { logger } = require('../../config/logger');

/**
 * Verify and authenticate a user credential for login
 *
 * @param email
 * @param password
 * @returns object
 */
const authenticate = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');

  if (user && bcrypt.compareSync(password, user.password)) {
    const { ...userWithoutHash } = user.toObject();

    const payload = { sub: user.id };
    const jwtOptions = { expiresIn: config.JWT_EXPIRES_IN };
    const accessToken = jwt.sign(payload, config.JWT_SECRET, jwtOptions);

    const refreshTokenOptions = { expiresIn: config.REFRESH_TOKEN_EXPIRES_IN };
    const refreshToken = jwt.sign(payload, config.REFRESH_TOKEN_SECRET, refreshTokenOptions);

    return {
      ...userWithoutHash,
      accessToken,
      refreshToken
    };
  }

  return {
    message: 'Wrong credentials'
  };
};

const generateToken = async ({ token }) => {
  // fetch refresh token from database
  const refreshTokens = [];

  // if (!refreshTokens.includes(token)) {
  //   return res.sendStatus(403);
  // }
  //
  // jwt.verify(token, refreshTokenSecret, (err, user) => {
  //   if (err) {
  //     return res.sendStatus(403);
  //   }
  //
  //   const params = { username: user.username, role: user.role };
  //   const accessToken = jwt.sign(params, accessTokenSecret, { expiresIn: '20m' });
  //
  //   res.json({
  //     accessToken
  //   });
  // });

  refreshTokens.push(token);

  return {
    refreshTokens,
    message: 'Wrong credentials'
  };
};

const getAll = () => User.find().select('-password');

const getById = id => User.findById(id).select('-password');

const getByEmail = email => User.findOne({ email }).select('-password');

const create = async userParam => {
  if (validator.isEmpty(userParam.email)
    || validator.isEmpty(userParam.username)
    || validator.isEmpty(userParam.password)) {
    throw 'Essential details are missing';
  }

  if (await User.findOne({ email: userParam.email })) {
    throw `Email ${userParam.email} is already taken`;
  }

  if (await User.findOne({ username: userParam.username })) {
    throw `Username ${userParam.username} is already taken`;
  }

  const user = new User(userParam);

  if (userParam.password) {
    user.password = bcrypt.hashSync(userParam.password, 10);
  }

  try {
    return await user.save();
  } catch (e) {
    logger.error('Could not create the user and received following error: ');
    logger.error(e);

    throw 'Oops, something went wrong!';
  }
};

const update = async (id, userParam) => {
  const user = await User.findById(id);

  if (!user) {
    throw 'User not found';
  }

  if (user.email !== userParam.email && await User.findOne({ email: userParam.email })) {
    throw `Email "${userParam.email}" is already taken`;
  }

  // hash password if it was entered
  if (userParam.password) {
    userParam.password = bcrypt.hashSync(userParam.password, 10);
  }

  // copy userParam properties to user
  Object.assign(user, userParam);

  await user.save();
};

const remove = id => User.findByIdAndRemove(id);

module.exports = {
  generateToken,
  authenticate,
  getByEmail,
  getById,
  getAll,
  create,
  update,
  remove
};
