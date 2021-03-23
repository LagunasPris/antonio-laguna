const getUnitHelper = require('../mixins-helpers/get-unit');
const floatRounderHelper = require('../mixins-helpers/float-rounder');

module.exports = function (vars) {
  return (rule, ...args) => {
    const [
      property,
      mvw,
      mxvw,
      mvalue,
      mxvalue
    ] = args;

    const styles = {};

    const minValue = vars.allUnprefixed[mvalue];
    const maxValue = vars.allUnprefixed[mxvalue];
    const minVW = vars.allUnprefixed[mvw];
    const maxVW = vars.allUnprefixed[mxvw];

    const calcLimit = floatRounderHelper(parseFloat(minValue));
    const calcUnit = getUnitHelper(minValue);
    const calcSum = floatRounderHelper(parseFloat(maxValue) - parseFloat(minValue));
    const viewportLimit = floatRounderHelper(
      (parseFloat(maxVW) - parseFloat(minVW)) * 10
    );
    const idealFluidSetting = `calc(${calcLimit}${calcUnit} + ${calcSum} * (100vw - ${minVW}) / ${viewportLimit})`;
    styles[property] = [
      minValue,
      `clamp(${minValue}, ${idealFluidSetting}, ${maxValue})`
    ];

    return styles;
  };
};
