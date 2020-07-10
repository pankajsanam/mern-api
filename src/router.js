const express = require('express');
const {
  hi, authenticate, register, token, logout
} = require('./users/controllers/user.controller');
// const verifyToken = require('./users/middlewares/verifyToken');
const auth = require('./users/middlewares/auth');

const app = express();

/**
 * Publicly accessible routes
 *
 * Add those routes here which does not require authentication
 *
 * @returns {*}
 */
const guestRoutes = () => {
  const router = express.Router();

  router.get('/hi', hi);
  router.post('/login', authenticate);
  router.post('/register', register);
  router.post('/logout', logout);
  router.post('/token', token);

  return router;
};

app.use('/', guestRoutes());

/**
 * Refresh the token if expired
 */
// app.use(verifyToken);

/**
 * All authenticated routes here
 */
app.use('/users', auth, require('./users/user.route'));

module.exports = app;
