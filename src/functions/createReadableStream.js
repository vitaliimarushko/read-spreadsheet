const stream = require('stream');
const os = require('os');
const debug = require('./getDebug');
const {DEFAULT_STRINGIFIED_DATA} = require('../constants');

/**
 * Internal handler of "error"
 */
const handleError = (error, throwable = false) => {
  const errorMessage = error instanceof Error ? error.message : `Data can't be stringified`;

  debug(errorMessage);

  if (throwable) {
    throw new Error(errorMessage);
  }
};

/**
 * Creates readable stream from provided data in array
 *
 * @param {Array} result data which must be presented as readable stream
 * @param {{throwable?: boolean, isCsv?: boolean, eolType?: string}} options contains custom parameters;
 * @returns {Readable} readable stream
 */
module.exports = (result, options) => {
  const {
    throwable = false,
    isCsv = false,
    eolType = os.EOL,
  } = options;

  // create string data to put it into stream
  let data = DEFAULT_STRINGIFIED_DATA;

  try {
    if (!isCsv) {
      data = JSON.stringify(result, null, 2);
    } else {
      data = result.map((r) => r.join(',')).join(eolType);
    }
  } catch (error) {
    handleError(error, throwable);
    data = DEFAULT_STRINGIFIED_DATA;
  }

  // make stream from stringified data
  return stream.Readable.from(Buffer.from(data).toString());
};
