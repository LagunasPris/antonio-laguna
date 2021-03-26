function triggerResize() {
  window.dispatchEvent(new Event('resize'));
}

function watchResizers() {
  for (const img of document.querySelectorAll('img')) {
    img.addEventListener('load', triggerResize);
  }
}

export { triggerResize, watchResizers };
