const spacings = [
  'xs',
  'sm',
  'md',
  'lg',
  'xl'
];

module.exports = function (vars) {
  return () => {
    const styles = {};

    spacings.forEach(spacing => {
      styles[`.spacing--${spacing}`] = {
        'margin-bottom': vars.allUnprefixed[`spacing-${spacing}`]
      };
    });

    styles['.spacing--none'] = {
      'margin-bottom': '0'
    };

    return styles;
  };
};
