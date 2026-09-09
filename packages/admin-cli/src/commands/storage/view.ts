import { Command } from 'clipanion';
import fs from 'node:fs/promises';
import path from 'node:path';
import readlinePromises from 'node:readline/promises';

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
import { findStaleDistfiles, getUplinkHosts } from './doctor-checks';
import { formatBytes } from './format';
import { PAGE_SIZE, clampPage, filterByName, parseViewCommand } from './view-helpers';

interface ViewEntry {
  name: string;
  versions: number;
  uplinks: string;
  tarballs: string[];
}

export class StorageViewCommand extends AuthStorageCommand {
  public static paths = [[`storage`, `view`]];

  static usage = Command.Usage({
    category: `Storage`,
    description: `browse the storage cache and remove entries manually (experimental)`,
    examples: [[`Open the interactive storage browser`, `verdaccio-admin storage view`]],
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
      this.context.stderr.write(`the configured storage plugin does not support browsing\n`);
      return 1;
    }
    const items: searchUtils.SearchItem[] = await search({ text: '' } as searchUtils.SearchQuery);
    const uplinkHosts = getUplinkHosts(config.uplinks);

    let entries: ViewEntry[] = [];
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
      if (!isCachedPackage(manifest) || !(await canAccess(auth, user, name))) {
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

    const rl = readlinePromises.createInterface({
      input: this.context.stdin,
      output: this.context.stdout,
    });

    let page = 0;
    let filter = ``;
    try {
      for (;;) {
        const filtered = filterByName(entries, filter);
        page = clampPage(page, filtered.length);
        this.printPage(filtered, page, filter);

        let line: string;
        try {
          line = await rl.question(`> `);
        } catch {
          break; // stdin closed (EOF)
        }
        const cmd = parseViewCommand(line);

        if (cmd.kind === `quit`) {
          break;
        } else if (cmd.kind === `next`) {
          page++;
        } else if (cmd.kind === `prev`) {
          page--;
        } else if (cmd.kind === `filter`) {
          filter = cmd.term ?? ``;
          page = 0;
        } else if (cmd.kind === `clear-filter`) {
          filter = ``;
          page = 0;
        } else if (cmd.kind === `help`) {
          this.printHelp();
        } else if (cmd.kind === `view`) {
          const entry = filtered[(cmd.index ?? 0) - 1];
          if (entry) {
            await this.printDetail(plugin, storage, entry, uplinkHosts);
          } else {
            this.context.stdout.write(`no entry ${cmd.index}\n`);
          }
        } else if (cmd.kind === `delete`) {
          const entry = filtered[(cmd.index ?? 0) - 1];
          if (!entry) {
            this.context.stdout.write(`no entry ${cmd.index}\n`);
          } else if (await this.deleteEntry(rl, plugin, auth, user, entry)) {
            entries = entries.filter((e) => e.name !== entry.name);
          }
        } else if (cmd.kind === `unknown`) {
          this.context.stdout.write(`unknown command; type h for help\n`);
        }
      }
    } finally {
      rl.close();
    }
    return 0;
  }

  private printPage(entries: ViewEntry[], page: number, filter: string): void {
    const from = page * PAGE_SIZE;
    const slice = entries.slice(from, from + PAGE_SIZE);
    const label = filter ? ` [filter: "${filter}"]` : ``;
    this.context.stdout.write(
      `\ncached packages${label} (${entries.length === 0 ? 0 : from + 1}-${from + slice.length} of ${entries.length}):\n`
    );
    const width = Math.max(7, ...slice.map((e) => e.name.length));
    slice.forEach((entry, i) => {
      const index = String(from + i + 1).padStart(4);
      this.context.stdout.write(
        `${index}  ${entry.name.padEnd(width)}  ${String(entry.versions).padEnd(5)} versions  ${entry.uplinks}\n`
      );
    });
    this.context.stdout.write(
      `commands: <n> details · d <n> delete · n/p next/prev · /text filter · h help · q quit\n`
    );
  }

  private printHelp(): void {
    this.context.stdout.write(
      `\n  <n>       show details for entry n\n` +
        `  d <n>     delete entry n (needs unpublish permission, asks to confirm)\n` +
        `  n / p     next / previous page\n` +
        `  /text     filter by name (/ alone clears the filter)\n` +
        `  h         this help\n` +
        `  q         quit\n`
    );
  }

  private async printDetail(
    plugin: any,
    storage: { getPackageLocalMetadata(name: string): Promise<Manifest> },
    entry: ViewEntry,
    uplinkHosts: Set<string>
  ): Promise<void> {
    let manifest: Manifest | undefined;
    try {
      manifest = await storage.getPackageLocalMetadata(entry.name);
    } catch {
      manifest = undefined;
    }
    const handler = plugin.getPackageStorage(entry.name) as { path?: string };
    let onDisk = 0;
    let bytes = 0;
    const dir = typeof handler.path === 'string' ? handler.path : undefined;
    if (dir) {
      for (const file of entry.tarballs) {
        try {
          const stat = await fs.stat(path.join(dir, file));
          onDisk++;
          bytes += stat.size;
        } catch {
          // tarball not cached on disk yet (fetched on demand)
        }
      }
    }
    const stale = manifest ? findStaleDistfiles(manifest._distfiles, uplinkHosts) : [];
    this.context.stdout.write(`\n${entry.name}\n`);
    this.context.stdout.write(`  versions:  ${entry.versions}\n`);
    this.context.stdout.write(`  uplinks:   ${entry.uplinks || '(none)'}\n`);
    this.context.stdout.write(
      dir
        ? `  tarballs:  ${entry.tarballs.length} referenced, ${onDisk} cached on disk (${formatBytes(bytes)})\n`
        : `  tarballs:  ${entry.tarballs.length} referenced (disk usage unavailable on this backend)\n`
    );
    if (stale.length > 0) {
      const hosts = [...new Set(stale.map((s) => s.host))].join(', ');
      this.context.stdout.write(`  warning:   ${stale.length} stale distfile(s) from ${hosts}\n`);
    }
  }

  private async deleteEntry(
    rl: readlinePromises.Interface,
    plugin: any,
    auth: any,
    user: any,
    entry: ViewEntry
  ): Promise<boolean> {
    if (!(await canRemove(auth, user, entry.name))) {
      this.context.stdout.write(`cannot delete ${entry.name}: no unpublish permission\n`);
      return false;
    }
    // reuse the browser's readline; opening a second one on the same stdin would conflict
    const answer = this.yes ? `y` : await rl.question(`Delete ${entry.name}? (y/N) `);
    if (!/^y(es)?$/i.test(answer.trim())) {
      this.context.stdout.write(`aborted\n`);
      return false;
    }
    try {
      await removeCachedPackage(plugin, entry.name, entry.tarballs);
      this.context.stdout.write(`removed ${entry.name}\n`);
      return true;
    } catch (err: any) {
      this.context.stderr.write(`failed to remove ${entry.name}: ${err.message}\n`);
      return false;
    }
  }
}
