const tokenService = require('./token.service');
const userService = require('./user.service');
const Token = require('../models/token.model');
const logger = require('../../config/logger');
const { AuthError } = require('../../utils/errors');

/**
 * Login with email and password
 *
 * @param email
 * @param password
 * @returns {Promise<User>}
 */
const authenticate = async (email, password) => {
  const user = await userService.getUserByEmail(email);

  if (!user || !(await user.isPasswordMatch(password))) {
    throw new AuthError('Incorrect email or password');
  }

  return user;
};

/**
 * Refresh auth tokens
 *
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async refreshToken => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, 'refresh');
    const user = await userService.getUserById(refreshTokenDoc.user);

    if (!user) {
      throw new Error();
    }

    await refreshTokenDoc.remove();

    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new AuthError();
  }
};

/**
 * Reset password
 *
 * @param resetPasswordToken
 * @param newPassword
 * @returns {Promise<void>}
 */
const resetPassword = async (resetPasswordToken, newPassword) => {
  try {
    const resetPasswordTokenDoc = await tokenService.verifyToken(resetPasswordToken, 'resetPassword');
    const user = await userService.getUserById(resetPasswordTokenDoc.user);

    if (!user) {
      throw new Error();
    }

    await Token.deleteMany({ user: user.id, type: 'resetPassword' });
    await userService.updateUserById(user.id, { password: newPassword });
  } catch (error) {
    logger.error(error);
    throw new AuthError('Could not reset password');
  }
};

module.exports = {
  resetPassword,
  authenticate,
  refreshAuth
};
