const querystring = require('querystring');
const {FORMAT} = require('../constants');

/**
 * Prepares valid URL for requesting spreadsheet document data
 *
 * @param {string} spreadsheetId identifier of a Google spreadsheet document; see README.md for details
 * @param {{format?: string, gid?: string | null}} options contains custom parameters
 * @returns {string} prepared URL string
 */
module.exports = (spreadsheetId, options = {}) => {
  const {format = FORMAT.CSV, gid = null} = options || {};
  const queryParams = {
    format, // format must be defined always!
  };

  // gid must be passed to query string only if it exists
  if (gid) {
    queryParams.gid = gid;
  }

  return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?${querystring.stringify(
    queryParams,
  )}`;
};
