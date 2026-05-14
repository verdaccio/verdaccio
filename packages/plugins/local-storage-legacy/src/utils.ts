import globby from 'globby';
import fs from 'node:fs';
import path from 'node:path';

export function getFileStats(packagePath: string): Promise<fs.Stats> {
  return new Promise((resolve, reject): void => {
    fs.stat(packagePath, (err, stats) => {
      if (err) {
        return reject(err);
      }
      resolve(stats);
    });
  });
}

export async function findPackages(
  storagePath: string,
  validationHandler: Function
): Promise<{ name: string; path: string }[]> {
  const listPackages: { name: string; path: string }[] = [];
  const scopePath = path.resolve(storagePath);

  // @ts-ignore
  const folders = await globby('*', {
    cwd: scopePath,
    onlyDirectories: true,
    onlyFiles: false,
    deep: 1,
    dot: false,
    followSymbolicLinks: true,
  });

  for (const directory of folders) {
    if (directory.match(/^@/)) {
      const scopeDirectory = path.resolve(storagePath, directory);
      // @ts-ignore
      const scopedPackages = await globby('*', {
        cwd: scopeDirectory,
        onlyDirectories: true,
        onlyFiles: false,
        deep: 1,
        dot: false,
      });

      for (const scopedDirName of scopedPackages) {
        if (validationHandler(scopedDirName)) {
          listPackages.push({
            name: `${directory}/${scopedDirName}`,
            path: path.resolve(storagePath, directory, scopedDirName),
          });
        }
      }
    } else {
      if (validationHandler(directory)) {
        listPackages.push({
          name: directory,
          path: path.resolve(storagePath, directory),
        });
      }
    }
  }

  return listPackages;
}
