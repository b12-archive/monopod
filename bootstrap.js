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

  const packagesPath = `${path}/packages`;
  let packages;
  try {
    packages = fs.readdirSync(packagesPath);
  } catch (error) {
    if (includes(['ENOENT', 'ENOTDIR'], error.code)) throw newError(
      `Make sure there’s a subdirectory ${b('packages')} in your project.`
    );
  }

  const packagePaths = packages.map((packageDir) => (
    `${packagesPath}/${packageDir}`
  ));

  packagePaths.forEach((packagePath) => {
    const nodeModulesPath = `${packagePath}/node_modules`;

    let nodeModulesStats;
    try {
      nodeModulesStats = fs.lstatSync(nodeModulesPath);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }

    if (nodeModulesStats && !nodeModulesStats.isSymbolicLink()) throw newError(
      'Making sure we don’t overwrite any important stuff, ' +
      `we’ve stumbled upon the ${
        nodeModulesStats.isDirectory() ? 'directory' : 'file'
      } ${b(nodeModulesPath)}. We don’t want to break things, so make sure ` +
      `there’s nothing called ${b('node_modules')} ` +
      `in any of your ${b('packages/*/')}. We’re fine if it’s a symlink, ` +
      'by the way.'
    );
  });

  packagePaths.forEach((packagePath) => {
    fs.symlinkSync('../../node_modules', `${packagePath}/node_modules`, 'dir');
  });
};
