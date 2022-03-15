const { Readable } = require('stream');

/**
 * Creates readable stream from provided data
 *
 * @param {object} data data which must be presented as readable stream
 * @returns {Readable} readable stream
 */
const convertToStream = (data) => {
  return Readable.from(JSON.stringify(data));
};

module.exports = {
  convertToStream,
};
