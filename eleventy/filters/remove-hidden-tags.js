const HiddenTags = [
  'posts',
  'snippets',
  'Guia React'
];

module.exports = function removeHiddenTagsFilter(array) {
  return array.filter(el => !HiddenTags.includes(el));
};
