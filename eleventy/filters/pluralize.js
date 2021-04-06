module.exports = function pluralizeFilter(number, singular, plural) {
  const str = number.toString();
  return str === '1' ? singular : plural;
};
