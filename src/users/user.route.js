const express = require('express');
const {
  getById, getByEmail, getAll, getCurrent,
  update, remove
} = require('./controllers/user.controller');

const router = express.Router();

// Below routes will be prepended with api/users/
router.get('/', getAll);
router.get('/current', getCurrent);
router.get('/:id', getById);
router.get('/by/email/:email', getByEmail);
router.put('/:id', update);
router.delete('/:id', remove);

module.exports = router;
