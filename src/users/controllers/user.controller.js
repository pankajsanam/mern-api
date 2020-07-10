const userService = require('../services/user.service');
const Hello = require('./Hello');

const hi = (req, res) => {
  const hey = new Hello('Robert');

  res.json(hey.print('Kiyosaki'));
};

const authenticate = (req, res, next) => {
  userService.authenticate(req.body)
    .then(user => {
      if (!user) {
        return res.status(400)
          .json({ message: 'Username or password is incorrect' });
      }

      return res.json(user);
    })
    .catch(err => next(err));
};

const token = (req, res, next) => {
  if (!req.body.token) {
    return res.sendStatus(401);
  }

  userService.generateToken(req.body.token)
    .then(user => {
      if (!user) {
        return res.status(400)
          .json({ message: 'Username or password is incorrect' });
      }

      return res.json(user);
    })
    .catch(err => next(err));

  return true;
};

/**
 * Add a new user
 *
 * @param req
 * @param res
 *
 * @returns {Promise<void>}
 */
const register = async (req, res) => {
  try {
    const userAdded = await userService.create(req.body);

    res.json({
      status: 200,
      message: 'User saved',
      data: userAdded
    });
  } catch (e) {
    res.json({
      status: 503,
      message: e
    });
  }
};

const logout = async (req, res) => {
  // const { token } = req.body;
  // const refreshTokens = refreshTokens.filter(token => t !== token);

  res.send('Logout successful');
};

// Get all users
const getAll = (req, res, next) => {
  userService.getAll()
    .then(users => res.json(users))
    .catch(err => next(err));
};

const getCurrent = (req, res, next) => {
  userService.getById(req.user.sub)
    .then(user => (user ? res.json(user) : res.sendStatus(404)))
    .catch(err => next(err));
};

// Get user details by id
const getById = (req, res, next) => {
  userService.getById(req.params.id)
    .then(user => (user ? res.json(user) : res.sendStatus(404)))
    .catch(err => next(err));
};

// Find user by email
const getByEmail = (req, res, next) => {
  userService.getByEmail(req.params.email)
    .then(user => (user ? res.json(user) : res.sendStatus(404)))
    .catch(err => next(err));
};

const update = (req, res, next) => {
  userService.update(req.params.id, req.body)
    .then(() => res.json({}))
    .catch(err => next(err));
};

const remove = (req, res, next) => {
  userService.remove(req.params.id)
    .then(() => res.json({ message: 'Deleted' }))
    .catch(err => next(err));
};

module.exports = {
  authenticate,
  getCurrent,
  getByEmail,
  register,
  getById,
  getAll,
  logout,
  update,
  remove,
  token,
  hi
};
