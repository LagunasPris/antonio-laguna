import webmentionsHelpers from '../../eleventy/helpers/webmentions';

const DEFAULT_AVATAR = 'https://res.cloudinary.com/antonio-laguna/image/upload/v1624254488/antonio.laguna/webmention-avatar-default_ydiia0.svg';
const ENDPOINT = 'https://webmention.io/api/mentions?perPage=1000&jsonp=parseWebmentions';
const Selectors = {
  Counts: {
    Interactions: '.interactions__count',
    InteractionsDescription: '.interactions__count__description',
    Likes: '.mentions__likes',
    Retweets: '.mentions__retweets',
    Comments: '.mentions__comments__title'
  },
  Templates: {
    Like: '#like-template',
    Comment: '#comment-template'
  }
};

(() => {
  const currentUrl = `https://antonio.laguna.es${location.pathname}`;
  const randomness = Math.random();
  const scriptPath = `${ENDPOINT}&target=${encodeURIComponent(currentUrl)}&_=${randomness}`;

  function fillAuthorPhoto(template, author) {
    const photo = template.querySelector('.u-photo');
    photo.src = author.photo || DEFAULT_AVATAR;
    photo.alt = '';
    photo.onerror = () => {
      photo.src = DEFAULT_AVATAR;
    };
  }

  function fillLike(template, vals) {
    const author = vals.author ? vals.author : {};
    const link = template.querySelector('.u-url');

    fillAuthorPhoto(template, author);
    link.href = vals.mentionUrl;
    link.title = `Ver perfil de ${author.name}`;
    template.querySelector('.p-author').innerHTML = author.name;
  }

  function fillComment(template, vals) {
    const author = vals.data?.author || {};
    const authorEl = template.querySelector('.u-author');
    const dateEl = template.querySelector('.dt-published');
    const date = new Date(vals.data?.published);

    authorEl.href = author.url;
    authorEl.title = `Ver perfil de ${author.name}`;

    fillAuthorPhoto(template, author);
    template.querySelector('.p-author').innerText = author.name;
    template.querySelector('.e-entry').innerHTML = vals.data?.content;
    template.querySelector('.u-url').href = vals.data?.url;

    dateEl.setAttribute('datetime', vals.data?.published);
    dateEl.innerText = date.toLocaleDateString('es-ES', { month: 'long', day: '2-digit', year: 'numeric' });
  }

  function processMention(mentions, element, template, filler, unHide) {
    if (mentions.length) {
      const parent = element.parentElement.parentElement;
      const list = parent.querySelector('.mentions__list');

      element.innerText = mentions.length;
      list.innerHTML = '';
      mentions.forEach(like => {
        const t = template.content.cloneNode(true);
        filler(t, like);
        list.appendChild(t);
      });

      unHide.push(parent);
    }
  }

  function parseWebmentions(data) {
    const parsed = webmentionsHelpers({ children: data.links });

    if (parsed.total) {
      const count = document.querySelector(Selectors.Counts.Interactions);
      const countDescription = document.querySelector(Selectors.Counts.InteractionsDescription);
      const likes = document.querySelector(Selectors.Counts.Likes);
      const retweets = document.querySelector(Selectors.Counts.Retweets);
      const comments = document.querySelector(Selectors.Counts.Comments);
      const likeTemplate = document.querySelector(Selectors.Templates.Like);
      const commentTemplate = document.querySelector(Selectors.Templates.Comment);

      const countText = parsed.total === 1 ? 'interacción' : 'interacciones';
      const unHide = [count.parentElement, countDescription];

      count.innerText = `${parsed.total} ${countText}`;

      processMention(parsed.likes, likes, likeTemplate, fillLike, unHide);
      processMention(parsed.reposts, retweets, likeTemplate, fillLike, unHide);
      processMention(parsed.comments, comments, commentTemplate, fillComment, unHide);

      unHide.forEach(el => el.classList.remove('hide'));
    }
  }

  if (currentUrl.includes('/posts/') || currentUrl.includes('/snippets/')) {
    const script = document.createElement('script');
    script.src = scriptPath;
    script.async = true;
    document.head.appendChild(script);

    window.parseWebmentions = parseWebmentions;
  }
})();
