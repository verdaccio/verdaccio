import buildDebug from 'debug';
import { Router } from 'express';
import { isNil } from 'lodash-es';

import type { Auth } from '@verdaccio/auth';
import { createAnonymousRemoteUser } from '@verdaccio/config';
import { logger } from '@verdaccio/logger';
import {
  $NextFunctionVer,
  $RequestExtend,
  $ResponseExtend,
  WebUrls,
  getRequestOptions,
} from '@verdaccio/middleware';
import type { Storage } from '@verdaccio/store';
import { getLocalRegistryTarballUri } from '@verdaccio/tarball';
import type { Config, RemoteUser, Version } from '@verdaccio/types';

import { formatAuthor, generateGravatarUrl } from '../author-utils';
import { hasLogin, sortByName, sortByTime } from '../web-utils';

export { $RequestExtend, $ResponseExtend, $NextFunctionVer }; // Was required by other packages

const getField = (field = 'name') => {
  return field === 'name' || field === 'time' ? field : 'name';
};

const getOrder = (order = 'asc') => {
  return order === 'asc';
};

const debug = buildDebug('verdaccio:web:api:package');

function addPackageWebApi(storage: Storage, auth: Auth, config: Config): Router {
  const isLoginEnabled = hasLogin(config);
  debug('is login enabled: %o', isLoginEnabled);
  const pkgRouter = Router(); /* eslint new-cap: 0 */
  const anonymousRemoteUser: RemoteUser = createAnonymousRemoteUser();

  debug('initialized package web api');
  const checkAllow = (name: string, remoteUser: RemoteUser): Promise<boolean> =>
    new Promise((resolve, reject): void => {
      const remoteUserAccess = !isLoginEnabled ? anonymousRemoteUser : remoteUser;
      try {
        auth.allow_access({ packageName: name }, remoteUserAccess, (err, allowed): void => {
          if (err) {
            resolve(false);
          }
          return resolve(allowed as boolean);
        });
      } catch (err: any) {
        reject(err);
      }
    });

  async function processPackages(packages: Version[] = [], req): Promise<Version[]> {
    const permissions: Version[] = [];
    const packagesToProcess = packages.slice();
    debug('process packages %o', packagesToProcess);
    const requestOptions = getRequestOptions(req);
    for (const pkg of packagesToProcess) {
      const pkgCopy = { ...pkg };
      pkgCopy.author = formatAuthor(pkg.author);
      try {
        if (await checkAllow(pkg.name, req.remote_user)) {
          if (config.web) {
            // @ts-ignore
            pkgCopy.author.avatar = generateGravatarUrl(pkgCopy.author.email, config.web.gravatar);
          }
          // convert any remote dist to a local reference
          // eg: if the dist points to npmjs, switch to localhost:4873/prefix/etc.tar.gz
          if (!isNil(pkgCopy.dist) && pkgCopy.dist.tarball !== null) {
            pkgCopy.dist.tarball = getLocalRegistryTarballUri(
              pkgCopy.dist.tarball,
              pkg.name,
              requestOptions,
              config?.url_prefix
            );
          }
          permissions.push(pkgCopy);
        }
      } catch (err: any) {
        debug('process packages error %o', err);
        logger.error(
          { name: pkg.name, error: err },
          'permission process for @{name} has failed: @{error}'
        );
        throw err;
      }
    }

    debug('allowed %o packages', permissions.length);
    return permissions;
  }

  // Get list of all visible package
  pkgRouter.get(
    WebUrls.packages_all,
    async function (
      req: $RequestExtend,
      res: $ResponseExtend,
      next: $NextFunctionVer
    ): Promise<void> {
      debug('hit package web api %o');

      try {
        const localPackages: Version[] = await storage.getLocalDatabase();

        const field = getField(config?.web?.sort_field);
        const order = getOrder(config?.web?.sort_packages);
        debug('order by %o %o', field, order);
        const pkgs = await processPackages(localPackages, req);
        if (field === 'name') next(sortByName(pkgs, order));
        else next(sortByTime(pkgs, order));
      } catch (error: any) {
        next(error);
      }
    }
  );

  return pkgRouter;
}

export default addPackageWebApi;
