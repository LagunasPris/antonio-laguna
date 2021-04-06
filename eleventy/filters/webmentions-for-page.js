const { URL } = require('url');
const SiteUrl = require('../../package.json').author.url;
const webmentionsParser = require('../helpers/webmentions');

function filteredWebmentions(webmentions, page) {
  const url = new URL(page, SiteUrl).toString();
  return webmentions.children
    .filter(mention => mention['wm-target'] === url);
}

module.exports = {
  count(webmentions, page) {
    return filteredWebmentions(webmentions, page).length;
  },

  mentions(webmentions, page) {
    const cleanedWebmentions = filteredWebmentions(webmentions, page);
    return webmentionsParser({ children: cleanedWebmentions });
  }
};
