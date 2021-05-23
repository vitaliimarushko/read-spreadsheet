const axios = require('axios');
const processError = require('./processError');
const {ERROR} = require('../constants');

/**
 * Retrieves spreadsheet content into readable stream
 *
 * @param {string} spreadsheetId identifier of a Google spreadsheet document; see README.md for details
 * @param {boolean} throwable defines if it's needed to throw exception or just return some result if some operation is wrong; default: false
 * @returns {Promise<Readable|Array>} in case of successful operation it will return readable stream, in opposite case - empty array
 * @throws {Promise<Error>} common error instance
 */
module.exports = async (spreadsheetId, throwable = false) => {
  let response = null;
  const requestOptions = {
    url: `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv`,
    method: 'GET',
    responseType: 'stream',  // it's critically required for big content!
  };

  try {
    response = await axios(requestOptions);
  } catch (error) {
    return processError(error, throwable);
  }

  // every response must have "responseUrl" parameter; if not it's error
  if (!response || !response.data || typeof response.data.responseUrl !== 'string') {
    return processError(ERROR.WRONG_RESPONSE, throwable);
  }

  // in case of non public access we will get wrong generated link to the document
  if (response.data.responseUrl.trim().startsWith('https://accounts.google.com/ServiceLogin')) {
    return processError(ERROR.NOT_PUBLIC, throwable);
  }

  return response.data;
};
