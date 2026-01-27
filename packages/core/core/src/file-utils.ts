import { mkdir, mkdtemp } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import sanitize from 'sanitize-filename';

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
 * Resolve a safe path within a base directory, preventing directory traversal attacks.
 *
 * This function provides security against path traversal by:
 * - URL decoding the input path
 * - Resolving the full absolute path
 * - Checking that the resolved path stays within the base directory
 * - Rejecting paths containing '..' that would escape the base directory
 * - Rejecting absolute paths that bypass the base directory
 *
 * @param basePath The base directory that constrains file access
 * @param requestPath The requested path from user input (may be URL-encoded)
 * @returns The resolved safe absolute path or null if the path is unsafe/invalid
 * @security Prevents directory traversal attacks by validating resolved paths
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

/**
 * Sanitize a filename by removing or replacing unsafe characters.
 * @param filename The input filename to sanitize.
 * @returns The sanitized filename.
 */
export function sanitizeFilename(filename: string): string {
  return sanitize(filename);
}
