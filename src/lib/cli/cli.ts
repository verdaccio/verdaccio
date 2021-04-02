import { Cli } from 'clipanion';
import { InfoCommand } from './commands/info';
import { InitCommand } from './commands/init';
import { isVersionValid, MIN_NODE_VERSION } from './utils';

require('pkginfo')(module);
const pkgVersion = module.exports.version;

if (process.getuid && process.getuid() === 0) {
  process.emitWarning(`Verdaccio doesn't need superuser privileges. don't run it under root`);
}

if (!isVersionValid(process.version)) {
  throw new Error(
    `Verdaccio requires at least Node.js v${MIN_NODE_VERSION} or higher and you have installed v${process.version}, 
    please upgrade your Node.js distribution`
  );
}

const [node, app, ...args] = process.argv;

const cli = new Cli({
  binaryLabel: `verdaccio`,
  binaryName: `${node} ${app}`,
  binaryVersion: pkgVersion,
});

cli.register(InfoCommand);
cli.register(InitCommand);
cli.runExit(args, Cli.defaultContext);
