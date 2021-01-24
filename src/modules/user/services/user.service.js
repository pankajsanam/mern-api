const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const { BadRequestError, NotFoundError } = require('../../../utils/errors');
const User = require('../models/user.model');

const unlinkAsync = promisify(fs.unlink);

/**
 * Create a user
 *
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async userBody => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new BadRequestError('Email already taken');
  }

  return User.create(userBody);
};

const updateProfile = async (userId, userBody) => {
  const user = await getUserById(userId);

  if (!user) {
    throw new NotFoundError('User does not exist');
  }

  if (user.avatar && !userBody.avatar) {
    const avatarPath = path.join(__dirname, `../../../public/uploads/${user.avatar}`);

    await unlinkAsync(avatarPath);
  }

  Object.assign(user, userBody);

  await user.save();

  return user;
};

/**
 * Query for user
 *
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => User.paginate(filter, options);

/**
 * Get user by id
 *
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async id => User.findById(id);

/**
 * Get user by email
 *
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async email => User.findOne({ email });

/**
 * Update user by id
 *
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);

  if (!user) {
    throw new NotFoundError('User does not exist');
  }

  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new BadRequestError('Email already taken');
  }

  Object.assign(user, updateBody);

  await user.save();

  return user;
};

/**
 * Delete user by id
 *
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async userId => {
  const user = await getUserById(userId);

  if (!user) {
    throw new NotFoundError('User not found');
  }

  await user.remove();

  return user;
};

module.exports = {
  deleteUserById,
  updateUserById,
  getUserByEmail,
  updateProfile,
  getUserById,
  createUser,
  queryUsers
};
