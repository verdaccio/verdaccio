import { Command } from 'clipanion';
import fs from 'node:fs/promises';
import path from 'node:path';

import type { searchUtils } from '@verdaccio/core';

import { StorageBaseCommand } from './base';
import { loadStorageContext } from './context';
import { formatBytes } from './format';
import { isFilesystemBackend, resolveStorageRoot } from './storage-copy';

const STAGE_NAMESPACE = '.stage';

interface DirUsage {
  bytes: number;
  tarballs: number;
}

export class StorageStatsCommand extends StorageBaseCommand {
  public static paths = [[`storage`, `stats`]];

  static usage = Command.Usage({
    category: `Storage`,
    description: `report package counts and disk usage of the storage (experimental)`,
    examples: [[`Show storage stats`, `verdaccio-admin storage stats`]],
  });

  public async execute(): Promise<number> {
    this.warnExperimental();
    const { config, storage } = await loadStorageContext(this.configPath);
    const plugin = storage.localStorage.getStoragePlugin();
    const search = plugin.search?.bind(plugin);
    if (typeof search !== 'function') {
      this.context.stderr.write(`the configured storage plugin does not support stats\n`);
      return 1;
    }
    const items: searchUtils.SearchItem[] = await search({ text: '' } as searchUtils.SearchQuery);
    // probe with any name when the registry is empty — the guard must still apply
    if (!isFilesystemBackend(plugin, items[0]?.package.name ?? 'verdaccio-probe')) {
      this.context.stderr.write(
        `storage stats requires the filesystem storage backend; the configured storage plugin is not filesystem-based\n`
      );
      return 1;
    }

    let privateCount = 0;
    let cachedCount = 0;
    let privateBytes = 0;
    let cachedBytes = 0;
    let tarballs = 0;
    for (const item of items) {
      const handler = plugin.getPackageStorage(item.package.name) as { path?: string };
      if (typeof handler.path !== 'string') {
        continue;
      }
      const usage = await dirUsage(handler.path);
      tarballs += usage.tarballs;
      if (item.verdaccioPrivate) {
        privateCount++;
        privateBytes += usage.bytes;
      } else {
        cachedCount++;
        cachedBytes += usage.bytes;
      }
    }

    // the .stage namespace is hidden from search, so scan it separately
    const root = resolveStorageRoot(config);
    const staged = root ? await stagedUsage(root) : { items: 0, bytes: 0, tarballs: 0 };
    tarballs += staged.tarballs;

    const totalCount = privateCount + cachedCount + staged.items;
    const totalBytes = privateBytes + cachedBytes + staged.bytes;
    const rows: string[][] = [
      ['Private', String(privateCount), formatBytes(privateBytes)],
      ['Cached', String(cachedCount), formatBytes(cachedBytes)],
      ['Staged', String(staged.items), formatBytes(staged.bytes)],
      ['Total', String(totalCount), formatBytes(totalBytes)],
    ];
    const table = renderTable(['Category', 'Items', 'Size'], rows, ['l', 'r', 'r'], true);
    this.context.stdout.write(`${table}\n${tarballs} tarballs on disk\n`);
    return 0;
  }
}

/** Count staged items (one folder each) and their disk usage under `<root>/.stage`. */
async function stagedUsage(
  root: string
): Promise<{ items: number; bytes: number; tarballs: number }> {
  const stageDir = path.join(root, STAGE_NAMESPACE);
  let entries;
  try {
    entries = await fs.readdir(stageDir, { withFileTypes: true });
  } catch {
    return { items: 0, bytes: 0, tarballs: 0 };
  }
  let items = 0;
  let bytes = 0;
  let tarballs = 0;
  for (const entry of entries) {
    const full = path.join(stageDir, entry.name);
    if (entry.isDirectory()) {
      items++;
      const usage = await dirUsage(full);
      bytes += usage.bytes;
      tarballs += usage.tarballs;
    } else {
      try {
        bytes += (await fs.stat(full)).size;
      } catch {
        // the stage index file vanished between readdir and stat
      }
    }
  }
  return { items, bytes, tarballs };
}

type Align = 'l' | 'r';

/** Render an aligned box table; `ruleBeforeLast` draws a divider above the last row. */
function renderTable(
  headers: string[],
  rows: string[][],
  aligns: Align[],
  ruleBeforeLast = false
): string {
  const widths = headers.map((header, i) =>
    Math.max(header.length, ...rows.map((row) => row[i].length))
  );
  const pad = (text: string, width: number, align: Align): string =>
    align === 'r' ? text.padStart(width) : text.padEnd(width);
  const rule = (left: string, mid: string, right: string): string =>
    left + widths.map((width) => '─'.repeat(width + 2)).join(mid) + right;
  const line = (cells: string[]): string =>
    '│ ' + cells.map((cell, i) => pad(cell, widths[i], aligns[i])).join(' │ ') + ' │';

  const out = [rule('┌', '┬', '┐'), line(headers), rule('├', '┼', '┤')];
  rows.forEach((row, i) => {
    if (ruleBeforeLast && i === rows.length - 1) {
      out.push(rule('├', '┼', '┤'));
    }
    out.push(line(row));
  });
  out.push(rule('└', '┴', '┘'));
  return out.join('\n');
}

/** Recursively sum file sizes and count `.tgz` tarballs under a package folder. */
async function dirUsage(dir: string): Promise<DirUsage> {
  let bytes = 0;
  let tarballs = 0;
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return { bytes, tarballs };
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const sub = await dirUsage(full);
      bytes += sub.bytes;
      tarballs += sub.tarballs;
    } else {
      try {
        const stat = await fs.stat(full);
        bytes += stat.size;
        if (entry.name.endsWith('.tgz')) {
          tarballs++;
        }
      } catch {
        // file vanished between readdir and stat
      }
    }
  }
  return { bytes, tarballs };
}
