import commander from 'commander';
import { bgYellow, bgRed } from 'kleur';

import { logger } from '@verdaccio/logger';

import infoCommand from './commands/info';
import initProgram from './commands/init';
import { isVersionValid } from './utils';

const isRootUser = process.getuid && process.getuid() === 0;

if (isRootUser) {
  global.console.warn(
    bgYellow().red(
      "*** WARNING: Verdaccio doesn't need superuser privileges. Don't run it under root! ***"
    )
  );
}

if (isVersionValid()) {
  global.console.error(
    bgRed(
      'Verdaccio requires at least Node.js ${MIN_NODE_VERSION} or higher,' +
        ' please upgrade your Node.js distribution'
    )
  );
  process.exit(1);
}

process.title = 'verdaccio';

const pkgVersion = require('../package.json').version;
const pkgName = 'verdaccio';

commander
  .option('-i, --info', 'prints debugging information about the local environment')
  .option('-l, --listen <[host:]port>', 'host:port number to listen on (default: localhost:4873)')
  .option('-c, --config <config.yaml>', 'use this configuration file (default: ./config.yaml)')
  .version(pkgVersion)
  .parse(process.argv);

const fallbackConfig = commander.args.length == 1 && !commander.config;
const isHelp = commander.args.length !== 0;

if (commander.info) {
  infoCommand();
} else if (fallbackConfig) {
  // handling "verdaccio [config]" case if "-c" is missing in command line
  commander.config = commander.args.pop();
  initProgram(commander, pkgVersion, pkgName);
} else if (isHelp) {
  commander.help();
} else {
  initProgram(commander, pkgVersion, pkgName);
}

process.on('uncaughtException', function (err) {
  logger.fatal(
    {
      err: err,
    },
    'uncaught exception, please report (https://github.com/verdaccio/verdaccio/issues) ' +
      'this: \n@{err.stack}'
  );
  process.exit(255);
});
