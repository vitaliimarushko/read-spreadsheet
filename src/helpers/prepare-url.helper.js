/**
 * Prepares valid URL for requesting spreadsheet document data
 *
 * @param {string} spreadsheetId identifier of a Google spreadsheet document; see README.md for details
 * @param {string | null} gid identifier of a sheet inside the spreadsheet document
 * @returns {string} prepared URL string to retrieve the spreadsheet content
 */
const prepareUrl = (spreadsheetId, gid = null) => {
  const queryParams = {
    format: 'csv', // format must be defined always!
  };

  // gid must be passed to query string only if it exists
  if (gid) {
    queryParams.gid = gid;
  }

  const params = new URLSearchParams(queryParams);

  return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?${params}`;
};

module.exports = {
  prepareUrl,
};
