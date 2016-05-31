const tinyError = require('tiny-error');

module.exports = (message) => tinyError(
  `Oops! Things didn’t quite work as we wanted. ${message}`
);
