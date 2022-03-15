/**
 * Takes a value and definitely sets its value as valid string or null
 *
 * @param {string | null} gid any value which it's needed to prepare
 * @returns {string | null} prepared gid; default: null
 */
const prepareGid = (gid) => {
  try {
    gid = String(gid).valueOf();
  } catch (error) {
    return null;
  }

  if (gid && gid !== 'null') {
    gid = gid.toString().substring(0, 36); // just to make a gid with some short value
  } else {
    return null;
  }

  return gid;
};

module.exports = {
  prepareGid,
};
