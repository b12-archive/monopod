const fs = require('fs');

module.exports = fs.readdirSync(`${__dirname}/../bin/commands`);
