const httpStatus = require('http-status');
const httpMocks = require('node-mocks-http');
const { errorConverter, errorHandler } = require('../../../middlewares/errorMiddleware');
const { BaseError } = require('../../../../../utils/errors');
const config = require('../../../../../config/config');
const logger = require('../../../../../config/logger');

describe('error middleware', () => {
  describe('error converter', () => {
    it('should return the same BaseError object it was called with', () => {
      const error = new BaseError(httpStatus.BAD_REQUEST, 'Any error');
      const next = jest.fn();

      errorConverter(error, httpMocks.createRequest(), httpMocks.createResponse, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it('should convert an Error to BaseError and preserve its status and message', () => {
      const error = new Error('Any error');
      error.statusCode = httpStatus.BAD_REQUEST;
      const next = jest.fn();

      errorConverter(error, httpMocks.createRequest(), httpMocks.createResponse, next);

      expect(next).toHaveBeenCalledWith(expect.any(BaseError));
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: error.statusCode,
          message: error.message,
          isOperational: false
        })
      );
    });

    it('should convert an Error without status to BaseError with status 500', () => {
      const error = new Error('Any error');
      const next = jest.fn();

      errorConverter(error, httpMocks.createRequest(), httpMocks.createResponse, next);

      expect(next).toHaveBeenCalledWith(expect.any(BaseError));
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: httpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
          isOperational: false
        })
      );
    });

    it('should convert an Error without message to BaseError with default message of that http status', () => {
      const error = new Error();
      error.statusCode = httpStatus.BAD_REQUEST;
      const next = jest.fn();

      errorConverter(error, httpMocks.createRequest(), httpMocks.createResponse, next);

      expect(next).toHaveBeenCalledWith(expect.any(BaseError));
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: error.statusCode,
          message: httpStatus[error.statusCode],
          isOperational: false
        })
      );
    });

    it('should convert any other object to BaseError with status 500 and its message', () => {
      const error = {};
      const next = jest.fn();

      errorConverter(error, httpMocks.createRequest(), httpMocks.createResponse, next);

      expect(next).toHaveBeenCalledWith(expect.any(BaseError));
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: httpStatus.INTERNAL_SERVER_ERROR,
          message: httpStatus[httpStatus.INTERNAL_SERVER_ERROR],
          isOperational: false
        })
      );
    });
  });

  describe('error handler', () => {
    // eslint-disable-next-line jest/no-hooks
    beforeEach(() => {
      jest.spyOn(logger, 'error').mockImplementation(() => {});
    });

    it('should send proper error response and put the error message in res.locals', () => {
      const error = new BaseError(httpStatus.BAD_REQUEST, 'Any error');
      const res = httpMocks.createResponse();
      const sendSpy = jest.spyOn(res, 'send');

      errorHandler(error, httpMocks.createRequest(), res);

      expect(sendSpy).toHaveBeenCalledWith(expect.objectContaining({ code: error.statusCode, message: error.message }));
      expect(res.locals.errorMessage).toBe(error.message);
    });

    it('should put the error stack in the response if in development mode', () => {
      config.env = 'development';
      const error = new BaseError(httpStatus.BAD_REQUEST, 'Any error');
      const res = httpMocks.createResponse();
      const sendSpy = jest.spyOn(res, 'send');

      errorHandler(error, httpMocks.createRequest(), res);

      expect(sendSpy).toHaveBeenCalledWith(
        expect.objectContaining({ code: error.statusCode, message: error.message, stack: error.stack })
      );
      config.env = process.env.NODE_ENV;
    });

    it('should send internal server error status if in production mode and error is not operational', () => {
      config.env = 'production';
      const error = new BaseError(httpStatus.BAD_REQUEST, 'Any error', false);
      const res = httpMocks.createResponse();
      const sendSpy = jest.spyOn(res, 'send');

      errorHandler(error, httpMocks.createRequest(), res);

      expect(sendSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          code: httpStatus.INTERNAL_SERVER_ERROR,
          message: httpStatus[httpStatus.INTERNAL_SERVER_ERROR]
        })
      );
      expect(res.locals.errorMessage).toBe(error.message);
      config.env = process.env.NODE_ENV;
    });

    it('should preserve original error status and message if in production mode and error is operational', () => {
      config.env = 'production';
      const error = new BaseError(httpStatus.BAD_REQUEST, 'Any error');
      const res = httpMocks.createResponse();
      const sendSpy = jest.spyOn(res, 'send');

      errorHandler(error, httpMocks.createRequest(), res);

      expect(sendSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          code: error.statusCode,
          message: error.message
        })
      );
      config.env = process.env.NODE_ENV;
    });
  });
});
