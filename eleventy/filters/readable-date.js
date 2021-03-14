const { DateTime } = require('luxon');

module.exports = function readableDate(dateObj) {
  return DateTime.fromJSDate(dateObj, { zone: 'Europe/Madrid' })
    .setLocale('es').toFormat('dd LLLL yyyy');
};
