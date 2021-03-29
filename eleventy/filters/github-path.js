const pkg = require('../../package.json');

module.exports = function githubPathFilter(inputPath) {
  return inputPath.replace('./', `${pkg.repository.url}/tree/master/`);
};
