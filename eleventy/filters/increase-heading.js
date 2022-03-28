module.exports = function increaseHeading(heading) {
  const headingLevel = parseInt(heading[1], 10);
  return `h${headingLevel + 1}`;
};
