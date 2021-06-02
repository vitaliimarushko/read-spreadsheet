const debug = require('./getDebug');

/**
 * Takes a value and definitely sets its value as valid string or null.
 *
 * @param {string|null} gid any value which it needed to prepare
 * @returns {string|null} prepared gid
 */
module.exports = (gid) => {
  try {
    gid = String(gid).valueOf();
  } catch (error) {
    debug(error.message || error);
    gid = null;
  }

  if (gid && gid !== 'null') {
    gid = gid.toString().substring(0, 36);
  } else {
    gid = null;
  }

  return gid;
};
