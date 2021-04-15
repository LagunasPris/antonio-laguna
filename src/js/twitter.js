import { triggerResize } from './resizers';

function loadTwitter() {
  const script = document.createElement('script');
  script.onload = function () {
    window.twttr.events.bind('loaded', triggerResize);
  };
  script.src = 'https://platform.twitter.com/widgets.js';
  script.async = true;

  document.head.appendChild(script);
}

function updateTweetThemes(tweets) {
  const currentTheme = document.documentElement.dataset.theme;

  if (currentTheme === 'dark') {
    tweets.forEach(tweet => {
      tweet.firstElementChild.dataset.theme = 'dark';
    });
  }
}

(() => {
  const tweets = Array.from(document.querySelectorAll('.eleventy-plugin-embed-twitter'));

  if (!tweets.length) {
    return;
  }

  const cache = tweets.map(tweet => tweet.innerHTML);

  updateTweetThemes(tweets);
  loadTwitter();

  document.body.addEventListener('changeTheme', () => {
    tweets.forEach((tweet, i) => {
      tweet.innerHTML = cache[i];
      updateTweetThemes(tweets);
      window.twttr.widgets.load();
    });
  });
})();
