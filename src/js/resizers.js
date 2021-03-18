function triggerResize() {
  window.dispatchEvent(new Event('resize'));
}

export default function watchResizers() {
  if (window.twttr) {
    window.twttr.events.bind('loaded', triggerResize);
  } else {
    const twitterScript = document.querySelector('[src="https://platform.twitter.com/widgets.js"]');

    if (twitterScript) {
      twitterScript.onload = () => {
        window.twttr.events.bind('loaded', triggerResize);
      };
    }
  }

  for (const img of document.querySelectorAll('img')) {
    img.addEventListener('load', triggerResize);
  }
}
