module.exports = function headFilter(array, n) {
  if (n < 0) {
    return array.slice(n);
  }

  return array.slice(0, n);
};
