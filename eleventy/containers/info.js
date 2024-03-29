module.exports = md => ({
  validate: params => params.trim().match(/^info\s+(.*)$/),
  render: (tokens, idx) => {
    const m = tokens[idx].info.trim().match(/^info\s+(.*)$/);

    if (tokens[idx].nesting === 1) {
      return `<aside class="callout callout--info">
                <span class="callout__icon flex--v-center" aria-label="Información">ℹ️</span>
                <p class="callout__title">${md.utils.escapeHtml(m[1])}</p>\n`;
    }

    return '</aside>\n';
  }
});
