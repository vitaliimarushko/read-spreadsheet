/**
 * Checks current environment of executing code
 *
 * @type {boolean} "true" if this environment belongs to a browser, otherwise - "false"
 */
module.exports = {
  isBrowser: typeof window !== 'undefined' && typeof window.document !== 'undefined',
};
