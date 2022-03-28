function yearFromPost(post) {
  return new Date(post.date).getFullYear();
}

module.exports = function byYear(posts) {
  const newPosts = [];

  if (!Array.isArray(posts) || posts.length === 0 || !posts[0]) {
    return posts;
  }

  let currentIndex = 0;
  let currentYear = yearFromPost(posts[0]);
  newPosts.push([currentYear, []]);

  posts.forEach(post => {
    if (!post || !post?.date) {
      return;
    }

    const postYear = yearFromPost(post);

    if (postYear !== currentYear) {
      currentYear = postYear;
      currentIndex++;
      newPosts.push([currentYear, []]);
    }

    newPosts[currentIndex][1].push(post);
  });

  return newPosts;
};
