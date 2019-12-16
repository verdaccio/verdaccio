require('@babel/register')({
  extensions: [".ts", ".js"]
});
module.exports = require('./setup/test_environment');
