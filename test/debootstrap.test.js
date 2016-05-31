/* eslint-disable quote-props */
  // Quoting all properties in a mock file tree looks much more elegant
  // than quoting only some.

const test$ = require('./_/test');
const test = test$('debootstrap');
const mockFs = require('mock-fs');
const fs = require('fs');
const asObject = require('as/object');
const includes = require('array-includes');
const naked = require('./_/naked');

const requiresPackagesDir = require('./reusable/requiresPackagesDir');

const debootstrap = require('../debootstrap');

const projectName = 'my-project';
const path = `/path/to/${projectName}`;
const packages = [
  'my-package',
  'another-package',
];
const scope = 'my-scope';
const scopeDirName = `@${scope}`;
const projectNodeModulesPath = `${path}/node_modules`;
const mockSymlink = mockFs.symlink({ path: 'whatever' });
const packagePath =
  name => `${path}/packages/${name}`;

test('Removes the `node_modules/@<scope>` symlink', (is) => {
  is.plan(1);
  mockFs({
    [projectNodeModulesPath]: {
      [scopeDirName]: mockSymlink,
    },
  });

  debootstrap({ path, scope });

  is.ok(
    !includes(fs.readdirSync(projectNodeModulesPath), scopeDirName),
    'removes the symlink at `node_modules/@<scope>`'
  );

  mockFs.restore();
  is.end();
});

test((
  'Fails gracefully if `node_modules/@<scope>` is not a symlink'
), (is) => {
  is.plan(1);
  mockFs({
    [projectNodeModulesPath]: {
      [scopeDirName]: {},
    },
  });

  try {
    debootstrap({ path, scope });
  } catch (error) {
    is.ok(
      /remove it by hand/i.test(naked(error)),
      'throws a helpful error'
    );
  }

  mockFs.restore();
  is.end();
});

test('Removes `packages/*/node_modules` symlinks', (is) => {
  mockFs({ [path]: {
    'packages': asObject(packages.map(name => ({
      key: name,
      value: {
        'node_modules': mockSymlink,
      },
    }))),
  } });

  debootstrap({ path });

  const packagePaths = packages.map(packagePath);

  is.ok(
    packagePaths.every((depsPath) => (
      !includes(fs.readdirSync(depsPath), 'node_modules')
    )),
    'removes the symlink at every `packages/*/node_modules`'
  );

  mockFs.restore();
  is.end();
});

requiresPackagesDir({ test, path, logicModule: debootstrap });

test((
  'Fails gracefully if any `packages/*/node_modules` isn’t a symlink'
), (is) => {
  is.plan(2);
  const symlinkedPackage = packages[0];
  mockFs({
    [packagePath(symlinkedPackage)]: { 'node_modules': mockSymlink },
    [packagePath(packages[1])]: { 'node_modules': {} },
  });

  try {
    debootstrap({ path });
  } catch (error) {
    is.ok(
      /remove it by hand/i.test(naked(error)),
      'throws a helpful error'
    );
  }

  try {
    const nodeModulesSymlink = fs.lstatSync(
      `${packagePath(symlinkedPackage)}/node_modules`
    );
    is.ok(
      nodeModulesSymlink.isSymbolicLink(),
      'leaves all symlinks intact'
    );
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    is.fail(
      'doesn’t remove other files'
    );
  }

  mockFs.restore();
  is.end();
});
