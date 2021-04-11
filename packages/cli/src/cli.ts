import { displayError } from '@verdaccio/cli-ui';
import { Cli } from 'clipanion';
import { InfoCommand } from './commands/info';
import { InitCommand } from './commands/init';
import { VersionCommand } from './commands/version';
import { NewServer} from './commands/newServer';
import { isVersionValid, MIN_NODE_VERSION } from './utils';

if (process.getuid && process.getuid() === 0) {
  process.emitWarning(`Verdaccio doesn't need superuser privileges. don't run it under root`);
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
  binaryVersion: require('../package.json').version,
});

cli.register(InfoCommand);
cli.register(InitCommand);
cli.register(VersionCommand);
cli.register(NewServer);
cli.runExit(args, Cli.defaultContext);

process.on('uncaughtException', function (err) {
  displayError(
    // eslint-disable-next-line max-len
    `uncaught exception, please report (https://github.com/verdaccio/verdaccio/issues) this: \n${err.stack}`
  );
  process.exit(1);
});
