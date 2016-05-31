/* eslint-disable no-param-reassign */
  // Commander has an imperative API

const commander = require('commander');

module.exports = (options) => (commander

  // Populate the `path`
  .arguments('[path]',
    'The path to your monorepo. Should contain a `packages` subdirectory.',
    '$(pwd)'
  )
  .action((path) => {
    options.path = path;
  })

  // Parse options
  .option('-s, --scope',
    'The npm scope of all packages in your monorepo.',
    '$(basename "$path")'
  )
  .option('-h, --help',
    'You’re looking at it.'
  )
  .parse(process.argv)
);
