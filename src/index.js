const os = require('os');
const processError = require('./functions/processError');
const requestContent = require('./functions/requestContent');
const collectData = require('./functions/collectData');
const createReadableStream = require('./functions/createReadableStream');
const prepareFormat = require('./functions/prepareFormat');
const prepareGid = require('./functions/prepareGid');
const isBrowser = require('./functions/isBrowser');
const {ERROR, FORMAT} = require('./constants');

/**
 * Makes request to a Google spreadsheet document and retrieves its content.
 *
 * @param {string} spreadsheetId string ID which represents spreadsheet document
 * @param {{throwable?: boolean, format?: 'csv' | 'array' | 'json', isStream?: boolean, gid?: string, eolType?: string}} options contains custom parameters
 * @returns {Promise<any> | Readable} spreadsheet content in chosen format
 * @throws {Promise<Error>}
 */
module.exports = async (spreadsheetId, options = {}) => {
  // prepare incoming parameters
  let {
    throwable = false,
    format = FORMAT.CSV,
    isStream = false,
    gid = null,
    eolType = os.EOL,
  } = options && !Array.isArray(options) && typeof options === 'object'
    ? options
    : {};

  spreadsheetId = String(spreadsheetId).valueOf().trim();
  throwable = !!throwable;
  format = prepareFormat(format);
  isStream = !!isStream;
  gid = prepareGid(gid);
  eolType = String(eolType).valueOf();

  if (
    !spreadsheetId.length ||
    spreadsheetId.length > 256 // rough check but safe
  ) {
    return processError(ERROR.WRONG_ID, throwable);
  }

  // retrieve spreadsheet content as stream or raw text (depends on platform)
  let spreadsheetContent = null;

  try {
    spreadsheetContent = await requestContent(spreadsheetId, {
      throwable,
      gid,
    });
  } catch (error) {
    return processError(error, throwable);
  }

  if (
    spreadsheetContent === null ||
    (!isBrowser && typeof spreadsheetContent.pipe !== 'function')
  ) {
    return processError(ERROR.CANT_BE_READ, throwable);
  }

  // return direct stream of reading spreadsheet document
  if (!isBrowser && isStream) {
    return spreadsheetContent;
  }

  // put content into variable depending on platform
  let result = [];

  try {
    result = await collectData(spreadsheetContent, {
      throwable,
      format,
    });
  } catch (error) {
    return processError(error, throwable);
  }

  // make stream from data
  if (!isBrowser && isStream) {
    try {
      result = createReadableStream(result, {
        throwable,
        format,
        eolType,
      });
    } catch (error) {
      return processError(ERROR.STREAM_ERROR, throwable);
    }
  }

  return result;
};
