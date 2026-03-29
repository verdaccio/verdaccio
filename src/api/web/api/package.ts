import { Router } from 'express';
import _ from 'lodash';

import { createAnonymousRemoteUser } from '@verdaccio/config';
import { WebUrls, allow } from '@verdaccio/middleware';
import {
  convertDistRemoteToLocalTarballUrls,
  getLocalRegistryTarballUri,
} from '@verdaccio/tarball';
import type { Config, Manifest, RemoteUser } from '@verdaccio/types';
import { cryptoUtils } from '@verdaccio/core';

import type Auth from '../../../lib/auth';
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

const AVATAR_PROVIDER = 'https://www.gravatar.com/avatar/';
const GENERIC_AVATAR =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg height="100" viewBox="-27 24 100 100" width="100" xmlns="http://www.w3.org/2000/svg"><circle cx="23" cy="74" r="50" fill="#F5EEE5"/></svg>'
  );

const DEFAULT_USER = 'Anonymous';

function formatAuthor(author: any): any {
  let authorDetails = { name: DEFAULT_USER, email: '', url: '' };
  if (author == null) return authorDetails;
  if (typeof author === 'string') authorDetails = { ...authorDetails, name: author };
  if (typeof author === 'object') authorDetails = { ...authorDetails, ...author };
  return authorDetails;
}

function generateGravatarUrl(email?: string | void, online = true): string {
  if (online && typeof email === 'string' && email.length > 0) {
    return `${AVATAR_PROVIDER}${cryptoUtils.stringToMD5(email.trim().toLocaleLowerCase())}`;
  }
  return GENERIC_AVATAR;
}

function normalizeContributors(contributors: any): any[] {
  if (contributors == null) return [];
  if (!Array.isArray(contributors)) return [contributors];
  if (typeof contributors === 'string') return [{ name: contributors }];
  return contributors;
}

function addGravatarSupport(pkgInfo: any, online = true): any {
  const pkgInfoCopy = { ...pkgInfo };
  const author = pkgInfo?.latest?.author ?? null;
  const contributors = normalizeContributors(pkgInfo?.latest?.contributors ?? []);
  const maintainers = pkgInfo?.latest?.maintainers ?? [];

  if (author && typeof author === 'object') {
    pkgInfoCopy.latest.author.avatar = generateGravatarUrl(author.email, online);
  }
  if (author && typeof author === 'string') {
    pkgInfoCopy.latest.author = { avatar: GENERIC_AVATAR, email: '', author };
  }
  if (contributors.length > 0) {
    pkgInfoCopy.latest.contributors = contributors.map((contributor: any) => {
      if (typeof contributor === 'object') {
        contributor.avatar = generateGravatarUrl(contributor.email, online);
      } else if (typeof contributor === 'string') {
        contributor = { avatar: GENERIC_AVATAR, email: contributor, name: contributor };
      }
      return contributor;
    });
  }
  if (maintainers.length > 0) {
    pkgInfoCopy.latest.maintainers = maintainers.map((maintainer: any) => {
      maintainer.avatar = generateGravatarUrl(maintainer.email, online);
      return maintainer;
    });
  }
  return pkgInfoCopy;
}

const getOrder = (order = 'asc') => {
  return order === 'asc';
};

export type PackcageExt = Manifest & { author: any; dist?: { tarball: string } };

function addPackageWebApi(storage: Storage, auth: Auth, config: Config): Router {
  /* eslint new-cap:off */
  const pkgRouter = Router();
  const can = allow(auth, {
    beforeAll: (params, message) => {
      logger.debug(params, message);
    },
    afterAll: (params, message) => logger.debug(params, message),
  });

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
                    { protocol: req.protocol, headers: req.headers as any, host: req.hostname },
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
    can('access'),
    function (req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer): void {
      const rawScope = req.params.scope; // May include '@'
      const scope = rawScope ? rawScope.slice(1) : null; // Remove '@' if present
      const packageName = scope ? addScope(scope, req.params.package) : req.params.package;

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
    can('access'),
    function (req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer): void {
      const rawScope = req.params.scope; // May include '@'
      const scope = rawScope ? rawScope.slice(1) : null; // Remove '@' if present
      const packageName: string = scope ? addScope(scope, req.params.package) : req.params.package;

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
              { protocol: req.protocol, headers: req.headers as any, host: req.hostname },
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
