import { Builtins, Cli } from 'clipanion';

import { pkgUtils } from '@verdaccio/core';

import { StorageBackupCommand } from './commands/storage/backup';
import { StorageCacheCommand } from './commands/storage/cache';
import { StorageDoctorCommand } from './commands/storage/doctor';
import { StorageMigrateCommand } from './commands/storage/migrate';
import { StorageStatsCommand } from './commands/storage/stats';
import { StorageViewCommand } from './commands/storage/view';

/**
 * Build and run the Verdaccio admin CLI (`verdaccio-admin`), the home of the
 * operator-facing maintenance commands — currently the experimental `storage`
 * group. It is separate from the `verdaccio` binary, which only runs the server.
 */
export function runAdminCli(): Promise<void> {
  const [node, app, ...args] = process.argv;

  const version = pkgUtils.getPackageJson(
    typeof __dirname !== 'undefined' ? __dirname : import.meta.dirname,
    '..'
  ).version as string;

  const cli = new Cli({
    binaryLabel: `verdaccio-admin`,
    binaryName: `${node} ${app}`,
    binaryVersion: version,
  });

  cli.register(StorageCacheCommand);
  cli.register(StorageViewCommand);
  cli.register(StorageDoctorCommand);
  cli.register(StorageMigrateCommand);
  cli.register(StorageBackupCommand);
  cli.register(StorageStatsCommand);
  cli.register(Builtins.HelpCommand);
  cli.register(Builtins.VersionCommand);

  process.on('uncaughtException', function (err) {
    console.error(
      `uncaught exception, please report (https://github.com/verdaccio/verdaccio/issues) this: \n${err.stack}`
    );
    process.exit(1);
  });

  return cli.runExit(args, Cli.defaultContext);
}
