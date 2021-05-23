const http = require('http');
const csv = require('csvtojson');
const debug = require('./getDebug');
const {ERROR} = require('../constants');

/**
 * Internal handler of "error" signal
 */
const handleError = (error, resolve, reject, throwable = false) => {
  const errorMessage = error ? (error.message || error) : 'Error occurred while reading spreadsheet document';

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
 * Reads data from spreadsheet stream into JSON
 *
 * @param {IncomingMessage|Readable} spreadsheetStream readable stream to retrieve spreadsheet data
 * @param {boolean} throwable defines if it's needed to throw exception or just return some result if some operation is wrong; default: false
 * @returns {Promise<Array>} array of objects; every array item is row from spreadsheet
 * @throws {Promise<Error>} common error instance
 */
module.exports = (spreadsheetStream, throwable = false) => {
  if (!(spreadsheetStream instanceof http.IncomingMessage)) {
    return handleError(ERROR.NOT_STREAM, Promise.resolve, Promise.reject, throwable);
  }

  return new Promise((resolve, reject) => {
    const data = [];

    try {
      csv()
        .fromStream(spreadsheetStream)
        .on('error', (error) => handleError(error, resolve, reject, throwable))
        .on('done', (error) => handleDone(error, data, resolve, reject, throwable))
        .subscribe((jsonRow) => data.push(jsonRow));
    } catch (error) {
      return handleError(error, resolve, reject, throwable);
    }
  });
};
