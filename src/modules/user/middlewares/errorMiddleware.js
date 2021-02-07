const { NotFoundError } = require('../../../utils/errors');

const notFoundErrorHandler = (req, res, next) => {
  next(new NotFoundError('Resource not found'));
};

const errorHandler = (error, req, res, next) => {
  res
    .status(error.statusCode)
    .json({
      // stack: error.stack,
      status: error.statusCode,
      message: error.message
    });
};

module.exports = {
  notFoundErrorHandler,
  errorHandler
};
