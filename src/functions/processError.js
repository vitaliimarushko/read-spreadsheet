const debug = require('./getDebug');

/**
 * Takes error and defines behavior for current operation
 *
 * @param {Error} error instance of error which will be potentially thrown if **throwable** is **true**
 * @param {boolean} throwable defines if it's needed to throw exception or just return some result if some operation is wrong; default: false
 * @returns {Array} always empty array
 * @throws {Error} instance of error which will be thrown if **throwable** is **true**
 */
module.exports = (error, throwable = false) => {
  const errorMessage = error ? (error.message || error) : 'Internal unhandled error happened';

  debug(errorMessage);

  if (!throwable) {
    return [];
  }

  throw new Error(errorMessage);
};
