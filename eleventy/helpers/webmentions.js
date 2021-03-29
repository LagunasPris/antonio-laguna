const allowedTypes = {
  likes: ['like-of', 'like'],
  reposts: ['repost-of', 'repost'],
  comments: ['mention-of', 'in-reply-to', 'link']
};
const allowedTypesValues = [
  'like-of',
  'like',
  'repost-of',
  'repost',
  'mention-of',
  'in-reply-to',
  'link'
];

function getType(mention) {
  return typeof mention['wm-property'] !== 'undefined'
    ? mention['wm-property']
    : mention.activity?.type;
}

function getAuthor(mention) {
  return mention.author || mention.data?.author;
}

function filteredWebmentions(webmentions) {
  return webmentions.children
    .filter(mention => {
      const type = getType(mention);
      const isAllowedType = allowedTypesValues.includes(type);
      const isNotPrivate = mention['wm-private'] !== true;

      return isAllowedType && isNotPrivate;
    });
}

function clean(entry) {
  if (entry.content) {
    let value = entry.content.text;

    if (entry.content.text.length > 280) {
      value = `${entry.content.text.substr(0, 280)}&hellip;`;
    }

    entry.content.value = value;
  }

  return entry;
}

function getLike(mention) {
  const author = getAuthor(mention);
  const mentionUrl = mention.url || mention.data?.url;

  return ({ author, mentionUrl });
}

module.exports = function webmentionsParser(webmentions) {
  const cleanedWebmentions = filteredWebmentions(webmentions)
    .sort((a, b) =>
      new Date(a.published || a['wm-received']) -
      new Date(b.published || b['wm-received'])
    )
    .map(clean);

  const likes = cleanedWebmentions
    .filter(mention => {
      const isLike = allowedTypes.likes.includes(getType(mention));
      const hasAuthor = !!getAuthor(mention);

      return isLike && hasAuthor;
    })
    .map(getLike);

  const reposts = cleanedWebmentions
    .filter(mention => {
      const isRepost = allowedTypes.reposts.includes(getType(mention));
      const hasAuthor = !!getAuthor(mention);

      return isRepost && hasAuthor;
    })
    .map(getLike);

  const comments = cleanedWebmentions
    .filter(mention => {
      const hasAuthor = !!getAuthor(mention);
      const isComment = allowedTypes.comments.includes(getType(mention));

      return hasAuthor && isComment;
    });

  return {
    total: cleanedWebmentions.length,
    likes,
    reposts,
    comments
  };
}
