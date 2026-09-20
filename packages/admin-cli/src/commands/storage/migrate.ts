import { Command, Option } from 'clipanion';
import fs from 'node:fs/promises';
import path from 'node:path';

import type { searchUtils } from '@verdaccio/core';

import { StorageBaseCommand } from './base';
import { loadStorageContext } from './context';
import {
  type CopyItem,
  buildCopyItems,
  copyPackage,
  copyState,
  destPathFor,
  exists,
  handlerPath,
  isDefaultLocalStorage,
  listPackagesOnDisk,
  resolveStorageRoot,
} from './storage-copy';

type Policy = 'ask' | 'overwrite-all' | 'skip-all';

interface Source {
  sourceRoot: string;
  sources: { name: string; srcDir: string }[];
}

export class StorageMigrateCommand extends StorageBaseCommand {
  public static paths = [[`storage`, `migrate`]];

  static usage = Command.Usage({
    category: `Storage`,
    description: `copy the whole storage (packages + database) to another location (experimental)`,
    examples: [
      [`Migrate the configured storage`, `verdaccio-admin storage migrate --to /new/storage`],
      [
        `Migrate from one directory to another`,
        `verdaccio-admin storage migrate --from /old/storage --to /new/storage`,
      ],
      [`Preview only`, `verdaccio-admin storage migrate --to /new/storage --dry-run`],
    ],
  });

  public from = Option.String(`--from`, {
    description: `source storage directory (default: the configured storage)`,
  });

  public to = Option.String(`--to`, {
    description: `destination storage directory`,
  });

  public overwrite = Option.Boolean(`--overwrite`, false, {
    description: `overwrite packages that already exist in the destination (no prompt)`,
  });

  public dryRun = Option.Boolean(`--dry-run`, false, {
    description: `preview what would be migrated without copying`,
  });

  public async execute(): Promise<number> {
    this.warnExperimental();
    if (!this.to) {
      this.context.stderr.write(`missing destination: pass --to <directory>\n`);
      return 1;
    }
    const destRoot = path.resolve(this.to);

    const resolved = await this.resolveSource();
    if (resolved === null) {
      return 1;
    }
    const { sourceRoot, sources } = resolved;

    if (sourceRoot === destRoot) {
      this.context.stderr.write(`source and destination are the same directory\n`);
      return 1;
    }

    const copyItems = await buildCopyItems(sources, destRoot);
    const conflicts = copyItems.filter((c) => c.exists).length;
    this.context.stdout.write(
      `migrate ${copyItems.length} package(s)\n  from ${sourceRoot}\n  to   ${destRoot}` +
        (conflicts > 0 ? `\n  ${conflicts} already exist in the destination` : ``) +
        `\n`
    );

    if (this.dryRun) {
      this.context.stdout.write(`\ndry-run: no changes made\n`);
      return 0;
    }

    // even with no packages to copy (empty source, or every conflict skipped) the
    // registry state — db, token store, staged publishes — is still migrated
    const toCopy = await this.resolveConflicts(copyItems);
    this.context.stderr.write(`run this with the server stopped to avoid copying data mid-write\n`);
    if (
      !(await this.confirm(
        `\nCopy ${toCopy.length} package(s) and the registry state to ${destRoot}? (y/N) `
      ))
    ) {
      this.context.stdout.write(`aborted, no changes made\n`);
      return 0;
    }

    await fs.mkdir(destRoot, { recursive: true });
    let copied = 0;
    for (const item of toCopy) {
      try {
        await copyPackage(item.srcDir, item.destDir);
        copied++;
      } catch (err: any) {
        this.context.stderr.write(`failed to copy ${item.name}: ${err.message}\n`);
      }
    }

    const state = await copyState(sourceRoot, destRoot);
    if (state.copied.length > 0) {
      this.context.stdout.write(`copied registry state: ${state.copied.join(', ')}\n`);
    }
    if (state.preserved.length > 0) {
      this.context.stderr.write(
        `kept the destination's existing ${state.preserved.join(', ')} (not merged); ` +
          `copied private packages may need to be registered there manually\n`
      );
    }

    this.context.stdout.write(`\nmigrated ${copied}/${toCopy.length} package(s)\n`);
    return copied === toCopy.length ? 0 : 1;
  }

  /** Resolve the source root and the authoritative per-package source directories. */
  private async resolveSource(): Promise<Source | null> {
    if (this.from) {
      const sourceRoot = path.resolve(this.from);
      if (!(await exists(sourceRoot))) {
        this.context.stderr.write(`source directory does not exist: ${sourceRoot}\n`);
        return null;
      }
      const names = await listPackagesOnDisk(sourceRoot);
      return {
        sourceRoot,
        sources: names.map((name) => ({ name, srcDir: destPathFor(sourceRoot, name) })),
      };
    }

    const { config, storage } = await loadStorageContext(this.configPath);
    if (!isDefaultLocalStorage(config)) {
      this.context.stderr.write(
        `migrating the configured storage requires the default filesystem storage; ` +
          `use --from <dir> to copy a directory\n`
      );
      return null;
    }
    const sourceRoot = resolveStorageRoot(config);
    if (sourceRoot === null) {
      this.context.stderr.write(`could not resolve the configured storage directory\n`);
      return null;
    }
    const plugin = storage.localStorage.getStoragePlugin();
    const search = plugin.search?.bind(plugin);
    if (typeof search !== 'function') {
      this.context.stderr.write(`the configured storage plugin does not support migration\n`);
      return null;
    }
    const items: searchUtils.SearchItem[] = await search({ text: '' } as searchUtils.SearchQuery);
    const sources: { name: string; srcDir: string }[] = [];
    for (const item of items) {
      // authoritative source path per package (honours per-package `storage` overrides)
      const srcDir = handlerPath(plugin, item.package.name);
      if (srcDir !== undefined) {
        sources.push({ name: item.package.name, srcDir });
      }
    }
    return { sourceRoot, sources };
  }

  /** Decide, per conflicting package, whether to overwrite — interactively, with all/none shortcuts. */
  private async resolveConflicts(items: CopyItem[]): Promise<CopyItem[]> {
    const toCopy: CopyItem[] = [];
    let policy: Policy = this.overwrite ? 'overwrite-all' : 'ask';
    for (const item of items) {
      if (!item.exists) {
        toCopy.push(item);
        continue;
      }
      if (policy === 'overwrite-all') {
        toCopy.push(item);
        continue;
      }
      if (policy === 'skip-all') {
        continue;
      }
      const answer = await this.ask(
        `"${item.name}" exists in destination — [o]verwrite / [s]kip / [a]ll / ` +
          `skip a[l]l? (o/s/a/l) [s]: `,
        `conflicting packages are skipped; pass --overwrite to replace them`
      );
      if (answer === null) {
        policy = 'skip-all';
        continue;
      }
      const choice = answer.toLowerCase();
      if (choice === 'o') {
        toCopy.push(item);
      } else if (choice === 'a') {
        policy = 'overwrite-all';
        toCopy.push(item);
      } else if (choice === 'l') {
        policy = 'skip-all';
      }
      // '', 's' or anything else: skip just this one (the prompt's [s] default)
    }
    return toCopy;
  }
}
