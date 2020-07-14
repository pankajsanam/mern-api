const passport = require('passport');
const httpStatus = require('http-status');
const ApiError = require('../../../utils/ApiError');
const { rolePermissions } = require('../../../config/roles');

/**
 * Check if user has permission to access the requested resource
 *
 * @param req
 * @param resolve
 * @param reject
 * @param requiredPermissions
 * @returns {function(...[*]=)}
 */
const authorization = (req, resolve, reject, requiredPermissions) => async (err, user, info) => {
  if (err || info || !user) {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Authentication required!'));
  }

  req.user = user;

  if (requiredPermissions.length) {
    const userPermissions = rolePermissions.get(user.role);
    const hasPermission = requiredPermissions.every(requiredRight => userPermissions.includes(requiredRight));

    if (!hasPermission && req.params.userId !== user.id) {
      return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden!'));
    }
  }

  resolve();
};

/**
 * User authorization
 *
 * @param requiredPermissions
 * @returns {function(*=, *=, *=): Promise<unknown>}
 */
const auth = (...requiredPermissions) => async (req, res, next) => new Promise((resolve, reject) => {
  passport.authenticate(
    'jwt',
    { session: false },
    authorization(req, resolve, reject, requiredPermissions)
  )(req, res, next);
})
  .then(() => next())
  .catch(err => next(err));

module.exports = auth;
