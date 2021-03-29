module.exports = function readableDate(dateObj) {
  const date = typeof dateObj === 'string' ? new Date(dateObj) : dateObj;

  return date.toLocaleDateString('es-ES', { month: 'long', day: '2-digit', year: 'numeric' });
};
