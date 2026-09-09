import { Cli } from 'clipanion';

import { pkgUtils, warningUtils } from '@verdaccio/core';

import { InfoCommand } from './commands/info';
import { InitCommand } from './commands/init';
import { VersionCommand } from './commands/version';
import type { CliRuntimeOptions } from './runtime';
import { configureCli } from './runtime';
import { MIN_NODE_VERSION, isVersionValid } from './utils';

/**
 * Build and run the Verdaccio CLI.
 *
 * Called with no arguments it behaves exactly like the standalone `verdaccio`
 * binary. Downstream distributions can inject a custom server factory (and
 * version/name) via {@link CliRuntimeOptions} — e.g. a registry that needs to
 * boot with a custom Storage — without re-implementing the command set.
 */
export function runCli(options: CliRuntimeOptions = {}): Promise<void> {
  configureCli(options);

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

  const version =
    options.version ??
    (pkgUtils.getPackageJson(
      typeof __dirname !== 'undefined' ? __dirname : import.meta.dirname,
      '..'
    ).version as string);

  const cli = new Cli({
    binaryLabel: `verdaccio`,
    binaryName: `${node} ${app}`,
    binaryVersion: version,
  });

  cli.register(InfoCommand);
  cli.register(InitCommand);
  cli.register(VersionCommand);

  process.on('uncaughtException', function (err) {
    console.error(
      `uncaught exception, please report (https://github.com/verdaccio/verdaccio/issues) this: \n${err.stack}`
    );
    process.exit(1);
  });

  return cli.runExit(args, Cli.defaultContext);
}
