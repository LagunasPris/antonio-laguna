import lozad from 'lozad';

function lazyload() {
  const lazyEls = document.querySelectorAll('.lazy');

  if (!lazyEls.length) {
    return;
  }

  const lazyArray = Array.from(lazyEls);

  lazyArray.forEach(el => el.classList.remove('lazy'));

  if ('loading' in HTMLImageElement.prototype) {
    lazyArray.forEach(lazyEl => {
      lazyEl.setAttribute('src', lazyEl.getAttribute('data-src'));
    });
  } else {
    const observer = lozad(lazyEls);
    observer.observe();
  }
}

(() => lazyload())();

export default lazyload;
