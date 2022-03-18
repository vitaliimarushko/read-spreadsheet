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
 * @param {boolean} isArray sets if you need to convert into JSON array instead of JSON object; default: false
 * @returns {Promise<string|Array|object>} CSV string, or array of objects (every array item is row from spreadsheet) or JSON object;
 * @throws {Promise<Error>}
 */
const convertCsv = async (spreadsheetContent, isArray = false) => {
  const data = [];
  const base = csv({
    noheader: !!isArray,
    output: !isArray ? 'json' : 'csv',
  });

  return new Promise((resolve, reject) => {
    try {
      base
        .fromStream(spreadsheetContent)
        .on('error', (error) => handleError(error, resolve, reject))
        .on('done', (error) => handleDone(error, data, resolve, reject))
        .subscribe((chunk) => data.push(chunk));
    } catch (error) {
      return handleError(error, resolve, reject);
    }
  });
};

module.exports = {
  convertCsv,
};
