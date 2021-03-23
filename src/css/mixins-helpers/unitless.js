module.exports = function unitless(value) {
  return value.toString().replace(/[^\d.-]/g, '');
};
