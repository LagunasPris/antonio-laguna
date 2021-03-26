const path = require('path');

const vars = require('./src/css/vars');
const mixins = require('require-all')({
  dirname: path.resolve(__dirname, './src/css/mixins'),
  resolve: mixin => mixin(vars)
});

module.exports = ctx => {
  const isProd = ctx.env === 'production';
  const plugins = [
    require('postcss-import'),
    require('postcss-mixins')({
      mixins
    }),
    require('postcss-nested'),
    require('postcss-preset-env')({
      features: {
        'nesting-rules': false
      },
      importFrom: [{
        customProperties: vars.all
      }],
      stage: 1,
      preserve: false
    }),
    require('postcss-calc'),
    require('postcss-sort-media-queries')
  ];

  if (isProd) {
    plugins.push(require('cssnano')({
      preset: 'default',
    }));
  }

  return {
    map: !isProd,
    verbose: true,
    plugins
  };
};
