const { promisify } = require('util');
const fs = require('fs');
const execFile = promisify(require('child_process').execFile);
const stat = promisify(fs.stat);

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
    // eslint-disable-next-line no-console
    console.error(e.message);

    // Fallback to stat if git isn't working.
    const stats = await stat(filename);
    return stats.mtime; // Date
  }
}

// Cache the lastModifiedDate call because shelling out to git is expensive.
// This means the lastModifiedDate will never change per single eleventy invocation.
const lastModifiedDateCache = new Map();

module.exports = function lastModifiedDateFilter(filename, callback) {
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
};
