const expressJwt = require('express-jwt');
const config = require('../../config/config');
const userService = require('../services/user.service');

/**
 * Public routes that don't require authentication
 *
 * @type {string[]}
 */
const publicRoutes = [
  '/api/login',
  '/api/register',
  '/api',
  '/api/hi'
];

const isRevoked = async (req, payload, done) => {
  const user = await userService.getById(payload.sub);

  // revoke token if user no longer exists
  if (!user) {
    return done(null, true);
  }

  return done();
};

const jwt = () => {
  const jwtOptions = {
    secret: config.JWT_SECRET,
    algorithms: ['HS256'],
    isRevoked
  };

  return expressJwt(jwtOptions).unless({ path: publicRoutes });
};

module.exports = jwt;
