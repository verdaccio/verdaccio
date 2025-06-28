import createDebug from 'debug';
import { Response, Router } from 'express';
import _ from 'lodash';

import { errorUtils } from '@verdaccio/core';
import { STARS_API_ENDPOINTS } from '@verdaccio/middleware';
import { Version } from '@verdaccio/types';

import { HTTP_STATUS, USERS } from '../../../lib/constants';
import Storage from '../../../lib/storage';
import { $NextFunctionVer, $RequestExtend } from '../../../types';

const debug = createDebug('verdaccio:api:stars');

export default function (route: Router, storage: Storage): void {
  route.get(
    STARS_API_ENDPOINTS.get_user_starred_packages,
    (req: $RequestExtend, res: Response, next: $NextFunctionVer): void => {
      const query = req.query as { key?: string };
      if (typeof query?.key === 'undefined' || typeof query?.key !== 'string') {
        debug('missing query key username');
        return next(errorUtils.getBadRequest('missing query key username'));
      }

      const key = query.key;
      debug(`get user starred packages for user: ${key}`);

      storage.getLocalDatabase((err, localPackages: Version[]) => {
        if (err) {
          debug(`error getting local database: ${err.message}`);
          return next(err);
        }

        const filteredPackages: Version[] = localPackages.filter((localPackage: Version) => {
          debug(`checking package: ${localPackage?.name}`);
          return _.keys(localPackage[USERS]).includes(key.toString().replace(/['"]+/g, ''));
        });

        debug(`found ${filteredPackages.length} packages for user: ${key}`);
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
