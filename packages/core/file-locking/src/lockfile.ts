import { lockFileWithOptions, statDir, statFile } from './utils';

/**
 * locks a file by creating a lock file
 * @param name
 * @param callback
 */
export async function lockFileNext(name: string): Promise<void> {
  //  check if dir exist
  await statDir(name);
  // check if file exist
  await statFile(name);
  // lock fhe the file
  await lockFileWithOptions(name);
}
