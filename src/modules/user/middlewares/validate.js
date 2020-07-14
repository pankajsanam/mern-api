const httpStatus = require('http-status');
const joi = require('@hapi/joi');
const { pick } = require('../../../utils/common');
const ApiError = require('../../../utils/ApiError');

/**
 * Validate the body of a request
 *
 * @param schema
 * @returns {function(...[*]=)}
 */
const validate = schema => (req, res, next) => {
  const validSchema = pick(schema, ['params', 'query', 'body']);
  const object = pick(req, Object.keys(validSchema));
  const { value, error } = joi.compile(validSchema)
    .prefs({ errors: { label: 'key' } })
    .validate(object);

  if (error) {
    const errorMessage = error.details.map(details => details.message).join(', ');
    return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
  }

  Object.assign(req, value);

  return next();
};

module.exports = validate;
