/**
 * Ensures valid spreadsheet ID value
 *
 * @param {string} spreadsheetId identifier of a Google spreadsheet document; see README.md for details
 * @returns {string} validated spreadsheet ID value
 * @throws {Error}
 */
const prepareSpreadsheetId = (spreadsheetId) => {
  if (!spreadsheetId) {
    // this value is critically important so without this value the process can't be continued
    throw new Error('Spreadsheet document ID is wrong');
  }

  spreadsheetId = String(spreadsheetId).valueOf().trim();

  if (
    !spreadsheetId.length ||
    spreadsheetId.length > 256 // rough check but safe
  ) {
    throw new Error('Spreadsheet document ID is wrong');
  }

  return spreadsheetId;
};

module.exports = {
  prepareSpreadsheetId,
};
