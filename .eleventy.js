const fs = require('fs');
const htmlmin = require('html-minifier');
const markdownIt = require('markdown-it');
const markdownItAnchor = require('markdown-it-anchor');
const markdownItAbbr = require('markdown-it-abbr');
const markdownItContainer = require('markdown-it-container');
const markdownItImageFigures = require('markdown-it-image-figures');
const pluginRss = require('@11ty/eleventy-plugin-rss');
const pluginNavigation = require('@11ty/eleventy-navigation');
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const socialImages = require('@11tyrocks/eleventy-plugin-social-images');
const embedTwitter = require('eleventy-plugin-embed-twitter');
const eleventyPluginTOC = require('@thedigitalman/eleventy-plugin-toc-a11y');

const addHash = require('./eleventy/filters/add-hash');
const htmlDateString = require('./eleventy/filters/html-date-string');
const lastModifiedDate = require('./eleventy/filters/last-modified-date');
const readableDateFilter = require('./eleventy/filters/readable-date');
const shortDateFilter = require('./eleventy/filters/short-date');
const sitemapDateTimeStringFilter = require('./eleventy/filters/sitemap-date-time-string');
const slugifyFilter = require('./eleventy/filters/slugify');

const infoContainer = require('./eleventy/containers/info');
const hiddenHeaderContainer = require('./eleventy/containers/hidden-header');

module.exports = function(config) {
  config.addPlugin(pluginRss);
  config.addPlugin(pluginNavigation);
  config.addPlugin(syntaxHighlight);
  config.addPlugin(socialImages);
  config.addPlugin(embedTwitter, {
    cacheText: true
  });
  config.addPlugin(eleventyPluginTOC, {
    headingText: 'Tabla de Contenidos',
    wrapperClass: 'article__toc',
    headingClass: 'toc__heading text--upper text-level--6 color--secondary',
    listClass: 'toc__list',
    listItemClass: 'toc__item',
    listItemAnchorClass: 'toc__anchor'
  });

  config.addNunjucksAsyncFilter('addHash', addHash);
  config.addCollection('posts', collection => [
    ...collection.getFilteredByGlob('./src/posts/*.md')
  ]);

  config.addWatchTarget('./src/css/');
  config.addWatchTarget('./src/js/');

  config.addPassthroughCopy('./src/img');
  config.addPassthroughCopy('./src/icons');
  config.addPassthroughCopy('_headers');
  config.addPassthroughCopy('favicon.ico');
  config.addPassthroughCopy('static/img');
  config.addPassthroughCopy('_includes/assets/');

  config.addShortcode('year', () => `${new Date().getFullYear()}`);

  config.setDataDeepMerge(true);

  config.addFilter('readableDate', readableDateFilter);
  config.addFilter('shortDate', shortDateFilter);
  config.addFilter('htmlDateString', htmlDateString);
  config.addFilter('sitemapDateTimeString', sitemapDateTimeStringFilter);
  config.addFilter('slugify', slugifyFilter);

  config.addNunjucksAsyncFilter('lastModifiedDate', lastModifiedDate);

  // Minify HTML output
  config.addTransform('htmlmin', function(content, outputPath) {
    if (outputPath.indexOf('.html') > -1) {
      return htmlmin.minify(content, {
        removeAttributeQuotes: true,
        collapseBooleanAttributes: true,
        collapseWhitespace: true,
        sortClassName: true,
        sortAttributes: true,
        html5: true,
        decodeEntities: true,
        minifyCSS: true
      });
    }

    return content;
  });

  const markdownLibrary = markdownIt({
    html: true,
    breaks: true,
    linkify: true
  });

  markdownLibrary.use(markdownItAnchor, {
    permalink: true,
    slugify: slugifyFilter,
    permalinkClass: 'direct-link',
    permalinkSymbol: '<svg class="direct-link__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="20" height="20" fill="currentColor"><path fill-rule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clip-rule="evenodd"/></svg>',
    permalinkSpace: true,
    level: [1, 2, 3]
  })
    .use(markdownItImageFigures, { lazy: true, figcaption: true, dataType: true })
    .use(markdownItAbbr)
    .use(markdownItContainer, 'info', infoContainer(markdownLibrary))
    .use(markdownItContainer, 'hidden-header', hiddenHeaderContainer(markdownLibrary));

  config.setLibrary('md', markdownLibrary);

  config.setBrowserSyncConfig({
    callbacks: {
      ready: function (err, browserSync) {
        browserSync.addMiddleware('*', (req, res) => {
          res.write(fs.readFileSync('public/404.html'));
          res.end();
        });
      },
    },
    ui: false,
    ghostMode: false
  });

  return {
    templateFormats: ['md', 'njk', 'html', 'liquid'],
    markdownTemplateEngine: 'liquid',
    htmlTemplateEngine: 'njk',
    dataTemplateEngine: 'njk',
    passthroughFileCopy: true,
    dir: {
      input: 'src',
      output: 'public'
    }
  };
};
