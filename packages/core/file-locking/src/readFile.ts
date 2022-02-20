import { lockFileNext } from './lockfile';
import { readFile } from './utils';

export type ReadFileOptions = {
  parse?: boolean;
  lock?: boolean;
};

async function lock(name: string, options: ReadFileOptions): Promise<null | void> {
  if (!options.lock) {
    return null;
  }

  await lockFileNext(name);
}

async function read(name: string): Promise<string> {
  return readFile(name, 'utf8');
}

function parseJSON(contents: string, options): Promise<unknown> {
  return new Promise((resolve, reject): void => {
    if (!options.parse) {
      return resolve(contents);
    }
    try {
      contents = JSON.parse(contents);
      return resolve(contents);
    } catch (err: any) {
      return reject(err);
    }
  });
}

/**
 *  Reads a local file, which involves
 *  optionally taking a lock
 *  reading the file contents
 *  optionally parsing JSON contents
 * @param {*} name
 * @param {*} options
 * @param {*} callback
 */
export async function readFileNext<T>(name: string, options: ReadFileOptions = {}): Promise<T> {
  const _options = {
    lock: options?.lock || false,
    parse: options?.parse || false,
  };
  await lock(name, _options);
  const content = await read(name);
  const parsed = await parseJSON(content, options);
  return parsed as T;
}
