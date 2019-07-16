require('@babel/register')({
  extensions: [".ts", ".js"]
});
module.exports = require('./lib/environment');
