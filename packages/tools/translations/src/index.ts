import { Cli } from 'clipanion';

import { ApiCommand } from './api';

const [node, app, ...args] = process.argv;

const cli = new Cli({
  binaryLabel: `translations`,
  binaryName: `${node} ${app}`,
  binaryVersion: require('../package.json').version,
});

cli.register(ApiCommand);
cli.runExit(args, Cli.defaultContext);

process.on('uncaughtException', function (err) {
  // eslint-disable-next-line no-console
  console.error(
    // eslint-disable-next-line max-len
    `uncaught exception, please report (https://github.com/verdaccio/verdaccio/issues) this: \n${err.stack}`
  );
  process.exit(1);
});

const data = require('./progress_lang.json');

export { data };
