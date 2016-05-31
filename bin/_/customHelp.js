const hasbinSync = require('hasbin').sync;
const spawnSync = require('child_process').spawnSync;
const resolve = require('path').resolve;
const readFileSync = require('fs').readFileSync;

module.exports = (params) => {
  if (params.program.hasOwnProperty('help')) {
    const manpagePath =
      resolve(__dirname, `../../manpages/${params.manpage}.1`);

    if (hasbinSync('man')) {
      const manProcess =
        spawnSync('man', [manpagePath], { stdio: 'inherit' });
      if (manProcess.error) throw manProcess.error;
    } else {
      process.stdout.write(
        readFileSync(`${manpagePath}.txt`, 'utf8')
      );
    }

    process.exit();
  }
};
