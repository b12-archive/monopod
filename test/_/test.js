const tape = require('tape-catch');

module.exports = (part) => Object.assign(
  (message, callback) => tape(`${part}: ${message}`, callback),
  tape
);
