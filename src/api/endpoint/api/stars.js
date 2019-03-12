/**
 * @prettier
 * @flow
 */

import { USERS, HTTP_STATUS } from '../../../lib/constants';
import type { $Response, Router } from 'express';
import type { $RequestExtend, $NextFunctionVer, IStorageHandler } from '../../../../types';
import type { Package } from '@verdaccio/types';

export default function(route: Router, storage: IStorageHandler) {
  route.get(
    '/-/_view/starredByUser',
    (req: $RequestExtend, res: $Response, next: $NextFunctionVer): void => {
      const remoteUsername = req.remote_user.name;
      storage.getLocalDatabase((err, localPackages: Package[]) => {
        if (err) {
          return next(err);
        }
        const filteredPackages = localPackages.filter(
          localPackage => (localPackage[USERS] ? Object.keys(localPackage[USERS]).indexOf(remoteUsername) >= 0 : false)
        );
        res.status(HTTP_STATUS.OK);
        next({
          rows: filteredPackages.map(filteredPackage => ({
            value: filteredPackage.name,
          })),
        });
      });
    }
  );
}
