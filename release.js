const yankee = require('yankee');

/*                                                            (see git.io/rtype)
  (
    packageName: String,
      // Name of a package. Should live in `<path>/packages/<packageName>`

    {
      path = process.cwd(): String,
        // Path to your project directory
    }
  ) =>
    Void
 */
module.exports = (packageName, params) => {
  const path = params.path || process.cwd();

  yankee({ path: `${path}/packages/${packageName}` });
};
