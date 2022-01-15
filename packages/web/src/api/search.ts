import buildDebug from 'debug';
import { Router } from 'express';

import { IAuth } from '@verdaccio/auth';
import { DIST_TAGS } from '@verdaccio/core';
import { SearchInstance } from '@verdaccio/store';
import { Storage } from '@verdaccio/store';
import { Package } from '@verdaccio/types';

import { $NextFunctionVer, $RequestExtend, $ResponseExtend } from './package';

const debug = buildDebug('verdaccio:web:api:search');

function addSearchWebApi(storage: Storage, auth: IAuth): Router {
  const router = Router(); /* eslint new-cap: 0 */
  const getPackageInfo = async function (name, remoteUser): Promise<any> {
    return new Promise((resolve, reject) => {
      debug('searching for %o', name);
      try {
        // @ts-ignore
        storage.getPackage({
          name,
          uplinksLook: false,
          callback: (err, pkg: Package): void => {
            debug('callback get package err %o', err?.message);
            if (!err && pkg) {
              debug('valid package  %o', pkg?.name);
              auth.allow_access(
                { packageName: pkg.name },
                remoteUser,
                function (err, allowed): void {
                  debug('is allowed %o', allowed);
                  if (err || !allowed) {
                    debug('deny access');
                    reject(err);
                    return;
                  }
                  debug('access succeed');
                  resolve(pkg.versions[pkg[DIST_TAGS].latest]);
                }
              );
            } else {
              reject(err);
            }
          },
        });
      } catch (err: any) {
        reject(err);
      }
    });
  };

  router.get(
    '/search/:anything',
    async function (
      req: $RequestExtend,
      res: $ResponseExtend,
      next: $NextFunctionVer
    ): Promise<void> {
      const results = SearchInstance.query(req.params.anything);
      debug('search results %o', results);
      if (results.length > 0) {
        let packages: Package[] = [];
        for (let result of results) {
          try {
            const pkg = await getPackageInfo(result.ref, req.remote_user);
            debug('package found %o', result.ref);
            packages.push(pkg);
          } catch (err: any) {
            debug('search for %o failed err %o', result.ref, err?.message);
          }
        }
        next(packages);
      } else {
        next([]);
      }
    }
  );
  return router;
}

export default addSearchWebApi;
