import buildDebug from 'debug';
import { Router } from 'express';

import { IAuth } from '@verdaccio/auth';
import { DIST_TAGS } from '@verdaccio/core';
import { SearchInstance } from '@verdaccio/store';
import { Storage } from '@verdaccio/store';
import { Package, SearchResultWeb, Version } from '@verdaccio/types';

import { $NextFunctionVer, $RequestExtend, $ResponseExtend } from './package';

const debug = buildDebug('verdaccio:web:api:search');

function addSearchWebApi(route: Router, storage: Storage, auth: IAuth): void {
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
                  const latestPkg: Version = pkg.versions[pkg[DIST_TAGS].latest];
                  const item: SearchResultWeb = {
                    name: latestPkg.name,
                    version: latestPkg.version,
                    description: latestPkg.description,
                  };
                  debug('access succeed');
                  resolve(item);
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

  route.get(
    '/search/:anything',
    async function (
      req: $RequestExtend,
      res: $ResponseExtend,
      next: $NextFunctionVer
    ): Promise<void> {
      const results = SearchInstance.query(req.params.anything);
      debug('search results %o', results);
      if (results.length > 0) {
        let packages: any[] = [];
        for (let result of results) {
          try {
            const pkg = getPackageInfo(result.ref, req.remote_user);
            debug('package found %o', result.ref);
            packages.push(pkg);
          } catch (err: any) {
            debug('search for %o failed err %o', result.ref, err?.message);
          }
        }
        const packagesResolved: SearchResultWeb[] = await Promise.all(packages);
        next(packagesResolved);
      } else {
        next([]);
      }
    }
  );
}

export default addSearchWebApi;
