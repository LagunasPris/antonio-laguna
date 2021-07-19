/**
 * Parse data and call plausible
 * Using data attribute in html eg. data-analytics='"Register", {"props":{"plan":"Starter"}}'
 *
 * @param {string} data - plausible event "Register", {"props":{"plan":"Starter"}}
 */
function registerEvent(data) {
  // break into array
  const attributes = data.split(/,(.+)/);

  // Parse it to object
  const events = [JSON.parse(attributes[0]), JSON.parse(attributes[1] || '{}')];

  if (window.plausible) {
    window.plausible(...events);
  }
}

/**
 * Iterate Elements and add event listener
 *
 * @param {NodeList} els List of elements
 * @param {string} callback function name
 */
function registerAnalyticsEvents(els, callback) {
  for (let i = 0; i < els.length; i++) {
    els[i].addEventListener('click', callback);
    els[i].addEventListener('auxclick', callback);
  }
}

/**
 * Handle Link Events with plausible
 * https://github.com/plausible/analytics/blob/e1bb4368460ebb3a0bb86151b143176797b686cc/tracker/src/plausible.js#L74
 *
 * @param {Event} event
 */
function handleLinkEvent(event) {
  let link = event.target;
  const middle = event.type === 'auxclick' && event.which === 2;
  const click = event.type === 'click';

  while (link && (typeof link.tagName === 'undefined' || link.tagName.toLowerCase() !== 'a' || !link.href)) {
    link = link.parentNode;
  }

  if (middle || click) {
    registerEvent(link.getAttribute('data-analytics'));
  }

  // Delay navigation so that Plausible is notified of the click
  if (!link.target) {
    if (!(event.ctrlKey || event.metaKey || event.shiftKey) && click) {
      setTimeout(() => {
        location.href = link.href;
      }, 150);

      event.preventDefault();
    }
  }
}

// Handle link events - those that have data-analytics
const elements = document.querySelectorAll('a[data-analytics]');
registerAnalyticsEvents(elements, handleLinkEvent);
