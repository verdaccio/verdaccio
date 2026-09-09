import { Command, Option } from 'clipanion';

import type { searchUtils } from '@verdaccio/core';
import type { Manifest } from '@verdaccio/types';

import {
  canAccess,
  canRemove,
  getCachedTarballNames,
  isCachedPackage,
  removeCachedPackage,
} from './access';
import { AuthStorageCommand } from './base';
import { loadStorageContext } from './context';

interface CachedEntry {
  name: string;
  versions: number;
  uplinks: string;
  tarballs: string[];
}

export class StorageCacheCommand extends AuthStorageCommand {
  public static paths = [[`storage`, `cache`]];

  static usage = Command.Usage({
    category: `Storage`,
    description: `inspect or clean the uplink cache (experimental)`,
    examples: [
      [`List cached uplink packages you can access`, `verdaccio-admin storage cache`],
      [`Clean the cache (asks for confirmation)`, `verdaccio-admin storage cache --clean`],
      [`Preview only, never delete`, `verdaccio-admin storage cache --clean --dry-run`],
      [`Clean without the prompt (scripts)`, `verdaccio-admin storage cache --clean --yes`],
    ],
  });

  public clean = Option.Boolean(`--clean`, false, {
    description: `remove cached packages you can unpublish (asks for confirmation)`,
  });

  public dryRun = Option.Boolean(`--dry-run`, false, {
    description: `preview what would be removed without deleting`,
  });

  public async execute(): Promise<number> {
    this.warnExperimental();
    const { config, storage, auth } = await loadStorageContext(this.configPath);
    let user;
    try {
      user = await this.resolveOperator(config, auth);
    } catch (err: any) {
      this.context.stderr.write(`${err.message}\n`);
      return 1;
    }

    const plugin = storage.localStorage.getStoragePlugin();
    const search = plugin.search?.bind(plugin);
    if (typeof search !== 'function') {
      this.context.stderr.write(`the configured storage plugin does not support listing\n`);
      return 1;
    }

    // walk the storage on disk; cached (proxied) packages are not in the private db list
    const items: searchUtils.SearchItem[] = await search({
      text: '',
    } as searchUtils.SearchQuery);

    const entries: CachedEntry[] = [];
    for (const item of items) {
      if (!item.verdaccioPkgCached) {
        continue;
      }
      const name = item.package.name;
      let manifest: Manifest;
      try {
        manifest = await storage.getPackageLocalMetadata(name);
      } catch {
        continue;
      }
      if (!isCachedPackage(manifest)) {
        continue;
      }
      if (!(await canAccess(auth, user, name))) {
        continue;
      }
      entries.push({
        name,
        versions: Object.keys(manifest.versions ?? {}).length,
        uplinks: Object.keys(manifest._uplinks ?? {}).join(', '),
        tarballs: getCachedTarballNames(manifest),
      });
    }

    if (entries.length === 0) {
      this.context.stdout.write(`no cached packages found\n`);
      return 0;
    }

    if (!this.clean) {
      this.printTable(entries);
      return 0;
    }

    const removable: CachedEntry[] = [];
    for (const entry of entries) {
      if (await canRemove(auth, user, entry.name)) {
        removable.push(entry);
      } else {
        this.context.stdout.write(`skip ${entry.name}: no unpublish permission\n`);
      }
    }

    if (removable.length === 0) {
      this.context.stdout.write(`nothing to clean\n`);
      return 0;
    }

    this.context.stdout.write(
      `the following ${removable.length} cached package(s) will be removed:\n`
    );
    this.printTable(removable);

    if (this.dryRun) {
      this.context.stdout.write(`\ndry-run: no changes made\n`);
      return 0;
    }

    if (!(await this.confirm(`Remove ${removable.length} cached package(s)? (y/N) `))) {
      this.context.stdout.write(`aborted, no changes made\n`);
      return 0;
    }

    let removed = 0;
    for (const entry of removable) {
      try {
        await removeCachedPackage(plugin, entry.name, entry.tarballs);
        this.context.stdout.write(`removed ${entry.name}\n`);
        removed++;
      } catch (err: any) {
        this.context.stderr.write(`failed to remove ${entry.name}: ${err.message}\n`);
      }
    }
    this.context.stdout.write(`\ncleaned ${removed}/${removable.length} cached package(s)\n`);
    return removed === removable.length ? 0 : 1;
  }

  private printTable(entries: CachedEntry[]): void {
    const width = Math.max(7, ...entries.map((e) => e.name.length));
    this.context.stdout.write(`${'PACKAGE'.padEnd(width)}  VERSIONS  UPLINKS\n`);
    for (const entry of entries) {
      this.context.stdout.write(
        `${entry.name.padEnd(width)}  ${String(entry.versions).padEnd(8)}  ${entry.uplinks}\n`
      );
    }
  }
}
