import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import { Config } from '@verdaccio/types';

export function getFileStats(packagePath: string): Promise<fs.Stats> {
  return new Promise((resolve, reject): void => {
    fs.stat(packagePath, (err, stats) => {
      if (_.isNil(err) === false) {
        return reject(err);
      }
      resolve(stats);
    });
  });
}

export function readDirectory(packagePath: string): Promise<string[]> {
  return new Promise((resolve, reject): void => {
    fs.readdir(packagePath, (err, scopedPackages) => {
      if (_.isNil(err) === false) {
        return reject(err);
      }

      resolve(scopedPackages);
    });
  });
}

function hasScope(file: string): boolean {
  return file.match(/^@/) !== null;
}

/* eslint-disable no-async-promise-executor */
export async function findPackages(
  storagePath: string,
  validationHandler: Function
): Promise<{ name: string; path: string }[]> {
  const listPackages: { name: string; path: string }[] = [];
  return new Promise(async (resolve, reject) => {
    try {
      const scopePath = path.resolve(storagePath);
      const storageDirs = await readDirectory(scopePath);
      for (const directory of storageDirs) {
        // we check whether has 2nd level
        if (hasScope(directory)) {
          // we read directory multiple
          const scopeDirectory = path.resolve(storagePath, directory);
          const scopedPackages = await readDirectory(scopeDirectory);
          for (const scopedDirName of scopedPackages) {
            if (validationHandler(scopedDirName)) {
              // we build the complete scope path
              const scopePath = path.resolve(storagePath, directory, scopedDirName);
              // list content of such directory
              listPackages.push({
                name: `${directory}/${scopedDirName}`,
                path: scopePath,
              });
            }
          }
        } else {
          // otherwise we read as single level
          if (validationHandler(directory)) {
            const scopePath = path.resolve(storagePath, directory);
            listPackages.push({
              name: directory,
              path: scopePath,
            });
          }
        }
      }
    } catch (error) {
      reject(error);
    }

    resolve(listPackages);
  });
}

export function _dbGenPath(
  dbName: string,
  config: Pick<Config, 'config_path' | 'storage'>
): string {
  return path.join(
    path.resolve(path.dirname(config.config_path || ''), config.storage as string, dbName)
  );
}
/* eslint-enable no-async-promise-executor */
