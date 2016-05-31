const mockFs = require('mock-fs');
const naked = require('../_/naked');

module.exports = (params) => {
  params.test('Fails gracefully when there is no `packages` dir', (is) => {
    is.plan(1);
    mockFs({ [params.path]: {} });

    try {
      params.logicModule({ path: params.path });
    } catch (error) {
      is.ok(
        /a subdirectory packages/i.test(naked(error)),
        'throws a helpful message'
      );
    }

    mockFs.restore();
    is.end();
  });
};
