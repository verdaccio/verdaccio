import { Response, Router } from 'express';
import _ from 'lodash';

import { errorUtils } from '@verdaccio/core';
import { STARS_API_ENDPOINTS } from '@verdaccio/middleware';
import { Manifest, Version } from '@verdaccio/types';

import { HTTP_STATUS, USERS } from '../../../lib/constants';
import Storage from '../../../lib/storage';
import { $NextFunctionVer, $RequestExtend } from '../../../types';

export default function (route: Router, storage: Storage): void {
  route.get(
    STARS_API_ENDPOINTS.get_user_starred_packages,
    (req: $RequestExtend, res: Response, next: $NextFunctionVer): void => {
      // @ts-ignore
      const query: { key: string } = req.query;
      if (typeof query?.key !== 'string') {
        return next(errorUtils.getBadRequest('missing query key username'));
      }

      // @ts-ignore
      storage.getLocalDatabase((err, localPackages: Version[]) => {
        if (err) {
          return next(err);
        }

        const filteredPackages: Version[] = localPackages.filter((localPackage: Version) =>
          _.keys(localPackage[USERS]).includes(query?.key.toString().replace(/['"]+/g, ''))
        );

        res.status(HTTP_STATUS.OK);
        next({
          rows: filteredPackages.map((filteredPackage: Version) => ({
            value: filteredPackage.name,
          })),
        });
      });
    }
  );
}
