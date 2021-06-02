const axios = require('axios');
const processError = require('./processError');
const prepareUrl = require('./prepareUrl');
const {ERROR} = require('../constants');

/**
 * Retrieves spreadsheet content into readable stream.
 *
 * @param {string} spreadsheetId identifier of a Google spreadsheet document; see README.md for details;
 * @param {{throwable?: boolean, gid?: string}} options contains custom parameters;
 * @returns {Promise<Readable|Array>} in case of successful operation it will return readable stream, in opposite case - empty array;
 * @throws {Promise<Error>}
 */
module.exports = async (spreadsheetId, options) => {
  const {
    throwable = false,
    gid = null,
  } = options;

  let response = null;
  const requestOptions = {
    url: prepareUrl(spreadsheetId, {
      gid,
    }),
    method: 'GET',
    responseType: 'stream',  // it's critically required for big content!
  };

  try {
    response = await axios(requestOptions);
  } catch (error) {
    return processError(error, throwable);
  }

  // every response must have "responseUrl" parameter; if not it's error
  if (
    !response ||
    !response.data ||
    typeof response.data.responseUrl !== 'string' ||
    !response.data.responseUrl.length
  ) {
    return processError(ERROR.WRONG_RESPONSE, throwable);
  }

  // in case of non public access we will get wrong generated link to the document
  if (response.data.responseUrl.startsWith('https://accounts.google.com/ServiceLogin')) {
    return processError(ERROR.NOT_PUBLIC, throwable);
  }

  return response.data;
};
