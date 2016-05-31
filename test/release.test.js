/* eslint-disable quote-props */
  // Quoting all properties in a mock file tree looks much more elegant
  // than quoting only some.

const test$ = require('./_/test');
const test = test$('release');
const mockFs = require('mock-fs');
const asObject = require('as/object');
const proxyquire = require('proxyquire');

const projectName = 'my-project';
const path = `/path/to/${projectName}`;
const packages = [
  'my-package',
  'another-package',
];
const packagePath =
  name => `${path}/packages/${name}`;

test('Bumps version number', (is) => {
  is.plan(1);
  const bumpedPackage = packages[1];

  const release = proxyquire('../release', {
    'yankee': (params) => {
      is.deepEqual(
        params,
        { path: packagePath(bumpedPackage) },
        'passes correct params to yankee'
      );
    },
  });

  mockFs(asObject(packages.map(packageName => ({
    key: packagePath(packageName),
    value: {},
  }))));

  release(bumpedPackage, { path });

  mockFs.restore();
  is.end();
});

test.skip('Keeps dependent packages in sync', (is) => {
  mockFs({});

  mockFs.restore();
  is.end();
});
