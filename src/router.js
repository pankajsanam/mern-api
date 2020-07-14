const express = require('express');

const router = express.Router();

// user module routes
router.use('/auth', require('./user/routes/auth.route'));
router.use('/user', require('./user/routes/user.route'));

module.exports = router;
