import { defineCustomElements } from 'quizes';

defineCustomElements();

(() => {
  customElements.whenDefined('quiz-es').then(() => {
    setTimeout(() => {
      const quizElement = document.querySelector('.quiz-es');

      quizElement.addEventListener('quizCompleted', event => {
        const { answers, correctAmount, correctPercent } = event.detail;
        const number = document.querySelector('.progress-circle__number');
        const result = document.querySelector('.progress-circle__result');
        const button = document.querySelector('.button--tweet');
        number.innerHTML = `${correctAmount} / ${answers.length}`;
        result.setAttribute('stroke-dashoffset', `${100 - correctPercent}`);
        const url = new URL('https://twitter.com/intent/tweet');
        const text = button.dataset.template
          .replace('$TITLE', button.dataset.title)
          .replace('$RESULT', `${correctAmount}/${answers.length}`);

        url.searchParams.set('url', button.dataset.url);
        url.searchParams.set('via', button.dataset.via);
        url.searchParams.set('text', text);
        url.searchParams.set('hashtags', button.dataset.tags);
        button.href = url.toString();
      });
    }, 150);
  });
})();
