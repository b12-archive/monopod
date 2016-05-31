'use strict'; // eslint-disable-line strict
  // Otherwise we can’t use `let` in node v4.

const fs = require('fs');
const pathModule = require('path');
const chalk = require('chalk');
const b = chalk.bold;
const mkdirp = require('mkdirp');
const newError = require('./_/newError');
const packagePaths = require('./_/packagePaths');

/*                                                            (see git.io/rtype)
  ({
    path = process.cwd(): String,
      // Path to your project directory

    scope = require('path').basename(path): String,
      // The npm scope of all packages in your repo
  }) =>
    Void
 */
module.exports = (params) => {
  const path = params.path || process.cwd();
  const scope = params.scope || pathModule.basename(path);

  const symlinkError = (symlinkPath) => newError(
    `We’ve expected ${b(symlinkPath)} to be a symlink ` +
    `(that’s what ${b('monopod bootstrap')} creates) – but it’s ` +
    'a regular file or directory. We don’t want to break anything, ' +
    'so please remove it by hand and try again.'
  );

  // Check if scope symlink is safe to remove
  const nodeModulesPath = `${path}/node_modules`;
  const scopeSymlinkPath = `${nodeModulesPath}/@${scope}`;
  try {
    const symlink = fs.lstatSync(scopeSymlinkPath);
    if (!symlink.isSymbolicLink()) throw symlinkError(scopeSymlinkPath);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    mkdirp.sync(nodeModulesPath);
  }

  // Check if package dep symlinks are safe to remove
  const packageDepsPaths = packagePaths(path).map(
    packagePath => `${packagePath}/node_modules`
  );
  const packageDepsSymlinkPaths = packageDepsPaths.filter((packageDepsPath) => {
    try {
      const symlink = fs.lstatSync(packageDepsPath);
      if (!symlink.isSymbolicLink()) throw symlinkError(packageDepsPath);
      return true;
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
      return false;
    }
  });

  // Remove scope symlink
  fs.unlinkSync(scopeSymlinkPath);

  // Remove package deps symlinks
  packageDepsSymlinkPaths.forEach(symlinkPath => fs.unlinkSync(symlinkPath));
};
