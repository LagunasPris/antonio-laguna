const { DateTime } = require('luxon');

module.exports = function sitemapDateTimeString(dateObj) {
  const date = DateTime.fromJSDate(dateObj, { zone: 'utc' });

  if (!date.isValid) {
    return '';
  }

  return date.toISO();
};
