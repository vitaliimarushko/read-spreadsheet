const axios = require('axios');
const { prepareUrl } = require('./prepare-url.helper');

/**
 * Retrieves spreadsheet content into readable stream or just as string
 *
 * @param {string} spreadsheetId identifier of a Google spreadsheet document; see README.md for details
 * @param {string | null} gid identifier of a sheet inside the spreadsheet document
 * @param {boolean} isBrowser this flag defines response type after request: "true" for textual content, "false" for a stream
 * @returns {Promise<Readable | string>} in case of successful operation it will return readable stream or string, in opposite case - null
 * @throws {Promise<Error>}
 */
const requestContent = async (spreadsheetId, gid = null, isBrowser = false) => {
  const response = await axios({
    method: 'get',
    url: prepareUrl(spreadsheetId, gid),
    responseType: isBrowser ? 'text' : 'stream', // "stream" can be utilized for Node.js environment only
  });

  if (
    !response ||
    !response.data ||
    (!isBrowser &&
      (typeof response.data.responseUrl !== 'string' ||
        !response.data.responseUrl.length ||
        typeof response.data.pipe !== 'function'))
  ) {
    throw new Error('Wrong response after requesting spreadsheet document');
  }

  // in case of non-public access we will get wrong generated link to the document
  if (response.data.responseUrl.startsWith('https://accounts.google.com/ServiceLogin')) {
    throw new Error('Spreadsheet document has non-public access');
  }

  return response.data;
};

module.exports = {
  requestContent,
};
