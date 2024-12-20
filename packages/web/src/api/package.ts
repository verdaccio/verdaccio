import buildDebug from 'debug';
import { Router } from 'express';
import _ from 'lodash';

import { Auth } from '@verdaccio/auth';
import { logger } from '@verdaccio/logger';
import { $NextFunctionVer, $RequestExtend, $ResponseExtend } from '@verdaccio/middleware';
import { WebUrls } from '@verdaccio/middleware';
import { Storage } from '@verdaccio/store';
import { getLocalRegistryTarballUri } from '@verdaccio/tarball';
import { Config, RemoteUser, Version } from '@verdaccio/types';
import { formatAuthor, generateGravatarUrl } from '@verdaccio/utils';

import { sortByName } from '../web-utils';

export { $RequestExtend, $ResponseExtend, $NextFunctionVer }; // Was required by other packages

const getOrder = (order = 'asc') => {
  return order === 'asc';
};

const debug = buildDebug('verdaccio:web:api:package');

function addPackageWebApi(storage: Storage, auth: Auth, config: Config): Router {
  const isLoginEnabled = config?.web?.login === true ?? true;
  const pkgRouter = Router(); /* eslint new-cap: 0 */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const anonymousRemoteUser: RemoteUser = {
    name: undefined,
    real_groups: [],
    groups: [],
  };

  debug('initialized package web api');
  const checkAllow = (name: string, remoteUser: RemoteUser): Promise<boolean> =>
    new Promise((resolve, reject): void => {
      debug('is login disabled %o', isLoginEnabled);
      // FIXME: this logic does not work, review
      // const remoteUserAccess = !isLoginEnabled ? anonymousRemoteUser : remoteUser;
      try {
        auth.allow_access({ packageName: name }, remoteUser, (err, allowed): void => {
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
          if (!_.isNil(pkgCopy.dist) && !_.isNull(pkgCopy.dist.tarball)) {
            pkgCopy.dist.tarball = getLocalRegistryTarballUri(
              pkgCopy.dist.tarball,
              pkg.name,
              { protocol: req.protocol, headers: req.headers as any, host: req.hostname },
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

        const order = getOrder(config?.web?.sort_packages);
        debug('order %o', order);
        const pkgs = await processPackages(localPackages, req);
        next(sortByName(pkgs, order));
      } catch (error: any) {
        next(error);
      }
    }
  );

  return pkgRouter;
}

export default addPackageWebApi;
