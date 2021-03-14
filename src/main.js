import lozad from 'lozad';

(function (useNative, selector) {
  // Lazy Loading supported
  if (useNative && 'loading' in HTMLImageElement.prototype) {
    const lazyEls = document.querySelectorAll(`.${selector}`);

    lazyEls.forEach((lazyEl) => {
      lazyEl.setAttribute('src', lazyEl.getAttribute('data-src'));
    });
  } else {
    const observer = lozad(`.${selector}`);
    observer.observe();
  }

  const siteLogo = document.querySelector('.site-header__logo');
  const link = document.querySelector('link[rel~="icon"]');
  const originalValue = link.href;

  siteLogo.addEventListener('mouseenter', () => {
    link.href = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🐘</text></svg>'
  });
  siteLogo.addEventListener('mouseleave', () => {
    link.href = originalValue;
  });
}(true, 'lazy'));
