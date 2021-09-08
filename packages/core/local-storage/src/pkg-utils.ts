import _ from 'lodash';
import { LocalStorage, StorageList, Logger } from '@verdaccio/types';
import { readFilePromise } from './fs';

export async function loadPrivatePackages(path: string, logger: Logger): Promise<LocalStorage> {
  const list: StorageList = [];
  const emptyDatabase = { list, secret: '' };
  const data = await readFilePromise(path);
  if (_.isNil(data)) {
    // readFilePromise is platform specific, FreeBSD might return null
    return emptyDatabase;
  }

  let db;
  try {
    db = JSON.parse(data);
  } catch (err: any) {
    logger.error(
      {
        err,
        path,
      },
      `Package database file corrupted (invalid JSON) @{err.message}, please check the error printed below.File Path: @{path}`
    );
    throw Error('Package database file corrupted (invalid JSON)');
  }

  if (_.isEmpty(db)) {
    return emptyDatabase;
  }

  return db;
}
