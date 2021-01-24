const express = require('express');

const router = express.Router();

// user module routes
router.use('/auth', require('./modules/user/routes/auth.route'));
router.use('/user', require('./modules/user/routes/user.route'));

module.exports = router;
