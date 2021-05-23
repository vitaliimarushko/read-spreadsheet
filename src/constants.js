module.exports = {
  ERROR: {
    WRONG_ID: new Error('Spreadsheet document ID is wrong'),
    WAS_NOT_READ: new Error(`Spreadsheet document content wasn't read`),
    WAS_NOT_BUILD: new Error(`JSON content wasn't built`),
    WRONG_RESPONSE: new Error('Wrong response after requesting spreadsheet document'),
    NOT_PUBLIC: new Error('Spreadsheet document has not public access'),
    NOT_STREAM: new Error('Spreadsheet document stream is not readable stream'),
  },
};
