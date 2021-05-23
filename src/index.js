const processError = require('./functions/processError');
const requestContent = require('./functions/requestContent');
const collectJson = require('./functions/collectJson');
const {ERROR} = require('./constants');

/**
 * Makes request to a Google spreadsheet document and retrieves its content
 *
 * @param {string} spreadsheetId just string ID which represents spreadsheet document
 * @param {boolean} throwable defines if it's needed to throw exception or just return some result if some operation is wrong; default: false
 * @returns {Promise<Array>} array of objects; every array item is row from spreadsheet
 * @throws {Promise<Error>} common error instance
 */
module.exports = async (spreadsheetId, throwable = false) => {
  // check incoming parameters
  if (
    !spreadsheetId ||
    typeof spreadsheetId !== 'string' ||
    !spreadsheetId.length
  ) {
    return processError(ERROR.WRONG_ID, throwable);
  }

  // retrieve spreadsheet content as stream
  let resultStream = null;

  try {
    resultStream = await requestContent(spreadsheetId, throwable);
  } catch (error) {
    return processError(error, throwable);
  }

  if (!resultStream || typeof resultStream.pipe !== 'function') {
    return processError(ERROR.WAS_NOT_READ, throwable);
  }

  // pull content from stream and put into variable
  let result = [];

  try {
    result = await collectJson(resultStream, throwable);
  } catch (error) {
    return processError(error, throwable);
  }

  if (!Array.isArray(result)) {
    return processError(ERROR.WAS_NOT_BUILD, throwable);
  }

  return result;
};
