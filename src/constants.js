module.exports = {
  ERROR: {
    WRONG_ID: new Error('Spreadsheet document ID is wrong'),
    CANT_BE_READ: new Error(`Spreadsheet document content can't read by some reasons`),
    WAS_NOT_BUILD: new Error(`Content wasn't built from stream`),
    WRONG_RESPONSE: new Error('Wrong response after requesting spreadsheet document'),
    NOT_PUBLIC: new Error('Spreadsheet document has not public access'),
    STREAM_ERROR: new Error('Readable stream can\'t be created'),
  },
  DEFAULT_STRINGIFIED_DATA: '',
};
