#!/usr/bin/env node

// eslint-disable-next-line no-console
console.log('-prepare->', process.argv);
const { runServer } = require('@verdaccio/node-api');

// (async () => {
//   const app = await runServer();
//   app.listen(4000, (event) => {
//     // do something
//     // eslint-disable-next-line no-console
//     console.log('event', event);
//   });
// })();
