const httpStatus = require('http-status');
const { controller } = require('../../utils');
const {
  authService, userService, tokenService, emailService
} = require('../services');

/**
 * Register a new user
 *
 * @type {function(...[*]=)}
 */
const register = controller(async (req, res) => {
  const user = await userService.createUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);

  res.status(httpStatus.CREATED).send({ user, tokens });
});

/**
 * Login with user credentials
 *
 * @type {function(...[*]=)}
 */
const login = controller(async (req, res) => {
  const { email, password } = req.body;

  const user = await authService.authenticate(email, password);
  const tokens = await tokenService.generateAuthTokens(user);

  res.send({ user, tokens });
});

/**
 * Refresh tokens
 *
 * @type {function(...[*]=)}
 */
const refreshTokens = controller(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);

  res.send({ ...tokens });
});

/**
 * Request for a new password and a reset password token
 *
 * @type {function(...[*]=)}
 */
const forgotPassword = controller(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);

  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);

  res.status(httpStatus.NO_CONTENT).send();
});

/**
 * Reset password
 *
 * @type {function(...[*]=)}
 */
const resetPassword = controller(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);

  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  forgotPassword,
  refreshTokens,
  resetPassword,
  register,
  login
};
