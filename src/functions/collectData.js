const csv = require('csvtojson');
const debug = require('./getDebug');
const isBrowser = require('./isBrowser');
const {FORMAT} = require('../constants');

/**
 * Internal handler of "error" signal
 */
const handleError = (error, resolve, reject, throwable = false) => {
  const errorMessage =
    error instanceof Error
      ? error.message
      : 'Error occurred while reading spreadsheet document';

  debug(errorMessage);

  if (!!throwable) {
    return reject(errorMessage);
  }

  return resolve([]);
};

/**
 * Internal handler of "done" signal
 */
const handleDone = (error, data, resolve, reject, throwable = false) => {
  if (!error) {
    return resolve(data);
  }

  return handleError(error, resolve, reject, throwable);
};

/**
 * Writes data into CSV or JSON.
 *
 * @param {IncomingMessage|Readable|string} spreadsheetContent spreadsheet data in different formats;
 * @param {{throwable?: boolean, format?: 'csv' | 'array' | 'json'}} options contains custom parameters;
 * @returns {Promise<string|Array|object>} CSV string, or array of objects (every array item is row from spreadsheet) or JSON object;
 * @throws {Promise<Error>}
 */
module.exports = (spreadsheetContent, options = {}) => {
  const {throwable = false, format = FORMAT.CSV} = options || {};

  return new Promise((resolve, reject) => {
    const data = [];
    const base = csv({
      noheader: format === FORMAT.CSV,
      output: format,
    });

    try {
      if (isBrowser) {
        base
          .fromString(spreadsheetContent)
          .then((csvRow) =>
            handleDone(null, csvRow, resolve, reject, throwable),
          )
          .catch((error) => handleError(error, resolve, reject, throwable));
      } else {
        base
          .fromStream(spreadsheetContent)
          .on('error', (error) =>
            handleError(error, resolve, reject, throwable),
          )
          .on('done', (error) =>
            handleDone(error, data, resolve, reject, throwable),
          )
          .subscribe((chunk) => data.push(chunk));
      }
    } catch (error) {
      return handleError(error, resolve, reject, throwable);
    }
  });
};
