import { Cli } from 'clipanion';
import { InfoCommand } from './commands/info';
import { InitCommand } from './commands/init';
import { isVersionValid, MIN_NODE_VERSION } from './utils';

if (process.getuid && process.getuid() === 0) {
  process.emitWarning(`Verdaccio doesn't need superuser privileges. don't run it under root`);
}

if (isVersionValid()) {
  throw new Error(
    `Verdaccio requires at least Node.js ${MIN_NODE_VERSION} or higher, 
    please upgrade your Node.js distribution`
  );
}

const [node, app, ...args] = process.argv;

const cli = new Cli({
  binaryLabel: `verdaccio`,
  binaryName: `${node} ${app}`,
  binaryVersion: require('../package.json').version,
});

cli.register(InfoCommand);
cli.register(InitCommand);
cli.runExit(args, Cli.defaultContext);
