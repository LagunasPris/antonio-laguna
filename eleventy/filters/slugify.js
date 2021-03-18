const slugify = require('slugify');

module.exports = function slugifyFilter(string) {
  if (!string) {
    return;
  }

  return slugify(string.toString(), {
    lower: true,
    replacement: '-',
    remove: /[*+~.·,()'"`´%!¡?¿:@]/g
  });
};
