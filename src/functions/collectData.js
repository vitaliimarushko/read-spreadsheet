const csv = require('csvtojson');
const debug = require('./getDebug');

/**
 * Internal handler of "error" signal
 */
const handleError = (error, resolve, reject, throwable = false) => {
  const errorMessage = error instanceof Error ? error.message : 'Error occurred while reading spreadsheet document';

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
 * Reads data from spreadsheet stream into CSV or JSON.
 *
 * @param {IncomingMessage|Readable} spreadsheetStream readable stream to retrieve spreadsheet data;
 * @param {{throwable?: boolean, isCsv?: boolean}} options contains custom parameters;
 * @returns {Promise<Array>} array of objects; every array item is row from spreadsheet;
 * @throws {Promise<Error>}
 */
module.exports = (spreadsheetStream, options) => {
  const {
    throwable = false,
    isCsv = false,
  } = options;

  return new Promise((resolve, reject) => {
    const data = [];

    try {
      csv({
        noheader: !!isCsv,
        output: isCsv ? 'csv' : 'json',
      })
        .fromStream(spreadsheetStream)
        .on('error', (error) => handleError(error, resolve, reject, throwable))
        .on('done', (error) => handleDone(error, data, resolve, reject, throwable))
        .subscribe((chunk) => data.push(chunk));
    } catch (error) {
      return handleError(error, resolve, reject, throwable);
    }
  });
};
