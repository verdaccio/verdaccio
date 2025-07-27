#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

// this file aims to help local debugging with hot transpilation
// it requires BABEL_ENV=registry set as env variable
require('@babel/register')({
  extensions: ['.ts', '.js'],
});
require('../src/lib/cli');
