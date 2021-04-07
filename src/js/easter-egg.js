(() => {
  const siteLogo = document.querySelector('.site-header__logo');
  const links = document.querySelectorAll('link[rel~="icon"]');
  const originalValues = Array.from(links).map(link => link.href);

  siteLogo.addEventListener('mouseenter', () => {
    links.forEach(link => {
      link.href = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🐘</text></svg>';
    });
  });

  siteLogo.addEventListener('mouseleave', () => {
    links.forEach((link, i) => {
      link.href = originalValues[i];
    });
  });
})();
