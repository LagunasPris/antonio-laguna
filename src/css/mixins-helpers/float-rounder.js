/**
 * Converts to fixed float and removes dangling 0.
 * @param {number} number
 * @return {string}
 */
module.exports = function floatRounder(number) {
  return number.toFixed(2).replace(/[.,](00)|(0)$/, '').replace(/^[0.]+/, '.');
};
