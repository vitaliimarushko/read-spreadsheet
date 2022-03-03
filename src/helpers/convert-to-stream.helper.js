const stream = require('stream');

/**
 * Creates readable stream from provided data
 *
 * @param {any} data data which must be presented as readable stream
 * @returns {Readable} readable stream
 */
const convertToStream = (data) => {
  return stream.Readable.from(Buffer.from(data).toString());
};

module.exports = {
  convertToStream,
};
