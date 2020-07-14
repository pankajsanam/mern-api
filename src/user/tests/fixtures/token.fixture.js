const moment = require('moment');
const config = require('../../../config/config');
const tokenService = require('../../services/token.service');
const { userOne, admin } = require('./user.fixture');

const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
const userOneAccessToken = tokenService.generateToken(userOne._id, accessTokenExpires);
const adminAccessToken = tokenService.generateToken(admin._id, accessTokenExpires);

module.exports = {
  userOneAccessToken,
  adminAccessToken
};
