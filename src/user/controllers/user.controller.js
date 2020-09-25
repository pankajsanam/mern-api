const httpStatus = require('http-status');
const { NotFoundError } = require('../../utils/errors');
const { controller, pick } = require('../../utils');
const { userService } = require('../services');

/**
 * Login status is valid if request reaches to this point through passport middleware
 *
 * @type {function(...[*]=)}
 */
const loginStatus = controller(async (req, res) => {
  res.send({ status: true });
});

/**
 * Create a new user
 *
 * @type {function(...[*]=)}
 */
const createUser = controller(async (req, res) => {
  const user = await userService.createUser(req.body);

  res.status(httpStatus.CREATED).send(user);
});

/**
 * Fetch all users
 *
 * @type {function(...[*]=)}
 */
const getUsers = controller(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  const result = await userService.queryUsers(filter, options);

  res.send(result);
});

/**
 * Get a specified users detail
 *
 * @type {function(...[*]=)}
 */
const getUser = controller(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);

  if (!user) {
    throw new NotFoundError('User does not exist');
  }

  res.send(user);
});

/**
 * Update a users details
 *
 * @type {function(...[*]=)}
 */
const updateUser = controller(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);

  res.send(user);
});

/**
 * Delete a user
 *
 * @type {function(...[*]=)}
 */
const deleteUser = controller(async (req, res) => {
  await userService.deleteUserById(req.params.userId);

  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  loginStatus,
  updateUser,
  createUser,
  deleteUser,
  getUsers,
  getUser
};
