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
  'color-shadow': 'rgba(0, 0, 0, .3)',
  'color-tweet': '#1da1f2',
  'color-react': '#61dafb',
  'color-text': 'var(--color-dark)',
  'color-accent': 'var(--color-secondary)',
  'color-selection': 'var(--color-primary)',
  'color-selection-text': 'var(--color-light)',
  'color-callout': 'var(--color-light-blue)'
};

const variables = {
  'font-base': '"Fira Sans", sans-serif',
  'font-code': '"Fira Code", monospace',
  'spacing-xs': '0.625rem',
  'spacing-sm': '1.25rem',
  'spacing-md': '1.875rem',
  'spacing-lg': '3rem',
  'spacing-xl': '5rem',
  'grid-outside': '0.625rem',
  'grid-max': '72rem',
  'min-width': '20rem',
  'max-width': '67.5rem',
  'screen-size': '100vw',
  'level-1-min': '3rem',
  'level-1-max': '4.25rem',
  'level-2-min': '2.5rem',
  'level-2-max': '3.375rem',
  'level-3-min': '2rem',
  'level-3-max': '2.75rem',
  'level-4-min': '1.875rem',
  'level-4-max': '2.125rem',
  'level-5-min': '1.5rem',
  'level-5-max': '1.75rem',
  'level-6-min': '1rem',
  'level-6-max': '1.25rem',
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
