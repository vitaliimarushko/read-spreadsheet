const { prepareGid } = require('../helpers/prepare-gid.helper');

/**
 * Reviews all the options and sets only valid values
 *
 * @param {{isJson?: boolean, gid?: string, isStream?: boolean}} options incoming options
 * @returns {{isJson: boolean, gid: string | null, isStream: boolean}} prepared valid options
 */
const prepareOptions = (options = {}) => {
  const {
    isJson = false,
    gid = null,
    isStream = false,
  } = options && !Array.isArray(options) && typeof options === 'object' ? options : {};

  return {
    isJson: !!isJson,
    gid: prepareGid(gid),
    isStream: !!isStream,
  };
};

module.exports = {
  prepareOptions,
};
