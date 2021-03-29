import lozad from 'lozad';

function lazyload() {
  const lazyEls = Array.from(document.querySelectorAll('.lazy'));

  if (!lazyEls.length) {
    return;
  }

  lazyEls.forEach(el => el.classList.remove('lazy'));

  if ('loading' in HTMLImageElement.prototype) {
    lazyEls.forEach(lazyEl => {
      lazyEl.setAttribute('src', lazyEl.getAttribute('data-src'));
    });
  } else {
    const observer = lozad(lazyEls);
    observer.observe();
  }
}

(() => lazyload())();

export default lazyload;
