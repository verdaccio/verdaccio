import { Router } from 'express';
import _ from 'lodash';

import type { Auth } from '@verdaccio/auth';
import { createAnonymousRemoteUser } from '@verdaccio/config';
import { WebUrls } from '@verdaccio/middleware';
import {
  convertDistRemoteToLocalTarballUrls,
  getLocalRegistryTarballUri,
} from '@verdaccio/tarball';
import type { Config, Manifest, RemoteUser } from '@verdaccio/types';
import { authorUtils } from '@verdaccio/core';

const { addGravatarSupport, formatAuthor, generateGravatarUrl } = authorUtils;

import { DIST_TAGS, HEADERS, HEADER_TYPE, HTTP_STATUS } from '../../../lib/constants';
import { logger } from '../../../lib/logger';
import type Storage from '../../../lib/storage';
import {
  ErrorCode,
  addScope,
  deleteProperties,
  isVersionValid,
  parseReadme,
  sortByName,
} from '../../../lib/utils';
import type {
  $NextFunctionVer,
  $RequestExtend,
  $ResponseExtend,
  $SidebarPackage,
} from '../../../types';
import { wrapPath } from './utils';

const getOrder = (order = 'asc') => {
  return order === 'asc';
};

// Builds the package name from the route params; returns null for a malformed
// `:scope` segment.
const resolveScopedName = (rawScope: string | undefined, pkg: string): string | null => {
  if (!rawScope) {
    return pkg;
  }
  if (rawScope[0] !== '@') {
    return null;
  }
  return addScope(rawScope.slice(1), pkg);
};

export type PackcageExt = Manifest & {
  author: any;
  dist?: { tarball: string };
};

function addPackageWebApi(storage: Storage, auth: Auth, config: Config): Router {
  const pkgRouter = Router();

  const checkAllow = (name, remoteUser): Promise<boolean> =>
    new Promise((resolve, reject): void => {
      try {
        const isLoginEnabled = _.isNil(config?.web?.login) || config?.web?.login === true;
        const anonymousRemoteUser: RemoteUser = createAnonymousRemoteUser();
        const remoteUserAccess = !isLoginEnabled ? anonymousRemoteUser : remoteUser;
        auth.allow_access({ packageName: name }, remoteUserAccess, (err, allowed): void => {
          if (err) {
            resolve(false);
          }
          resolve(allowed as boolean);
        });
      } catch (err) {
        reject(err);
      }
    });

  // Validates the route params and checks access before the handlers run.
  const canAccessScopedPackage = (
    req: $RequestExtend,
    _res: $ResponseExtend,
    next: $NextFunctionVer
  ): void => {
    const packageName = resolveScopedName(req.params.scope, req.params.package);
    if (packageName === null) {
      return next(ErrorCode.getNotFound());
    }
    req.scopedPackageName = packageName;
    auth.allow_access({ packageName }, req.remote_user, (err, allowed): void => {
      if (err) {
        return next(err);
      }
      if (allowed) {
        return next();
      }
      return next(ErrorCode.getForbidden());
    });
  };

  // Get list of all visible package
  pkgRouter.get(
    wrapPath(WebUrls.packages_all),
    function (req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer): void {
      storage.getLocalDatabase(async function (err, packages): Promise<void> {
        if (err) {
          throw err;
        }

        async function processPackages(packages: PackcageExt[] = []): Promise<any> {
          const permissions: PackcageExt[] = [];
          const packgesCopy = packages.slice();
          for (const pkg of packgesCopy) {
            const pkgCopy = { ...pkg };
            pkgCopy.author = formatAuthor(pkg.author);
            try {
              const isAllowed = await checkAllow(pkg.name, req.remote_user);
              if (isAllowed) {
                if (config.web) {
                  pkgCopy.author.avatar = generateGravatarUrl(
                    pkgCopy.author.email,
                    config.web.gravatar
                  );
                }
                if (!_.isNil(pkgCopy.dist) && !_.isNull(pkgCopy.dist.tarball)) {
                  pkgCopy.dist.tarball = getLocalRegistryTarballUri(
                    pkgCopy.dist.tarball,
                    pkg.name,
                    {
                      protocol: req.protocol,
                      headers: req.headers as any,
                      host: req.hostname,
                    },
                    config.url_prefix
                  );
                }
                permissions.push(pkgCopy);
              }
            } catch (err) {
              logger.error(
                { name: pkg.name, error: err },
                'permission process for @{name} has failed: @{error}'
              );
              throw err;
            }
          }

          return permissions;
        }

        const order: boolean = config.web ? getOrder(config.web?.sort_packages) : true;

        try {
          next(sortByName(await processPackages(packages), order));
        } catch (error: any) {
          next(ErrorCode.getInternalError(error.message));
        }
      });
    }
  );

  // Get package readme
  pkgRouter.get(
    [wrapPath(WebUrls.readme_package_scoped_version), wrapPath(WebUrls.readme_package_version)],
    canAccessScopedPackage,
    function (req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer): void {
      const packageName = req.scopedPackageName as string;

      storage.getPackage({
        name: packageName,
        uplinksLook: true,
        req,
        callback: function (err, info): void {
          if (err) {
            return next(err);
          }

          res.set(HEADER_TYPE.CONTENT_TYPE, HEADERS.TEXT_PLAIN);
          next(parseReadme(info.name, info.readme));
        },
      });
    }
  );

  pkgRouter.get(
    [wrapPath(WebUrls.sidebar_scopped_package), wrapPath(WebUrls.sidebar_package)],
    canAccessScopedPackage,
    function (req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer): void {
      const packageName = req.scopedPackageName as string;

      storage.getPackage({
        name: packageName,
        uplinksLook: true,
        keepUpLinkData: true,
        req,
        callback: function (err: Error, info: $SidebarPackage): void {
          if (_.isNil(err)) {
            const { v } = req.query;
            let sideBarInfo: any = _.clone(info);
            sideBarInfo.versions = convertDistRemoteToLocalTarballUrls(
              info,
              {
                protocol: req.protocol,
                headers: req.headers as any,
                host: req.hostname,
              },
              config.url_prefix
            ).versions;
            if (isVersionValid(info, v)) {
              // @ts-ignore
              sideBarInfo.latest = sideBarInfo.versions[v];
              sideBarInfo.latest.author = formatAuthor(sideBarInfo.latest.author);
            } else {
              sideBarInfo.latest = sideBarInfo.versions[info[DIST_TAGS].latest];
              if (sideBarInfo?.latest) {
                sideBarInfo.latest.author = formatAuthor(sideBarInfo.latest.author);
              } else {
                res.status(HTTP_STATUS.NOT_FOUND);
                res.end();
                return;
              }
            }
            sideBarInfo = deleteProperties(['readme', '_attachments', '_rev', 'name'], sideBarInfo);
            if (config.web) {
              sideBarInfo = addGravatarSupport(sideBarInfo, config.web.gravatar);
            } else {
              sideBarInfo = addGravatarSupport(sideBarInfo);
            }
            next(sideBarInfo);
          } else {
            res.status(HTTP_STATUS.NOT_FOUND);
            res.end();
          }
        },
      });
    }
  );

  return pkgRouter;
}

export default addPackageWebApi;
