/**
 * Handle express route controllers with promises
 *
 * @param callback
 * @returns {function(...[*]=)}
 */
const controller = callback => (req, res, next) => {
  Promise.resolve(callback(req, res, next))
    .catch(err => next(err));
};

/**
 * Create an object composed of the picked object properties
 *
 * @param object
 * @param keys
 * @returns {*}
 */
const pick = (object, keys) => keys.reduce((obj, key) => {
  if (object && Object.prototype.hasOwnProperty.call(object, key)) {
    obj[key] = object[key];
  }

  return obj;
}, {});

module.exports = {
  controller,
  pick
};
