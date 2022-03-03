const csv = require('csvtojson');

/**
 * Internal handler of "error" signal
 */
const handleError = (error, resolve, reject) => {
  const errorMessage = error instanceof Error ? error.message : `Content wasn't converted`;
  return reject(errorMessage);
};

/**
 * Internal handler of "done" signal
 */
const handleDone = (error, data, resolve, reject) => {
  if (!error) {
    return resolve(data);
  }

  return handleError(error, resolve, reject);
};

/**
 * Writes data into CSV, array or JSON.
 *
 * @param {Readable|string} spreadsheetContent spreadsheet data in different formats;
 * @param {boolean} isJson sets if you need to convert into json instead of "csv"; default: "csv"
 * @param {boolean} isBrowser defines the environment
 * @returns {Promise<string|Array|object>} CSV string, or array of objects (every array item is row from spreadsheet) or JSON object;
 * @throws {Promise<Error>}
 */
const convertCsv = async (spreadsheetContent, isJson = false, isBrowser = false) => {
  const data = [];
  const base = csv({
    noheader: !isJson,
    output: isJson ? 'json' : 'csv',
  });

  return new Promise((resolve, reject) => {
    try {
      if (isBrowser) {
        base
          .fromString(spreadsheetContent)
          .then((csvRow) => handleDone(null, csvRow, resolve, reject))
          .catch((error) => handleError(error, resolve, reject));
      } else {
        base
          .fromStream(spreadsheetContent)
          .on('error', (error) => handleError(error, resolve, reject))
          .on('done', (error) => handleDone(error, data, resolve, reject))
          .subscribe((chunk) => data.push(chunk));
      }
    } catch (error) {
      return handleError(error, resolve, reject);
    }
  });
};

module.exports = {
  convertCsv,
};
