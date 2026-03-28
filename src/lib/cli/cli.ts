import { Cli } from 'clipanion';

import { InfoCommand } from './commands/info';
import { InitCommand } from './commands/init';
import { VersionCommand } from './commands/version';
import { MIN_NODE_VERSION, isVersionValid } from './utils';

const pkgVersion = process.env.PACKAGE_VERSION || 'dev';

if (pkgVersion.includes('canary')) {
  console.warn(
    '\n' +
      '⚠️  WARNING: You are running a CANARY build of Verdaccio (v' +
      pkgVersion +
      ').\n' +
      '   This is an unstable pre-release version meant for testing only.\n' +
      '   Do not use in production. For stable releases: npm install -g verdaccio\n'
  );
}

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
  binaryVersion: pkgVersion,
});

cli.register(InfoCommand);
cli.register(InitCommand);
cli.register(VersionCommand);
cli.runExit(args, Cli.defaultContext);
