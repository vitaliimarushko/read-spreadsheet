const debug = require('./getDebug');
const {FORMAT} = require('../constants');

/**
 * Takes a value and definitely sets its value as valid string.
 *
 * @param {string|null} format any value which it's needed to prepare
 * @returns {string} prepared format
 */
module.exports = (format) => {
  const possibleFormats = Object.values(FORMAT);

  try {
    format = String(format).valueOf();
  } catch (error) {
    debug(error.message || error);
    format = FORMAT.CSV;
  }

  if (!format || !possibleFormats.includes(format)) {
    format = FORMAT.CSV;
  }

  return format;
};
