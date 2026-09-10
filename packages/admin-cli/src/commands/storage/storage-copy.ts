import fs from 'node:fs/promises';
import path from 'node:path';

export const DB_FILE = '.verdaccio-db.json';
export const TOKEN_FILE = '.token-db.json';
export const STAGE_DIR = '.stage';
const PACKAGE_FILE = 'package.json';

interface CachePlugin {
  getPackageStorage(name: string): unknown;
}

/** Config fields needed to locate the storage root and its internal state files. */
export interface StorageConfig {
  storage?: string | void;
  configPath?: string;
  store?: unknown;
}

export function handlerPath(plugin: CachePlugin, name: string): string | undefined {
  const handler = plugin.getPackageStorage(name) as { path?: string } | undefined;
  return typeof handler?.path === 'string' ? handler.path : undefined;
}

export interface CopyItem {
  name: string;
  srcDir: string;
  destDir: string;
  exists: boolean;
}

/** Absolute directory for a package inside a storage root (`@scope` kept as a segment). */
export function destPathFor(root: string, name: string): string {
  return path.join(root, ...name.split('/'));
}

export async function exists(target: string): Promise<boolean> {
  try {
    await fs.access(target);
    return true;
  } catch {
    return false;
  }
}

/** Whether the storage plugin is filesystem-based (exposes a package folder path). */
export function isFilesystemBackend(plugin: CachePlugin, sampleName: string): boolean {
  return handlerPath(plugin, sampleName) !== undefined;
}

/** True when no storage plugin is configured, i.e. the built-in local (filesystem) storage. */
export function isDefaultLocalStorage(config: StorageConfig): boolean {
  return !config.store || Object.keys(config.store).length === 0;
}

/**
 * Resolve the storage root the same way the local-storage plugin does
 * (`path.resolve(dirname(configPath), config.storage)`), so the internal state
 * files (`.verdaccio-db.json`, `.token-db.json`, `.stage`) are found reliably.
 */
export function resolveStorageRoot(config: StorageConfig): string | null {
  const storage = config.storage;
  if (typeof storage !== 'string' || storage.length === 0) {
    return null;
  }
  return path.resolve(path.dirname(config.configPath || ''), storage);
}

/** Walk a storage root on disk and return every package name (handles `@scope`). */
export async function listPackagesOnDisk(root: string): Promise<string[]> {
  const names: string[] = [];
  let entries;
  try {
    entries = await fs.readdir(root, { withFileTypes: true });
  } catch {
    return names;
  }
  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }
    if (entry.name.startsWith('@')) {
      const scopeDir = path.join(root, entry.name);
      let subs;
      try {
        subs = await fs.readdir(scopeDir, { withFileTypes: true });
      } catch {
        continue;
      }
      for (const sub of subs) {
        if (sub.isDirectory() && (await exists(path.join(scopeDir, sub.name, PACKAGE_FILE)))) {
          names.push(`${entry.name}/${sub.name}`);
        }
      }
    } else if (await exists(path.join(root, entry.name, PACKAGE_FILE))) {
      names.push(entry.name);
    }
  }
  return names;
}

/** Build the per-package copy plan from authoritative source directories. */
export async function buildCopyItems(
  sources: { name: string; srcDir: string }[],
  destRoot: string
): Promise<CopyItem[]> {
  const out: CopyItem[] = [];
  for (const { name, srcDir } of sources) {
    const destDir = destPathFor(destRoot, name);
    out.push({ name, srcDir, destDir, exists: await exists(destDir) });
  }
  return out;
}

/** True when both paths resolve to the same real location (symlinks included). */
async function samePath(a: string, b: string): Promise<boolean> {
  const realA = await fs.realpath(a).catch(() => path.resolve(a));
  const realB = await fs.realpath(b).catch(() => path.resolve(b));
  return realA === realB;
}

/**
 * Recursively copy one package folder; an existing destination is replaced, not
 * merged. The copy lands in a temp sibling first and is swapped in only once it
 * is complete, so a failed copy never destroys the existing destination package.
 */
export async function copyPackage(srcDir: string, destDir: string): Promise<void> {
  // per-package storage overrides could point the source at the destination
  if (await samePath(srcDir, destDir)) {
    throw new Error(`source and destination are the same directory: ${srcDir}`);
  }
  if (!(await exists(destDir))) {
    await fs.cp(srcDir, destDir, { recursive: true });
    return;
  }
  const tmpDir = `${destDir}.migrate-tmp`;
  const oldDir = `${destDir}.migrate-old`;
  await fs.rm(tmpDir, { recursive: true, force: true });
  await fs.cp(srcDir, tmpDir, { recursive: true });
  await fs.rm(oldDir, { recursive: true, force: true });
  await fs.rename(destDir, oldDir);
  try {
    await fs.rename(tmpDir, destDir);
  } catch (err) {
    await fs.rename(oldDir, destDir); // restore the original package
    throw err;
  }
  await fs.rm(oldDir, { recursive: true, force: true });
}

/**
 * Why the target cannot be used as a fresh (empty) destination — `not a directory`
 * or `not empty` — or null when it is usable (missing or an empty directory).
 */
export async function emptyDirProblem(target: string): Promise<string | null> {
  let stat;
  try {
    stat = await fs.lstat(target);
  } catch {
    return null;
  }
  if (!stat.isDirectory()) {
    return `not a directory`;
  }
  return (await fs.readdir(target)).length > 0 ? `not empty` : null;
}

export interface StateResult {
  copied: string[];
  preserved: string[];
}

/**
 * Copy the registry's internal state (private db, token store, staged publishes) from the
 * source storage root to the destination. Each entry is copied only when it is **absent**
 * in the destination — an existing destination db/secret/token store is preserved, never
 * overwritten, so a merge does not corrupt the destination's index or invalidate its
 * tokens.
 */
export async function copyState(sourceRoot: string, destRoot: string): Promise<StateResult> {
  const copied: string[] = [];
  const preserved: string[] = [];
  for (const name of [DB_FILE, TOKEN_FILE, STAGE_DIR]) {
    const src = path.join(sourceRoot, name);
    if (!(await exists(src))) {
      continue;
    }
    const dest = path.join(destRoot, name);
    if (await exists(dest)) {
      preserved.push(name);
      continue;
    }
    await fs.cp(src, dest, { recursive: true });
    copied.push(name);
  }
  return { copied, preserved };
}
