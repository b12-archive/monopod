const stripAnsi = require('strip-ansi');

module.exports =
  error => stripAnsi(String(error));
