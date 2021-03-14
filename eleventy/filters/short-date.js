const { DateTime } = require('luxon');

module.exports = function shortDate(dateObj) {
  const date = DateTime.fromJSDate(dateObj, { zone: 'Europe/Madrid' }).setLocale('es').toFormat('dd LLL');
  const [day, month] = date.split(' ');

  return `${day} ${month.substring(0, 3)}`;
};
