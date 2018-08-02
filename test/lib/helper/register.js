require("babel-polyfill");
require('babel-core/register')({
  ignore: /node_modules\/(?!ProjectB)/,
  sourceMap: 'inline',
});
require('../../../src/lib/cli');
