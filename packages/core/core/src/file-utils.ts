import { mkdir, mkdtemp } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

export const Files = {
  DatabaseName: '.verdaccio-db.json',
};

/**
 * Create a temporary folder.
 * @param prefix The prefix of the folder name.
 * @returns string
 */
export async function createTempFolder(prefix: string): Promise<string> {
  return await mkdtemp(path.join(os.tmpdir(), 'verdaccio-' + prefix + '-'));
}

/**
 * Create temporary folder for an asset.
 * @param prefix
 * @param folder name
 * @returns
 */
export async function createTempStorageFolder(prefix: string, folder = 'storage'): Promise<string> {
  const tempFolder = await createTempFolder(prefix);
  const storageFolder = path.join(tempFolder, folder);
  await mkdir(storageFolder);
  return storageFolder;
}

/**
 * Resolve a safe path within a base directory.
 * @param basePath The base directory.
 * @param requestPath The requested path.
 * @returns The resolved safe path or null if unsafe.
 */
export function resolveSafePath(basePath: string, requestPath?: string): string | null {
  try {
    if (!requestPath || requestPath === '') {
      return null;
    }
    const decoded = decodeURIComponent(requestPath);
    const resolved = path.resolve(basePath, decoded);
    const relative = path.relative(basePath, resolved);
    // if relative starts with '..' it's outside the base path
    if (relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative))) {
      return resolved;
    }
    // blocked: path outside base path
    return null;
  } catch (err) {
    // error resolving path
    return null;
  }
}
