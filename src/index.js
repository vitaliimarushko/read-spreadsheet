const os = require('os');
const processError = require('./functions/processError');
const requestContent = require('./functions/requestContent');
const collectData = require('./functions/collectData');
const createReadableStream = require('./functions/createReadableStream');
const prepareGid = require('./functions/prepareGid');
const {ERROR} = require('./constants');

/**
 * Makes request to a Google spreadsheet document and retrieves its content.
 *
 * @param {string} spreadsheetId string ID which represents spreadsheet document;
 * @param {{throwable?: boolean, isCsv?: boolean, isStream?: boolean, directStream?: boolean, eolType?: string, gid?: string}} options contains custom parameters;
 * @returns {Promise<Array>|Readable} array of objects; every array item is row from spreadsheet;
 * @throws {Promise<Error>}
 */
module.exports = async (spreadsheetId, options = {}) => {
  // prepare incoming parameters
  let {
    throwable = false,
    isCsv = false,
    isStream = false,
    directStream = false,
    gid = null,
    eolType = os.EOL,
  } = (options && typeof options === 'object') ? options : {};

  throwable = !!throwable;
  isCsv = !!isCsv;
  isStream = !!isStream;
  directStream = !!directStream;
  gid = prepareGid(gid);
  eolType = String(eolType).valueOf();

  if (
    !spreadsheetId ||
    typeof spreadsheetId !== 'string' ||
    !spreadsheetId.length ||
    spreadsheetId.length > 256  // rough check but safe
  ) {
    return processError(ERROR.WRONG_ID, throwable);
  }

  // retrieve spreadsheet content as stream
  let spreadsheetStream = null;

  try {
    spreadsheetStream = await requestContent(spreadsheetId, {
      throwable,
      gid,
    });
  } catch (error) {
    return processError(error, throwable);
  }

  if (!spreadsheetStream || typeof spreadsheetStream.pipe !== 'function') {
    return processError(ERROR.CANT_BE_READ, throwable);
  }

  // return direct stream of reading spreadsheet document
  if (directStream) {
    return spreadsheetStream;
  }

  // pull content from stream and put into variable
  let result = [];

  try {
    result = await collectData(spreadsheetStream, {
      throwable,
      isCsv,
    });
  } catch (error) {
    return processError(error, throwable);
  }

  if (!Array.isArray(result)) {
    return processError(ERROR.WAS_NOT_BUILD, throwable);
  }

  // make stream from array data
  if (isStream) {
    try {
      result = createReadableStream(result, {
        throwable,
        isCsv,
        eolType,
      });
    } catch (error) {
      return processError(ERROR.STREAM_ERROR, throwable);
    }
  }

  return result;
};
