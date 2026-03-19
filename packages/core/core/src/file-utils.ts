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
    // Prevent absolute paths (should not start from '/')
    if (path.isAbsolute(decoded)) {
      return null;
    }

    // Resolve against the base directory without requiring the target to exist.
    const baseResolved = path.resolve(basePath);
    const reqResolved = path.resolve(baseResolved, decoded);

    // Normalize for Windows case-insensitive filesystem comparisons.
    const baseComparable = process.platform === 'win32' ? baseResolved.toLowerCase() : baseResolved;
    const reqComparable = process.platform === 'win32' ? reqResolved.toLowerCase() : reqResolved;

    // Ensure the resolved path is within basePath (subdirectory or exactly the base).
    if (reqComparable !== baseComparable && !reqComparable.startsWith(baseComparable + path.sep)) {
      return null;
    }

    return reqResolved;
  } catch {
    // error resolving path (e.g., path does not exist or permission denied)
    return null;
  }
}

/**
 * Sanitize a user-provided path while preserving directory separators.
 *
 * The web middleware uses this for `/-/assets/{*all}` which may include
 * subfolders (e.g. `logos/verdaccio.svg`). We sanitize each path segment
 * independently so `/` remains a real directory boundary.
 *
 * @param filename The user-provided filename/path to sanitize.
 * @returns The sanitized filename/path.
 */
export function sanitizeFilename(filename: string): string {
  // normalize windows path separator so the result is stable across platforms
  const normalized = filename.replace(/\\/g, '/');
  const segments = normalized.split('/').map((segment) => {
    // Keep traversal markers intact so `resolveSafePath()` can correctly
    // reject paths escaping the base directory.
    if (segment === '.' || segment === '..') {
      return segment;
    }
    return sanitize(segment);
  });
  return segments.join('/');
}
