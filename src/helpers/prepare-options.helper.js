const { prepareGid } = require('../helpers/prepare-gid.helper');

/**
 * Reviews all the options and sets only valid values
 *
 * @param {{isArray?: boolean, gid?: string, isStream?: boolean}} options incoming options
 * @returns {{isArray: boolean, gid: string | null, isStream: boolean}} prepared valid options
 */
const prepareOptions = (options = {}) => {
  const {
    isArray = false,
    gid = null,
    isStream = false,
  } = options && !Array.isArray(options) && typeof options === 'object' ? options : {};

  return {
    isArray: !!isArray,
    gid: prepareGid(gid),
    isStream: !!isStream,
  };
};

module.exports = {
  prepareOptions,
};
