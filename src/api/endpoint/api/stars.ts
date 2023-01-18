import { Response, Router } from 'express';
import _ from 'lodash';

import { Package } from '@verdaccio/types';

import { HTTP_STATUS, USERS } from '../../../lib/constants';
import { $NextFunctionVer, $RequestExtend, IStorageHandler } from '../../../types';

type Packages = Package[];

export default function (route: Router, storage: IStorageHandler): void {
  route.get(
    '/-/_view/starredByUser',
    (req: $RequestExtend, res: Response, next: $NextFunctionVer): void => {
      const remoteUsername = req.remote_user.name;

      storage.getLocalDatabase((err, localPackages: Packages) => {
        if (err) {
          return next(err);
        }

        const filteredPackages: Packages = localPackages.filter((localPackage: Package) =>
          _.keys(localPackage[USERS]).includes(remoteUsername)
        );

        res.status(HTTP_STATUS.OK);
        next({
          rows: filteredPackages.map((filteredPackage: Package) => ({
            value: filteredPackage.name,
          })),
        });
      });
    }
  );
}
