import { Cli } from 'clipanion';

import { pkgUtils, warningUtils } from '@verdaccio/core';

import { InfoCommand } from './commands/info';
import { InitCommand } from './commands/init';
import { VersionCommand } from './commands/version';
import { MIN_NODE_VERSION, isVersionValid } from './utils';

if (process.getuid && process.getuid() === 0) {
  warningUtils.emit(warningUtils.Codes.VERWAR001);
}

if (!isVersionValid(process.version)) {
  throw new Error(
    `Verdaccio requires at least Node.js v${MIN_NODE_VERSION} or higher and you have installed ${process.version}, 
    please upgrade your Node.js distribution`
  );
}

const [node, app, ...args] = process.argv;

const cli = new Cli({
  binaryLabel: `verdaccio`,
  binaryName: `${node} ${app}`,
  binaryVersion: pkgUtils.getPackageJson(__dirname, '..').version as string,
});

cli.register(InfoCommand);
cli.register(InitCommand);
cli.register(VersionCommand);
cli.runExit(args, Cli.defaultContext);

process.on('uncaughtException', function (err) {
  console.error(
    // eslint-disable-next-line max-len
    `uncaught exception, please report (https://github.com/verdaccio/verdaccio/issues) this: \n${err.stack}`
  );
  process.exit(1);
});
