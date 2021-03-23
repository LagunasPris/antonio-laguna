module.exports = function getUnit(number) {
  return number.toString().replace(/(\d)(\.)?/g, '');
};
