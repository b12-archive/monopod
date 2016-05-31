/* eslint-disable quote-props */
  // Quoting all properties in a mock file tree looks much more elegant
  // than quoting only some.

const test$ = require('./_/test');
const test = test$('debootstrap');
const mockFs = require('mock-fs');
const fs = require('fs');
const asObject = require('as/object');
const includes = require('array-includes');

const debootstrap = require('../debootstrap');

const projectName = 'my-project';
const path = `/path/to/${projectName}`;
const packages = [
  'my-package',
  'another-package',
];

test('Removes the `node_modules/@<scope>` symlink', (is) => {
  is.plan(1);
  const scope = 'my-scope';
  const scopeDirName = `@${scope}`;
  const nodeModulesPath = `${path}/node_modules`;
  mockFs({
    [nodeModulesPath]: {
      [scopeDirName]: mockFs.symlink({ path: 'whatever' }),
    },
  });

  debootstrap({ path, scope });

  is.ok(
    !includes(fs.readdirSync(nodeModulesPath), scopeDirName),
    'removes the symlink at `node_modules/@<scope>`'
  );

  mockFs.restore();
  is.end();
});

test.skip((
  'Fails gracefully if `node_modules/@<scope>` is not a symlink'
), (is) => {
  is.end();
});

test('Removes `packages/*/node_modules` symlinks', (is) => {
  mockFs({ [path]: {
    'packages': asObject(packages.map(name => ({
      key: name,
      value: {
        'node_modules': mockFs.symlink({ path: 'whatever' }),
      },
    }))),
  } });

  debootstrap({ path });

  const packagePaths = packages.map((name) => (
    `${path}/packages/${name}`
  ));

  is.ok(
    packagePaths.every((depsPath) => (
      !includes(fs.readdirSync(depsPath), 'node_modules')
    )),
    'removes the symlink at every `packages/*/node_modules`'
  );

  mockFs.restore();
  is.end();
});

test.skip((
  'Fails gracefully if `packages/*/node_modules` aren’t symlinks'
), (is) => {
  is.end();
});
