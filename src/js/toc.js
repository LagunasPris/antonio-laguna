import tinybounce from 'tinybounce';
import { watchResizers } from './resizers';

(() => {
  const ACTIVE_CLASS = 'toc__anchor--active';
  const tocLinks = Array.from(document.querySelectorAll('.toc__anchor'));
  const hasTocLinks = !!tocLinks.length;

  if (!hasTocLinks) {
    return;
  }

  const sections = [];

  tocLinks.forEach(link => {
    const heading = document.querySelector(link.getAttribute('href'));

    sections.push({
      heading,
      link,
      position: 0
    });
  });

  let currentSection = null;
  const getScrollPosition = () => (window.pageYOffset || document.scrollTop) - (document.clientTop || 0) || 0;

  const handleScroll = () => {
    let matchingSection = sections[0];
    const scrollPosition = getScrollPosition();

    for (const section of sections) {
      if (scrollPosition > section.position) {
        matchingSection = section;
      } else {
        break;
      }
    }

    if (matchingSection !== currentSection) {
      if (currentSection) {
        currentSection.link.classList.remove(ACTIVE_CLASS);
      }

      matchingSection.link.classList.add(ACTIVE_CLASS);

      currentSection = matchingSection;
    }
  };

  const onResize = tinybounce(() => {
    const scrollPosition = getScrollPosition();

    sections.forEach(section => {
      const rect = section.heading.getBoundingClientRect();
      section.position = rect.top + scrollPosition;
    });

    handleScroll();
  }, 150);

  document.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('resize', onResize, { passive: true });

  watchResizers();

  onResize();
  handleScroll();
})();
