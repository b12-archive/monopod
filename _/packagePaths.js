'use strict'; // eslint-disable-line strict
  // Otherwise we can’t use `let` in node v4.

const fs = require('fs');
const includes = require('array-includes');
const newError = require('./newError');
const b = require('chalk').bold;

module.exports = (path) => {
  const packagesPath = `${path}/packages`;
  let packages;
  try {
    packages = fs.readdirSync(packagesPath);
  } catch (error) {
    if (!includes(['ENOENT', 'ENOTDIR'], error.code)) throw error;
    throw newError(
      `Make sure there’s a subdirectory ${b('packages')} in your project.`
    );
  }

  return packages.map((packageDir) => (
    `${packagesPath}/${packageDir}`
  ));
};
