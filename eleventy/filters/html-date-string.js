module.exports = function htmlDateStringFilter(dateObj) {
  const dateObject = new Date(dateObj);
  return dateObject.toISOString();
};
