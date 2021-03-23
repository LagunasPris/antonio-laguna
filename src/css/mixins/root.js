module.exports = function (vars) {
  return () => {
    const styles = {};
    const root = {};

    for (const [key, value] of Object.entries(vars.public)) {
      root[`--${key}`] = value;
    }

    styles[':root'] = root;

    return styles;
  };
};
