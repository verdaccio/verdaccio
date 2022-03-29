import { mkdir, mkdtemp } from 'fs/promises';
import os from 'os';
import path from 'path';

export const Files = {
  DatabaseName: '.verdaccio-db.json',
};

/**
 * Create a temporary folder.
 * @param prefix The prefix of the folder name.
 * @returns string
 */
export async function createTempFolder(prefix: string): Promise<string> {
  return await mkdtemp(path.join(os.tmpdir(), prefix));
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
