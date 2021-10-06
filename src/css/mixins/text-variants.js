const fluidType = require('./fluid-type');

module.exports = function (vars) {
  return rule => {
    const styles = {};
    const fluidTypeMixin = fluidType(vars);

    for (let i = 1; i <= 6; i++) {
      styles[`.text-level--${i}, .ugc .text-level--${i}`] = fluidTypeMixin(
        rule,
        'font-size',
        'min-width',
        'max-width',
        `level-${i}-min`,
        `level-${i}-max`
      );
    }

    return styles;
  };
};
