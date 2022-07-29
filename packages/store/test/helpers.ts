import { Manifest } from '@verdaccio/types';

import { Storage } from '../src/storage';

export const addPackageToStore = (storage: Storage, pkgName: string, metadata: Manifest) => {
  return new Promise((resolve, reject) => {
    storage.addPackage(pkgName, metadata, (err, data) => {
      if (err) {
        return reject(err);
      }
      return resolve(data);
    });
  });
};
