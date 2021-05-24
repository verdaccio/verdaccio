#!/usr/bin/env node

/* eslint-disable no-console */
console.log('running scenario', process.argv);
const fetch = require('node-fetch');

(async () => {
  // console.log('1');
  // const response = await fetch('http://localhost:4873/aaa');
  // const r = await response.text();
  // console.log('---', r);
  setTimeout(function () {
    process.exit(0);
  }, 4000);
})();
// console.log(body);
