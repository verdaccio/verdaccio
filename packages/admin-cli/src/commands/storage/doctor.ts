import { Command, Option } from 'clipanion';
import fs from 'node:fs/promises';
import path from 'node:path';

import type { searchUtils } from '@verdaccio/core';
import type { Manifest } from '@verdaccio/types';

// a temp file younger than this may be an in-flight write, so it is not treated as orphaned
const TEMP_MIN_AGE_MS = 60 * 60 * 1000;

import { canAccess, canRemove, getCachedTarballNames } from './access';
import { AuthStorageCommand } from './base';
import { loadStorageContext } from './context';
import { isFilesystemBackend } from './storage-copy';
import {
  type FileProblem,
  findFileProblems,
  findMissingTarballs,
  findStaleDistfiles,
  getUplinkHosts,
} from './doctor-checks';

interface FixableProblem {
  pkg: string;
  file: string;
  type: FileProblem['type'];
}

interface ReportProblem {
  pkg: string;
  detail: string;
  type: 'corrupt-manifest' | 'missing-tarball';
}

interface StaleEntry {
  pkg: string;
  file: string;
  host: string;
}

export class StorageDoctorCommand extends AuthStorageCommand {
  public static paths = [[`storage`, `doctor`]];

  static usage = Command.Usage({
    category: `Storage`,
    description: `detect and repair storage inconsistencies (experimental)`,
    examples: [
      [`Report problems without changing anything`, `verdaccio-admin storage doctor`],
      [
        `Repair the fixable problems (asks for confirmation)`,
        `verdaccio-admin storage doctor --fix`,
      ],
    ],
  });

  public fix = Option.Boolean(`--fix`, false, {
    description: `remove the fixable problems (asks for confirmation)`,
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
      this.context.stderr.write(`the configured storage plugin does not support scanning\n`);
      return 1;
    }
    const items: searchUtils.SearchItem[] = await search({ text: '' } as searchUtils.SearchQuery);
    if (items.length > 0 && !isFilesystemBackend(plugin, items[0].package.name)) {
      this.context.stderr.write(
        `storage doctor requires the filesystem storage backend; the configured storage plugin is not filesystem-based\n`
      );
      return 1;
    }
    const uplinkHosts = getUplinkHosts(config.uplinks);

    const fixable: FixableProblem[] = [];
    const reportOnly: ReportProblem[] = [];
    const stale: StaleEntry[] = [];
    for (const item of items) {
      const name = item.package.name;
      if (!(await canAccess(auth, user, name))) {
        continue;
      }
      const handler = plugin.getPackageStorage(name) as unknown as { path?: string };
      if (typeof handler.path !== 'string') {
        continue;
      }
      let files: string[];
      try {
        files = await fs.readdir(handler.path);
      } catch {
        continue;
      }
      let manifest: Manifest;
      try {
        manifest = await storage.getPackageLocalMetadata(name);
      } catch {
        reportOnly.push({ pkg: name, detail: `package.json`, type: `corrupt-manifest` });
        continue;
      }
      const referenced = getCachedTarballNames(manifest);
      for (const problem of findFileProblems(files, referenced)) {
        // skip temp files young enough to be an active write
        if (problem.type === `temp-file`) {
          try {
            const stat = await fs.stat(path.join(handler.path, problem.file));
            if (Date.now() - stat.mtimeMs < TEMP_MIN_AGE_MS) {
              continue;
            }
          } catch {
            continue;
          }
        }
        fixable.push({ pkg: name, file: problem.file, type: problem.type });
      }
      // cached packages fetch tarballs on demand, so a missing tarball is normal there;
      // it is only a problem for locally published packages (unrecoverable data loss).
      if (!item.verdaccioPkgCached) {
        for (const missing of findMissingTarballs(files, referenced)) {
          reportOnly.push({ pkg: name, detail: missing, type: `missing-tarball` });
        }
      }
      for (const entry of findStaleDistfiles(manifest._distfiles, uplinkHosts)) {
        stale.push({ pkg: name, file: entry.file, host: entry.host });
      }
    }

    const reportCount = reportOnly.length + stale.length;
    const total = fixable.length + reportCount;
    if (total === 0) {
      this.context.stdout.write(`no problems found\n`);
      return 0;
    }

    this.context.stdout.write(
      `found ${total} problem(s): ${fixable.length} fixable, ${reportCount} report-only\n\n`
    );
    for (const p of fixable) {
      this.context.stdout.write(`  ${p.type.padEnd(15)} ${p.pkg}  ${p.file}\n`);
    }
    for (const p of reportOnly) {
      this.context.stdout.write(`  ${p.type.padEnd(15)} ${p.pkg}  ${p.detail} (report only)\n`);
    }
    this.printStale(stale);

    if (!this.fix) {
      this.context.stdout.write(
        `\nrun with --fix to remove the ${fixable.length} fixable problem(s)\n`
      );
      return 0;
    }

    const removable: FixableProblem[] = [];
    const denied = new Set<string>();
    for (const problem of fixable) {
      if (await canRemove(auth, user, problem.pkg)) {
        removable.push(problem);
      } else if (!denied.has(problem.pkg)) {
        denied.add(problem.pkg);
        this.context.stdout.write(`skip ${problem.pkg}: no unpublish permission\n`);
      }
    }

    if (removable.length === 0) {
      this.context.stdout.write(`nothing to fix\n`);
      return 0;
    }

    this.context.stderr.write(`run this with the server stopped to avoid deleting active writes\n`);
    if (!(await this.confirm(`\nRemove ${removable.length} file(s)? (y/N) `))) {
      this.context.stdout.write(`aborted, no changes made\n`);
      return 0;
    }

    let removed = 0;
    for (const problem of removable) {
      try {
        await plugin.getPackageStorage(problem.pkg).deletePackage(problem.file);
        this.context.stdout.write(`removed ${problem.pkg}  ${problem.file}\n`);
        removed++;
      } catch (err: any) {
        this.context.stderr.write(
          `failed to remove ${problem.pkg} ${problem.file}: ${err.message}\n`
        );
      }
    }
    this.context.stdout.write(`\nfixed ${removed}/${removable.length} problem(s)\n`);
    return removed === removable.length ? 0 : 1;
  }

  /** Print stale `_distfiles` grouped by package + host, with a short explanation. */
  private printStale(stale: StaleEntry[]): void {
    if (stale.length === 0) {
      return;
    }
    const groups = new Map<string, { pkg: string; host: string; count: number; example: string }>();
    for (const entry of stale) {
      const key = `${entry.pkg}|${entry.host}`;
      const group = groups.get(key);
      if (group) {
        group.count++;
      } else {
        groups.set(key, { pkg: entry.pkg, host: entry.host, count: 1, example: entry.file });
      }
    }
    for (const group of groups.values()) {
      this.context.stdout.write(
        `  stale-distfile  ${group.pkg}: ${group.count} tarball(s) recorded from "${group.host}", ` +
          `which is not a configured uplink (e.g. ${group.example}) (report only)\n`
      );
    }
    this.context.stdout.write(
      `\nstale-distfile explained: verdaccio remembers, per cached tarball, the uplink url it\n` +
        `was fetched from (the package's _distfiles). When that host is no longer one of your\n` +
        `configured uplinks, a lost tarball could not be re-fetched (the self-heal would point at\n` +
        `a registry you no longer proxy). Reported only — clearing it means rewriting the packument.\n`
    );
  }
}
