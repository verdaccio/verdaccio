// this file aims to help local debugging with hot transpilation
// it requires BABEL_ENV=registry set as env variable
require('@babel/register')();
require('../src/lib/cli');
