import { Command, Option } from 'clipanion';
import fs from 'node:fs/promises';
import path from 'node:path';

import { StorageBaseCommand } from './base';
import { loadStorageContext } from './context';
import { emptyDirProblem, exists, isDefaultLocalStorage, resolveStorageRoot } from './storage-copy';

export class StorageBackupCommand extends StorageBaseCommand {
  public static paths = [[`storage`, `backup`]];

  static usage = Command.Usage({
    category: `Storage`,
    description: `copy the whole storage to a fresh backup location (experimental)`,
    examples: [
      [`Back up the storage`, `verdaccio-admin storage backup /backups/verdaccio-2026-09-06`],
    ],
  });

  public location = Option.String({ required: true, name: `location` });

  public async execute(): Promise<number> {
    this.warnExperimental();
    const { config } = await loadStorageContext(this.configPath);
    if (!isDefaultLocalStorage(config)) {
      this.context.stderr.write(
        `storage backup requires the default filesystem storage; a storage plugin is configured\n`
      );
      return 1;
    }
    const sourceRoot = resolveStorageRoot(config);
    if (sourceRoot === null || !(await exists(sourceRoot))) {
      this.context.stdout.write(`nothing to back up\n`);
      return 0;
    }

    const destRoot = path.resolve(this.location);
    if (sourceRoot === destRoot) {
      this.context.stderr.write(`backup location is the storage itself\n`);
      return 1;
    }
    // a backup must land in a clean location so it is a faithful, complete snapshot
    const problem = await emptyDirProblem(destRoot);
    if (problem !== null) {
      this.context.stderr.write(`backup location is ${problem}: ${destRoot}\n`);
      return 1;
    }

    this.context.stdout.write(`back up the storage\n  from ${sourceRoot}\n  to   ${destRoot}\n`);
    this.context.stderr.write(`run this with the server stopped for a consistent snapshot\n`);
    if (!(await this.confirm(`\nProceed? (y/N) `))) {
      this.context.stdout.write(`aborted, no changes made\n`);
      return 0;
    }

    try {
      // copy the whole storage tree: packages, the private db, token store and .stage
      await fs.cp(sourceRoot, destRoot, { recursive: true });
    } catch (err: any) {
      this.context.stderr.write(`backup failed: ${err.message}\n`);
      return 1;
    }

    this.context.stdout.write(`\nbacked up the storage to ${destRoot}\n`);
    return 0;
  }
}
