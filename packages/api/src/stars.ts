import { Response, Router } from 'express';
import _ from 'lodash';

import { HTTP_STATUS, USERS } from '@verdaccio/core';
import { Storage } from '@verdaccio/store';
import { Version } from '@verdaccio/types';

import { $NextFunctionVer, $RequestExtend } from '../types/custom';

export default function (route: Router, storage: Storage): void {
  route.get(
    '/-/_view/starredByUser',
    async (req: $RequestExtend, res: Response, next: $NextFunctionVer): Promise<void> => {
      const remoteUsername = req.remote_user.name;

      try {
        const localPackages: Version[] = await storage.getLocalDatabaseNext();

        const filteredPackages: Version[] = localPackages.filter((localPackage: Version) =>
          _.keys(localPackage[USERS]).includes(remoteUsername)
        );

        res.status(HTTP_STATUS.OK);
        next({
          rows: filteredPackages.map((filteredPackage: Version) => ({
            value: filteredPackage.name,
          })),
        });
      } catch (err: any) {
        return next(err);
      }
    }
  );
}
