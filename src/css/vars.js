const colors = {
  'color-light': '#fff',
  'color-dark': '#333',
  'color-primary': '#003049',
  'color-secondary': '#dc7202',
  'color-secondary-dark': '#fd8303',
  'color-tertiary': '#fcbf49',
  'color-light-gray': '#e5e5e5',
  'color-light-blue': '#f3fbff',
  'color-dark-blue': '#001a27',
  'color-regal-blue': '#00486b',
  'color-background': 'var(--color-light)',
  'color-text': 'var(--color-dark)',
  'color-accent': 'var(--color-secondary)',
  'color-selection': 'var(--color-primary)',
  'color-selection-text': 'var(--color-light)',
  'color-callout': 'var(--color-light-blue)'
};

const variables = {
  'font-base': '"Fira Sans", sans-serif',
  'font-code': '"Fira Code", monospace',
  'spacing-xs': '1rem',
  'spacing-sm': '2rem',
  'spacing-md': '3rem',
  'spacing-lg': '5rem',
  'spacing-xl': '8rem',
  'grid-outside': '1rem',
  'grid-max': '115rem',
  'min-width': '32rem',
  'max-width': '108rem',
  'screen-size': '100vw',
  'level-1-min': '4.8rem',
  'level-1-max': '6.7rem',
  'level-2-min': '4rem',
  'level-2-max': '5.4rem',
  'level-3-min': '3.3rem',
  'level-3-max': '4.3rem',
  'level-4-min': '3rem',
  'level-4-max': '3.4rem',
  'level-5-min': '2.3rem',
  'level-5-max': '2.8rem',
  'level-6-min': '1.6rem',
  'level-6-max': '1.9rem',
};

const all = {};

for (const [key, value] of Object.entries(variables)) {
  all[`--${key}`] = value;
}

module.exports = {
  public: colors,
  allUnprefixed: variables,
  all
};
