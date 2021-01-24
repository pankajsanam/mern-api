const jwt = require('jsonwebtoken');
const moment = require('moment');
const config = require('../../../config/config');
const userService = require('./user.service');
const Token = require('../models/token.model');

/**
 * Generate token
 *
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} [secret]
 * @returns {string}
 */
const generateToken = (userId, expires, secret = config.jwt.secret) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix()
  };

  return jwt.sign(payload, secret);
};

/**
 * Save a token
 *
 * @param {string} token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {boolean} [blacklisted]
 * @returns {Promise<Token>}
 */
const saveToken = async (token, userId, expires, type, blacklisted = false) => Token.create({
  token,
  user: userId,
  expires: expires.toDate(),
  type,
  blacklisted
});

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 *
 * @param {string} token
 * @param {string} type
 * @returns {Promise<Token>}
 */
const verifyToken = async (token, type) => {
  const payload = jwt.verify(token, config.jwt.secret);

  const tokenDoc = await Token.findOne({
    token, type, user: payload.sub, blacklisted: false
  });

  if (!tokenDoc) {
    throw new Error('Token not found');
  }

  return tokenDoc;
};

/**
 * Generate auth tokens
 *
 * @param user
 * @returns {Promise<{access: {expiresIn, expires: Date, token: string}, refresh: {expires: Date, token: string}}>}
 */
const generateAuthTokens = async user => {
  const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
  const accessToken = generateToken(user.id, accessTokenExpires);

  const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
  const refreshToken = generateToken(user.id, refreshTokenExpires);

  await saveToken(refreshToken, user.id, refreshTokenExpires, 'refresh');

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
      expiresIn: config.jwt.accessExpirationMinutes
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate()
    }
  };
};

/**
 * Generate reset password token
 *
 * @param email
 * @returns {Promise<string|boolean>}
 */
const generateResetPasswordToken = async email => {
  const user = await userService.getUserByEmail(email);

  if (!user) {
    return false;
  }

  const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
  const resetPasswordToken = generateToken(user.id, expires);

  await saveToken(resetPasswordToken, user.id, expires, 'resetPassword');

  return resetPasswordToken;
};

/**
 * Delete refresh token
 *
 * @param refreshToken
 * @returns {Promise<Token>}
 */
const deleteRefreshToken = async refreshToken => {
  const token = await verifyToken(refreshToken, 'refresh');

  await token.remove();

  return token;
};

module.exports = {
  generateResetPasswordToken,
  generateAuthTokens,
  deleteRefreshToken,
  generateToken,
  verifyToken,
  saveToken
};
