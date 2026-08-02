import createDebug from 'debug';
import type { Response, Router } from 'express';
import _ from 'lodash';

import type { Auth } from '@verdaccio/auth';
import { errorUtils } from '@verdaccio/core';
import { STARS_API_ENDPOINTS, rateLimit } from '@verdaccio/middleware';
import type { Config, Version } from '@verdaccio/types';

import { HTTP_STATUS, USERS } from '../../../lib/constants';
import type Storage from '../../../lib/storage';
import type { $NextFunctionVer, $RequestExtend } from '../../../types';

const debug = createDebug('verdaccio:api:stars');

export default function (route: Router, auth: Auth, storage: Storage, config: Config): void {
  route.get(
    STARS_API_ENDPOINTS.get_user_starred_packages,
    rateLimit(config?.userRateLimit),
    (req: $RequestExtend, res: Response, next: $NextFunctionVer): void => {
      const query = req.query as { key?: string };
      if (typeof query?.key === 'undefined' || typeof query?.key !== 'string') {
        debug('missing query key username');
        return next(errorUtils.getBadRequest('missing query key username'));
      }

      const key = query.key.replace(/['"]+/g, '');
      debug(`get user starred packages for user: ${key}`);

      storage.getLocalDatabase((err, localPackages: Version[]) => {
        if (err) {
          debug(`error getting local database: ${err.message}`);
          return next(err);
        }

        const starredPackages: Version[] = localPackages.filter((localPackage: Version) => {
          debug(`checking package: ${localPackage?.name}`);
          return _.keys(localPackage[USERS]).includes(key);
        });

        const allowedFor = (localPackage: Version): Promise<boolean> =>
          new Promise((resolve, reject) => {
            auth.allow_access(
              { packageName: localPackage.name },
              req.remote_user,
              (accessErr, allowed): void => {
                if (accessErr) {
                  if (accessErr.status && String(accessErr.status).match(/^4\d\d$/)) {
                    // auth plugin returns 4xx user error,
                    // that's equivalent of !allowed basically
                    return resolve(false);
                  }
                  return reject(accessErr);
                }
                resolve(Boolean(allowed));
              }
            );
          });

        Promise.all(starredPackages.map(allowedFor)).then(
          (results) => {
            const filteredPackages: Version[] = starredPackages.filter(
              (_pkg, index) => results[index]
            );
            debug(`found ${filteredPackages.length} accessible packages for user: ${key}`);
            res.status(HTTP_STATUS.OK);
            next({
              rows: filteredPackages.map((filteredPackage: Version) => ({
                value: filteredPackage.name,
              })),
            });
          },
          (accessErr) => next(accessErr)
        );
      });
    }
  );
}
