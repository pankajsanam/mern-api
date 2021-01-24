const httpStatus = require('http-status');
const config = require('../../../config/config');
const logger = require('../../../config/logger');
const BaseError = require('../../../utils/errors/BaseError');

/**
 * Convert errors into the BaseError
 *
 * @param err
 * @param req
 * @param res
 * @param next
 */
const errorConverter = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof BaseError)) {
    const statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || httpStatus[statusCode];

    error = new BaseError(statusCode, message, false, err.stack);
  }

  next(error);
};

/**
 * Common error handler
 *
 * @param err
 * @param req
 * @param res
 */
const errorHandler = (err, req, res) => {
  let { statusCode, message } = err;

  if (config.env === 'production' && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  }

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
    ...(config.env === 'development' && { stack: err.stack })
  };

  if (config.env === 'development') {
    logger.error(err);
  }

  res.status(statusCode).send(response);
};

module.exports = {
  errorConverter,
  errorHandler
};
