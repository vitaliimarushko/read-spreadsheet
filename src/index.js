const { isBrowser } = require('./helpers/is-browser.helper');
const { prepareSpreadsheetId } = require('./helpers/prepare-spreadsheet-id.helper');
const { prepareOptions } = require('./helpers/prepare-options.helper');
const { requestContent } = require('./helpers/request-content.helper');
const { convertCsv } = require('./helpers/convert-csv.helper');
const { convertToStream } = require('./helpers/convert-to-stream.helper');

/**
 * Makes request to a Google spreadsheet document and retrieves its content.
 *
 * @param {string | undefined} spreadsheetId identifier of a Google spreadsheet document; see README.md for details
 * @param {{isJson?: boolean, gid?: string, isStream?: boolean}} options contains custom parameters
 * @returns {Promise<Readable | any>} spreadsheet content in chosen format
 * @throws {Promise<Error>}
 */
module.exports = async (spreadsheetId, options = {}) => {
  // prepare incoming parameters
  spreadsheetId = prepareSpreadsheetId(spreadsheetId);
  const { isJson, gid, isStream } = prepareOptions(options);
  const spreadsheetContent = await requestContent(spreadsheetId, gid, isBrowser);

  // return default content for exact environment without data changing
  if ((!isBrowser && isStream && !isJson) || (isBrowser && !isJson)) {
    return spreadsheetContent;
  }

  // CSV content is converted to exact format
  const convertedContent = await convertCsv(spreadsheetContent, isJson, isBrowser);

  // make stream for non-browser environment, otherwise just return data
  return !isBrowser && isStream ? convertToStream(convertedContent) : convertedContent;
};
