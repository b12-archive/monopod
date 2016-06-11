require('tap-spec-integrated');
const test = require('tape-catch');

const monopod = require('..');
const bootstrap = require('../bootstrap');
const debootstrap = require('../debootstrap');
const release = require('../release');

test('monopod exports submodules as properties', (is) => {
  is.equal(
    monopod.bootstrap,
    bootstrap
  );

  is.equal(
    monopod.debootstrap,
    debootstrap
  );

  is.equal(
    monopod.release,
    release
  );

  is.end();
});
