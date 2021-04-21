module.exports = function renderPermalink(slug, opts, state, idx) {
  // based on fifth version in
  // https://amberwilson.co.uk/blog/are-your-anchor-links-accessible/
  const linkContent = state.tokens[idx + 1].children[0].content;

  // Create the openning <div> for the wrapper
  const headingWrapperTokenOpen = Object.assign(
    new state.Token('div_open', 'div', 1),
    {
      attrs: [['class', 'heading-wrapper']],
    }
  );
  // Create the closing </div> for the wrapper
  const headingWrapperTokenClose = Object.assign(
    new state.Token('div_close', 'div', -1),
    {
      attrs: [['class', 'heading-wrapper']],
    }
  );

  // Create the tokens for the full accessible anchor link
  // <a class="${opts.permalinkClass}" href="#${permalinkHref}">
  //   <span aria-hidden="true">
  //     ${opts.permalinkSymbol}
  //   </span>
  //   <span class="visually-hidden">
  //     Sección con título ${linkContent}
  //   </span>
  // </a >
  const anchorTokens = [
    Object.assign(new state.Token('link_open', 'a', 1), {
      attrs: [
        ...(opts.permalinkClass ? [['class', opts.permalinkClass]] : []),
        ['href', opts.permalinkHref(slug, state)],
        ...Object.entries(opts.permalinkAttrs(slug, state)),
      ],
    }),
    Object.assign(new state.Token('span_open', 'span', 1), {
      attrs: [['aria-hidden', 'true']],
    }),
    Object.assign(new state.Token('html_block', '', 0), {
      content: opts.permalinkSymbol,
    }),
    Object.assign(new state.Token('span_close', 'span', -1), {}),
    Object.assign(new state.Token('span_open', 'span', 1), {
      attrs: [['class', 'visually-hidden']],
    }),
    Object.assign(new state.Token('html_block', '', 0), {
      content: `Sección con título ${linkContent}`,
    }),
    Object.assign(new state.Token('span_close', 'span', -1), {}),
    new state.Token('link_close', 'a', -1),
  ];

  // idx is the index of the heading's first token
  // insert the wrapper opening before the heading
  state.tokens.splice(idx, 0, headingWrapperTokenOpen);
  // insert the anchor link tokens after the wrapper opening and the 3 tokens of the heading
  state.tokens.splice(idx + 3 + 1, 0, ...anchorTokens);
  // insert the wrapper closing after all these
  state.tokens.splice(
    idx + 3 + 1 + anchorTokens.length,
    0,
    headingWrapperTokenClose
  );
};
