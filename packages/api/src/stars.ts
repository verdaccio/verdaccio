import { Response, Router } from 'express';
import _ from 'lodash';

import { HTTP_STATUS, USERS } from '@verdaccio/core';
import { Storage } from '@verdaccio/store';
import { Package } from '@verdaccio/types';

import { $NextFunctionVer, $RequestExtend } from '../types/custom';

type Packages = Package[];

export default function (route: Router, storage: Storage): void {
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
