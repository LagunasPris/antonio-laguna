const fs = require('fs/promises');
const path = require('path');
const fetch = require('node-fetch');
const { URL } = require('url');
const website = require('../../package.json').author.url;

const { hostname } = new URL(website);

require('dotenv').config();

const CACHE_DIR = path.resolve(__dirname, 'cache');
const ENDPOINT = 'https://webmention.io/api';
const TOKEN = process.env.WEBMENTION_IO_TOKEN;
const CACHE_FILE = `${CACHE_DIR}/webmentions.json`;

async function fetchWebmentions(since, perPage = 10000) {
  if (!TOKEN) {
    // If we dont have a domain access token, abort
    console.warn(
      'Unable to fetch Webmentions: No access token specified in WEBMENTION_IO_TOKEN.'
    );

    return false;
  }

  const url = new URL(`${ENDPOINT}/mentions.jf2`);

  url.searchParams.set('domain', hostname);
  url.searchParams.set('token', TOKEN);
  url.searchParams.set('per-page', perPage);

  if (since) {
    url.searchParams.set('per-page', since);
  }

  const response = await fetch(url);

  if (response.ok) {
    return response.json();
  }

  console.warn('Something has gone wrong');
  return null;
}

async function readFromCache() {
  let cacheExists;

  try {
    cacheExists = await fs.stat(CACHE_FILE);
  } catch (e) {
    cacheExists = false;
  }

  if (cacheExists) {
    const cacheFile = await fs.readFile(CACHE_FILE);
    return JSON.parse(cacheFile);
  }

  // No cache
  return {
    lastFetched: null,
    children: []
  };
}

async function writeToCache(data) {
  const fileContent = JSON.stringify(data, null, 2);
  let cacheDirExists;

  try {
    cacheDirExists = await fs.stat(CACHE_DIR);
  } catch (e) {
    cacheDirExists = false;
  }

  if (!cacheDirExists) {
    await fs.mkdir(CACHE_DIR);
  }

  await fs.writeFile(CACHE_FILE, fileContent);
}

function mergeWebmentions(cache, feed) {
  const children = [];
  const added = [];

  cache.children.forEach(m => {
    children.push(m);
    added.push(m['wm-id']);
  });

  feed.children.forEach(m => {
    if (!added.includes(m['wm-id'])) {
      children.push(m);
      added.push(m['wm-id']);
    }
  });

  return children;
}

module.exports = async function () {
  const cache = await readFromCache();

  if (cache.children.length) {
    console.log(`${cache.children.length} webmentions loaded from cache`);
  }

  // Only fetch new mentions in production
  if (process.env.ELEVENTY_ENV === 'production') {
    const feed = await fetchWebmentions(cache.lastFetched);

    if (feed) {
      const webmentions = {
        lastFetched: new Date().toISOString(),
        children: mergeWebmentions(cache, feed)
      };

      await writeToCache(webmentions);
      return webmentions;
    }
  }

  return cache;
};
