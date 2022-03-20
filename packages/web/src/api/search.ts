import buildDebug from 'debug';
import { Router } from 'express';
import _ from 'lodash';
import { URLSearchParams } from 'url';

import { IAuth } from '@verdaccio/auth';
import { Config } from '@verdaccio/config';
import { DIST_TAGS, errorUtils, searchUtils } from '@verdaccio/core';
import { SearchQuery } from '@verdaccio/core/src/search-utils';
import { SearchInstance } from '@verdaccio/store';
import { Storage } from '@verdaccio/store';
import { Manifest } from '@verdaccio/types';

import { $NextFunctionVer, $RequestExtend, $ResponseExtend } from './package';

const debug = buildDebug('verdaccio:web:api:search');

function checkAccess(pkg: any, auth: any, remoteUser): Promise<Manifest | null> {
  return new Promise((resolve, reject) => {
    auth.allow_access({ packageName: pkg?.package?.name }, remoteUser, function (err, allowed) {
      if (err) {
        if (err.status && String(err.status).match(/^4\d\d$/)) {
          // auth plugin returns 4xx user error,
          // that's equivalent of !allowed basically
          allowed = false;
          return resolve(null);
        } else {
          reject(err);
        }
      } else {
        return resolve(allowed ? pkg : null);
      }
    });
  });
}

function addSearchWebApi(storage: Storage, auth: IAuth, config: Config): Router {
  const router = Router(); /* eslint new-cap: 0 */
  const getPackageInfo = async function (name, remoteUser): Promise<any> {
    return new Promise((resolve, reject) => {
      debug('searching for %o', name);
      try {
        // @ts-ignore
        storage.getPackage({
          name,
          uplinksLook: false,
          callback: (err, pkg: Manifest): void => {
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
      if (config.flags.searchRemote === true) {
        try {
          let data;
          const abort = new AbortController();
          req.on('aborted', () => {
            abort.abort();
          });
          const text: string = (req.params.anything as string) ?? '';
          // These values are declared as optimal by npm cli
          // FUTURE: could be overwritten by ui settings.
          const size = 20;
          const from = 0;
          const query: SearchQuery = {
            from: 0,
            maintenance: 0.5,
            popularity: 0.98,
            quality: 0.65,
            size: 20,
            text,
          };
          // @ts-ignore
          const urlParams = new URLSearchParams(query);
          data = await storage.searchManager?.search({
            query,
            url: `/-/v1/search?${urlParams.toString()}`,
            abort,
          });
          const checkAccessPromises: searchUtils.SearchItemPkg[] = await Promise.all(
            data.map((pkgItem) => {
              return checkAccess(pkgItem, auth, req.remote_user);
            })
          );

          const final: searchUtils.SearchItemPkg[] = checkAccessPromises
            .filter((i) => !_.isNull(i))
            .slice(from, size);

          // const response: searchUtils.SearchResults = {
          //   objects: final,
          //   total: final.length,
          //   time: new Date().toUTCString(),
          // };

          next(final);
        } catch (err: any) {
          next(errorUtils.getInternalError(err.message));
        }
      } else {
        const results = SearchInstance.query(req.params.anything);
        debug('search results %o', results);
        if (results.length > 0) {
          let packages: Manifest[] = [];
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
    }
  );
  return router;
}

export default addSearchWebApi;
