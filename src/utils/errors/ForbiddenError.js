const httpStatus = require('http-status');
const BaseError = require('./BaseError');

class AuthError {
  constructor(message = 'Not allowed') {
    this.statusCode = httpStatus.FORBIDDEN;
    this.message = message;

    return new BaseError(this.statusCode, this.message);
  }
}

module.exports = AuthError;
