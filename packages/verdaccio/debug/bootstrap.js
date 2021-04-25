// this file aims to help local debugging with hot transpilation
require('@babel/register')({
  extensions: ['.ts'],
});
require('@verdaccio/cli');
