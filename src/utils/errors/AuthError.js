const httpStatus = require('http-status');
const BaseError = require('./BaseError');

class AuthError {
  constructor(message = 'Authentication required!') {
    this.statusCode = httpStatus.UNAUTHORIZED;
    this.message = message;

    return new BaseError(this.statusCode, this.message);
  }
}

module.exports = AuthError;
