/* eslint-disable quote-props */
  // Quoting all properties in a mock file tree looks much more elegant
  // than quoting only some.

const test$ = require('./_/test');
const test = test$('bootstrap');
const mockFs = require('mock-fs');
const fs = require('fs');
const path = require('path');
const asObject = require('as/object');
const naked = require('./_/naked');

const bootstrap = require('../bootstrap');

const projectName = 'my-project';
const projectPath = `/path/to/${projectName}`;
const packages = [
  'my-package',
  'another-package',
];

test('Makes global dependencies available to packages', (is) => {
  mockFs({ [projectPath]: {
    'node_modules': {},
    'packages': asObject(packages.map(name => ({
      key: name,
      value: {},
    }))),
  } });

  bootstrap({ path: projectPath });

  const packageDepsDirs = packages.map((name) => (
    `${projectPath}/packages/${name}/node_modules`
  ));
  try {
    const links = packageDepsDirs.map(dir => fs.lstatSync(dir));
    is.ok(
      links.every(link => link.isSymbolicLink()),
      'creates symlinks at every `packages/*/node_modules`'
    );

    const linkTargets = packageDepsDirs.map(dir => fs.readlinkSync(dir));
    is.ok(
      linkTargets.every(target => target === path.relative(
        `${projectPath}/packages/my-package`,
        `${projectPath}/node_modules`
      )),
      'each symlink is relative and points at the root node_modules'
    );
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    is.fail(
      'creates files at `packages/*/node_modules`'
    );
  }

  mockFs.restore();
  is.end();
});

test('Fails gracefully when there is no `packages` dir', (is) => {
  is.plan(1);
  mockFs({ [projectPath]: {} });

  try {
    bootstrap({ path: projectPath });
  } catch (error) {
    is.ok(
      /a subdirectory packages/i.test(naked(error)),
      'throws a helpful message'
    );
  }

  mockFs.restore();
  is.end();
});

test((
  'Fails gracefully when there is a `node_modules` directory in a package dir'
), (is) => {
  is.plan(1);
  mockFs({ [projectPath]: {
    'packages': {
      'my-package': {
        'node_modules': {},
      },
    },
  } });

  try {
    bootstrap({ path: projectPath });
  } catch (error) {
    is.ok(
      /the directory \S+\/node_modules/i.test(naked(error)),
      'throws a helpful message'
    );
  }

  mockFs.restore();
  is.end();
});

test('Makes packages available to each other', (is) => {
  is.plan(3);
  mockFs({ [projectPath]: {
    'packages': {},
  } });

  const scope = 'my-scope';
  bootstrap({ path: projectPath, scope });

  try {
    const nodeModulesDir = `${projectPath}/node_modules`;
    const nodeModules = fs.statSync(nodeModulesDir);
    is.ok(
      nodeModules.isDirectory(),
      'creates `node_modules` if it doesn’t exist'
    );

    const linkDir = `${nodeModulesDir}/@${scope}`;
    const link = fs.lstatSync(linkDir);
    is.ok(
      link.isSymbolicLink(),
      'creates a symlink at `node_modules/@<scope>`'
    );

    const linkTarget = fs.readlinkSync(linkDir);
    is.equal(
      linkTarget,
      `${projectPath}/packages`,
      'the symlink is absolute and points at the `packages` directory'
    );
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    is.fail(
      'creates a file at `node_modules/@<scope>`'
    );
  }

  mockFs.restore();
  is.end();
});

test('Implies scope from directory name', (is) => {
  is.plan(1);
  mockFs({ [projectPath]: {
    'packages': {},
  } });

  bootstrap({ path: projectPath });

  try {
    const link = fs.lstatSync(`${projectPath}/node_modules/@${projectName}`);
    is.ok(
      link.isSymbolicLink(),
      'creates a symlink at `node_modules/@<project directory name>`'
    );
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    is.fail(
      'creates a file at `node_modules/@<scope>`'
    );
  }

  mockFs.restore();
  is.end();
});

test('Fails gracefully if `node_modules` is a non-directory', (is) => {
  is.plan(1);
  mockFs({ [projectPath]: {
    'node_modules': 'whatever',
    'packages': {},
  } });

  try {
    bootstrap({ path: projectPath });
  } catch (error) {
    is.ok(
      /make sure [^\s]*node_modules is a directory/i.test(naked(error)),
      'throws a helpful message'
    );
  }

  mockFs.restore();
  is.end();
});
