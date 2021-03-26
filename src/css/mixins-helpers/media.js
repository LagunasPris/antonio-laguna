module.exports = function getMedia(vars, media) {
  return `@media (min-width: ${vars.allUnprefixed[media]})`;
};
