require('tap-spec-integrated');
const test = require('tape-catch');

const monopod = require('..');
const bootstrap = require('../bootstrap');

test('monopod exports submodules as properties', (is) => {
  is.equal(
    monopod.bootstrap,
    bootstrap
  );

  is.end();
});
