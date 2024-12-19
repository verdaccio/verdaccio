import { Response, Router } from 'express';
import _ from 'lodash';

import { HTTP_STATUS, USERS, errorUtils } from '@verdaccio/core';
import { STARS_API_ENDPOINTS } from '@verdaccio/middleware';
import { Storage } from '@verdaccio/store';
import { Version } from '@verdaccio/types';

import { $NextFunctionVer, $RequestExtend } from '../types/custom';

export default function (route: Router, storage: Storage): void {
  route.get(
    STARS_API_ENDPOINTS.get_user_starred_packages,
    async (req: $RequestExtend, res: Response, next: $NextFunctionVer): Promise<void> => {
      const query: { key: string } = req.query;
      if (typeof query?.key !== 'string') {
        return next(errorUtils.getBadRequest('missing query key username'));
      }

      try {
        const localPackages: Version[] = await storage.getLocalDatabase();
        const filteredPackages: Version[] = localPackages.filter((localPackage: Version) =>
          _.keys(localPackage[USERS]).includes(query?.key.toString().replace(/['"]+/g, ''))
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
