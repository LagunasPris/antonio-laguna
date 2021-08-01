module.exports = function readableDate(articles) {
  const now = new Date();
  return articles.filter(post => post.date <= now && !post.data.draft);
};
