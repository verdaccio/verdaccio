import buildDebug from 'debug';
import globby from 'globby';
import { join } from 'path';

import { searchUtils, validatioUtils } from '@verdaccio/core';

const debug = buildDebug('verdaccio:plugin:local-storage:utils');

/**
 * Retrieve a list of absolute paths to all folders in the given storage path
 * @param storagePath the base path of the storage
 * @return a promise that resolves to an array of absolute paths
 */
export async function getFolders(storagePath: string, pattern = '*'): Promise<string[]> {
  // @ts-ignore - check why this fails, types are correct
  const files = await globby(pattern, {
    // @ts-ignore
    cwd: storagePath,
    expandDirectories: true,
    onlyDirectories: true,
    onlyFiles: false,
    // should not go deeper than the storage path (10 is reseaon for the storage))
    deep: 10,
    dot: false,
    followSymbolicLinks: true,
    caseSensitiveMatch: true,
    unique: true,
    // FIXME: add here list of forbiden patterns
    // don't include scoped folders.
    // ignore: [`@*`],
  });
  return files;
}

/**
 * Search packages on the the storage. The storage could be
 * - storage
 *    - pkg1
 *    - @company
 *      - pkg2 -> @scompany/pkg2
 *    - storage1
 *      - pkg2
 *      - pkg3
 *    - storage2
 *        - @scope
 *           - pkg4 > @scope/pkg4
 * The search return a data structure like:
 *  [
 *   {
 *    name: 'pkg1', // package name could be @scope/pkg1
 *    path: absolute/path/package/name
 *   }
 *  ]
 * @param {string} storagePath is the base path of the storage folder,
 * inside could be packages, storages and @scope packages.
 * @param {Set<string>} storages storages are defined peer package access pattern via `storage` property
 * @param query is the search query from the user via npm search command.
 * and are intended to organize packages in a tree structure.
 * @returns {Promise<searchUtils.SearchItemPkg[]>}
 */
export async function searchOnStorage(
  storagePath: string,
  storages: Map<string, string>
): Promise<searchUtils.SearchItemPkg[]> {
  const matchedStorages = Array.from(storages);
  const storageFolders = Array.from(storages.keys());
  debug('search on %o', storagePath);
  debug('storage folders %o', matchedStorages.length);
  let results: searchUtils.SearchItemPkg[] = [];
  // watch base path and ignore storage folders
  const basePathFolders = (await getFolders(storagePath, '*')).filter(
    (storageFolder) => !storageFolders.includes(storageFolder)
  );

  for (let store of basePathFolders) {
    if (validatioUtils.isPackageNameScoped(store)) {
      const scopedPackages = await getFolders(join(storagePath, store), '*');
      const listScoped = scopedPackages.map((scoped) => ({
        name: `${store}/${scoped}`,
        scoped: store,
      }));
      results.push(...listScoped);
    } else {
      results.push({
        name: store,
      });
    }
  }

  // iterate each storage folder
  for (const store of storageFolders) {
    const foldersOnStorage = await getFolders(join(storagePath, store), '*');
    for (let pkgName of foldersOnStorage) {
      if (validatioUtils.isPackageNameScoped(pkgName)) {
        const scopedPackages = await getFolders(join(storagePath, store, pkgName), '*');
        const listScoped = scopedPackages.map((scoped) => ({
          name: `${pkgName}/${scoped}`,
          scoped: pkgName,
        }));
        results.push(...listScoped);
      } else {
        results.push({
          name: pkgName,
        });
      }
    }
  }

  return results;
}
