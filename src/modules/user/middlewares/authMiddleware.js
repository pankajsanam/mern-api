const passport = require('passport');
const { AuthError, ForbiddenError } = require('../../../utils/errors');
const { rolePermissions } = require('../config/roles');

// Authorization for controllers

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
    return reject(new AuthError());
  }

  req.user = user;

  if (requiredPermissions.length) {
    const userPermissions = rolePermissions.get(user.role);
    const hasPermission = requiredPermissions.every(requiredRight => userPermissions.includes(requiredRight));

    if (!hasPermission && req.params.userId !== user.id) {
      return reject(new ForbiddenError());
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
const authMiddleware = (...requiredPermissions) => async (req, res, next) => new Promise((resolve, reject) => {
  passport.authenticate(
    'jwt',
    { session: false },
    authorization(req, resolve, reject, requiredPermissions)
  )(req, res, next);
})
  .then(() => next())
  .catch(err => next(err));

module.exports = authMiddleware;
