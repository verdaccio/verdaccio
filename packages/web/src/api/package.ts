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
import { type Storage, indexAfter } from '@verdaccio/store';
import { getLocalRegistryTarballUri } from '@verdaccio/tarball';
import type { Config, RemoteUser, Version } from '@verdaccio/types';

import { formatAuthor, generateGravatarUrl } from '../author-utils';
import { hasLogin, sortByName, sortByTime } from '../web-utils';

export { $RequestExtend, $ResponseExtend, $NextFunctionVer }; // Was required by other packages

export type PackageOrigin = 'private' | 'cached';

type ListedPackage = Pick<Version, 'name' | 'author'> & { dist?: { tarball: string } };

const markOrigin = (pkg: ListedPackage, origin: PackageOrigin) => {
  // @ts-ignore
  pkg.origin = origin;
};

const getField = (field = 'name') => {
  return field === 'name' || field === 'time' ? field : 'name';
};

const getOrder = (order = 'asc') => {
  return order === 'asc';
};

const debug = buildDebug('verdaccio:web:api:package');

export const CACHED_PAGE_DEFAULT_LIMIT = 50;
export const CACHED_PAGE_MAX_LIMIT = 100;
// access checks per request, so a user allowed few packages cannot make one request walk the index
export const CACHED_PAGE_SCAN_BUDGET = 1_000;

const parseLimit = (value: unknown): number => {
  const parsed = Number.parseInt(String(value ?? ''), 10);
  return Number.isNaN(parsed) || parsed <= 0
    ? CACHED_PAGE_DEFAULT_LIMIT
    : Math.min(parsed, CACHED_PAGE_MAX_LIMIT);
};

function addPackageWebApi(storage: Storage, auth: Auth, config: Config): Router {
  const isLoginEnabled = hasLogin(config);
  debug('is login enabled: %o', isLoginEnabled);
  const pkgRouter = Router(); /* eslint new-cap: 0 */
  const anonymousRemoteUser: RemoteUser = createAnonymousRemoteUser();
  const showCachedPackages = config.flags?.cachedPackages === true;

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

  async function processPackages<T extends ListedPackage>(packages: T[] = [], req): Promise<T[]> {
    const permissions: T[] = [];
    const packagesToProcess = packages.slice();
    debug('process packages %o', packagesToProcess.length);
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
            // copied: the cached summaries share their dist object across requests
            pkgCopy.dist = {
              ...pkgCopy.dist,
              tarball: getLocalRegistryTarballUri(
                pkgCopy.dist.tarball,
                pkg.name,
                requestOptions,
                config?.url_prefix
              ),
            };
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
        if (showCachedPackages) {
          pkgs.forEach((pkg) => markOrigin(pkg, 'private'));
        }
        if (field === 'name') next(sortByName(pkgs, order));
        else next(sortByTime(pkgs, order));
      } catch (error: any) {
        next(error);
      }
    }
  );

  // the page is cut from the sorted name index by cursor, so only its manifests are read
  if (showCachedPackages) {
    pkgRouter.get(
      WebUrls.packages_cached,
      async function (
        req: $RequestExtend,
        _res: $ResponseExtend,
        next: $NextFunctionVer
      ): Promise<void> {
        try {
          const limit = parseLimit(req.query.limit);
          const after = typeof req.query.after === 'string' ? req.query.after : '';
          const names = await storage.getCachedPackageNames();
          const start = after ? indexAfter(names, after) : 0;
          const end = Math.min(names.length, start + CACHED_PAGE_SCAN_BUDGET);
          const page: string[] = [];
          let scanned = start;
          while (scanned < end && page.length < limit) {
            const name = names[scanned++];
            if (await checkAllow(name, req.remote_user)) {
              page.push(name);
            }
          }
          debug('cached packages page after %o: %o of %o names', after, page.length, names.length);
          const summaries = await storage.getCachedPackagesSummaries(page);
          // after the page, so the first visit is not slowed down by the warmup
          storage.warmCachedPackagesSummaries();
          const packages = await processPackages(summaries, req);
          packages.forEach((pkg) => markOrigin(pkg, 'cached'));
          next({ packages, next: scanned < names.length ? names[scanned - 1] : null });
        } catch (error: any) {
          next(error);
        }
      }
    );
  }

  return pkgRouter;
}

export default addPackageWebApi;
