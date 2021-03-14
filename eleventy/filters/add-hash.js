const { promisify } = require('util');
const readFile = promisify(require('fs').readFile);
const hasha = require('hasha');

module.exports = function addHashFilter(absolutePath, callback) {
  readFile(`public${absolutePath}`, { encoding: 'utf-8' })
    .then(content => hasha.async(content))
    .then((hash) => {
      callback(null, `${absolutePath}?hash=${hash.substr(0, 10)}`);
    })
    .catch((error) => callback(error));
};
