const { DateTime } = require('luxon');
const { promisify } = require('util');
const fs = require('fs');
const execFile = promisify(require('child_process').execFile);
const htmlmin = require('html-minifier');
const slugify = require('slugify');
const markdownIt = require('markdown-it');
const markdownItAnchor = require('markdown-it-anchor');
const readFile = promisify(require('fs').readFile);
const hasha = require('hasha');
const pluginRss = require('@11ty/eleventy-plugin-rss');
const pluginNavigation = require('@11ty/eleventy-navigation');
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const socialImages = require('@11tyrocks/eleventy-plugin-social-images');

const DefaultLocale = 'es';

module.exports = function(config) {
  config.addPlugin(pluginRss);
  config.addPlugin(pluginNavigation);
  config.addPlugin(syntaxHighlight);
  config.addPlugin(socialImages);

  config.addNunjucksAsyncFilter('addHash', function (
    absolutePath,
    callback
  ) {
    readFile(`public${absolutePath}`, { encoding: 'utf-8' })
      .then(content => hasha.async(content))
      .then((hash) => {
        callback(null, `${absolutePath}?hash=${hash.substr(0, 10)}`);
      })
      .catch((error) => callback(error));
  });
  config.addCollection('posts', collection => {
    return [
      ...collection.getFilteredByGlob('./src/posts/*.md')
    ];
  });

  config.addWatchTarget('./src/sass/')

  config.addPassthroughCopy('./src/css');
  config.addPassthroughCopy('./src/img');
  config.addPassthroughCopy('./src/icons');
  config.addPassthroughCopy('_headers');

  config.addShortcode('year', () => `${new Date().getFullYear()}`);

  config.setDataDeepMerge(true);

  config.addFilter('readableDate', dateObj => DateTime.fromJSDate(dateObj, { zone: 'Europe/Madrid' })
    .setLocale(DefaultLocale).toFormat('dd LLLL yyyy'));
  config.addFilter('shortDate', dateObj => {
    const date = DateTime.fromJSDate(dateObj, { zone: 'Europe/Madrid' }).setLocale(DefaultLocale).toFormat('dd LLL');
    const [day, month] = date.split(' ');

    return `${day} ${month.substring(0, 3)}`;
  });
  config.addFilter('htmlDateString', dateObj => {
    const dateObject = new Date(dateObj);
    return dateObject.toISOString();
  });

  async function lastModifiedDate(filename) {
    try {
      const { stdout } = await execFile('git', [
        'log',
        '-1',
        '--format=%cd',
        filename,
      ]);

      if (stdout) {
        return new Date(stdout);
      }

      return new Date();
    } catch (e) {
      console.error(e.message);
      // Fallback to stat if git isn't working.
      const stats = await stat(filename);
      return stats.mtime; // Date
    }
  }

  // Cache the lastModifiedDate call because shelling out to git is expensive.
  // This means the lastModifiedDate will never change per single eleventy invocation.
  const lastModifiedDateCache = new Map();
  config.addNunjucksAsyncFilter('lastModifiedDate', function (
    filename,
    callback
  ) {
    const call = (result) => {
      result.then((date) => callback(null, date));
      result.catch((error) => callback(error));
    };
    const cached = lastModifiedDateCache.get(filename);
    if (cached) {
      return call(cached);
    }
    const promise = lastModifiedDate(filename);
    lastModifiedDateCache.set(filename, promise);
    call(promise);
  });

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

  config.addFilter('slugify', string => {
    if (!string) {
      return;
    }

    return slugify(string.toString(), {
      lower: true,
      replacement: '-',
      remove: /[*+~.·,()'"`´%!¡?¿:@]/g
    });
  });

  // Don't process folders with static assets e.g. images
  config.addPassthroughCopy('favicon.ico');
  config.addPassthroughCopy('static/img');
  config.addPassthroughCopy('admin');
  config.addPassthroughCopy('_includes/assets/');

  const markdownLibrary = markdownIt({
    html: true,
    breaks: true,
    linkify: true
  }).use(markdownItAnchor, {
    permalink: true,
    permalinkClass: 'direct-link',
    permalinkSymbol: '<svg class="direct-link__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="20" height="20" fill="currentColor"><path fill-rule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clip-rule="evenodd"/></svg>',
    permalinkSpace: true,
    level: [1, 2, 3]
  });
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
