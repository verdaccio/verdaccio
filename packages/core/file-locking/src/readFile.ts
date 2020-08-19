import fs from 'fs';

import { Callback } from '@verdaccio/types';

import { lockFile } from './lockfile';

export type ReadFileOptions = {
  parse?: boolean;
  lock?: boolean;
};

/**
 *  Reads a local file, which involves
 *  optionally taking a lock
 *  reading the file contents
 *  optionally parsing JSON contents
 * @param {*} name
 * @param {*} options
 * @param {*} callback
 */
// eslint-disable-next-line @typescript-eslint/no-empty-function
function readFile(name: string, options: ReadFileOptions = {}, callback: Callback = (): void => {}): void {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  options.lock = options.lock || false;
  options.parse = options.parse || false;

  const lock = function (options: ReadFileOptions): Promise<null | NodeJS.ErrnoException> {
    return new Promise((resolve, reject): void => {
      if (!options.lock) {
        return resolve(null);
      }

      lockFile(name, function (err: NodeJS.ErrnoException | null) {
        if (err) {
          return reject(err);
        }
        return resolve(null);
      });
    });
  };

  const read = function (): Promise<NodeJS.ErrnoException | string> {
    return new Promise((resolve, reject): void => {
      fs.readFile(name, 'utf8', function (err, contents) {
        if (err) {
          return reject(err);
        }

        resolve(contents);
      });
    });
  };

  const parseJSON = function (contents: string): Promise<unknown> {
    return new Promise((resolve, reject): void => {
      if (!options.parse) {
        return resolve(contents);
      }
      try {
        contents = JSON.parse(contents);
        return resolve(contents);
      } catch (err) {
        return reject(err);
      }
    });
  };

  Promise.resolve()
    .then(() => lock(options))
    .then(() => read())
    .then((content) => parseJSON(content as string))
    .then(
      (result) => callback(null, result),
      (err) => callback(err)
    );
}

export { readFile };
