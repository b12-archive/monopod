'use strict'; // eslint-disable-line strict
  // Otherwise we can’t use `let` in node v4.

const fs = require('fs');
const tinyError = require('tiny-error');
const includes = require('array-includes');
const chalk = require('chalk');
const b = chalk.bold;

const newError = (message) => tinyError(
  `Oops! Things didn’t quite work as we wanted. ${message}`
);

/*                                                            (see git.io/rtype)
  ({
    path = process.cwd(): String,
      // Path to your project directory
  }) =>
    Void
 */
module.exports = (params) => {
  const path = params.path || process.cwd();

  let packages;
  try {
    packages = fs.readdirSync(`${path}/packages`);
  } catch (error) {
    if (includes(['ENOENT', 'ENOTDIR'], error.code)) throw newError(
      `Make sure there’s a subdirectory ${b('packages')} in your project.`
    );
  }
};
