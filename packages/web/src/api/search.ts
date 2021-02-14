import buildDebug from 'debug';
import { SearchInstance } from '@verdaccio/store';
import { DIST_TAGS } from '@verdaccio/commons-api';
import { Router } from 'express';
import { Package } from '@verdaccio/types';
import { IAuth } from '@verdaccio/auth';
import { IStorageHandler } from '@verdaccio/store';
import { $ResponseExtend, $RequestExtend, $NextFunctionVer } from './package';

const debug = buildDebug('verdaccio:web:api:search');

function addSearchWebApi(route: Router, storage: IStorageHandler, auth: IAuth): void {
  const getPackageInfo = async function (name, remoteUser): Promise<any> {
    return new Promise((resolve, reject) => {
      debug('searching for %o', name);
      try {
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
      } catch (err) {
        reject(err);
      }
    });
  };

  route.get(
    '/search/:anything',
    async function (
      req: $RequestExtend,
      res: $ResponseExtend,
      next: $NextFunctionVer
    ): Promise<void> {
      const results: string[] = SearchInstance.query(req.params.anything);
      debug('search results %o', results);
      if (results.length > 0) {
        let packages: Package[] = [];
        for (let pkgName of results) {
          try {
            const pkg = await getPackageInfo(pkgName, req.remote_user);
            debug('package found %o', pkgName);
            packages.push(pkg);
          } catch (err) {
            debug('search for %o failed err %o', pkgName, err?.message);
          }
        }
        next(packages);
      } else {
        next([]);
      }
    }
  );
}

export default addSearchWebApi;
