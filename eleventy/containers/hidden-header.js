const slugifyFilter = require('../filters/slugify');

module.exports = md => ({
  validate: params => params.trim().match(/^hidden-header\s+(.*)$/),
  render: (tokens, idx) => {
    const m = tokens[idx].info.trim().match(/^hidden-header\s+(.*)$/);

    if (tokens[idx].nesting === 1) {
      return `<h2 class="visually-hidden" id="${slugifyFilter(m[1])}">${md.utils.escapeHtml(m[1])}</h2>`;
    }

    return '';
  }
});
