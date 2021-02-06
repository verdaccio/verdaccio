import buildDebug from 'debug';
import _ from 'lodash';
import {
  formatAuthor,
  convertDistRemoteToLocalTarballUrls,
  getLocalRegistryTarballUri,
  isVersionValid,
} from '@verdaccio/utils';
import sanitizyReadme from '@verdaccio/readme';

import { allow, $RequestExtend, $ResponseExtend, $NextFunctionVer } from '@verdaccio/middleware';
import { DIST_TAGS, HEADER_TYPE, HEADERS, HTTP_STATUS } from '@verdaccio/commons-api';
import { logger } from '@verdaccio/logger';
import { Router } from 'express';
import { IAuth } from '@verdaccio/auth';
import { IStorageHandler } from '@verdaccio/store';
import { Config, Package, RemoteUser, Version } from '@verdaccio/types';

import { addGravatarSupport, AuthorAvatar, parseReadme } from '../web-utils';
import { generateGravatarUrl } from '../user';
import { deleteProperties, addScope, sortByName } from '../web-utils2';
import { addGravatarSupport, AuthorAvatar, parseReadme } from '../utils/web-utils';
import { generateGravatarUrl } from '../utils/user';

export type $SidebarPackage = Package & { latest: Version };
export { $RequestExtend, $ResponseExtend, $NextFunctionVer }; // Was required by other packages

const getOrder = (order = 'asc') => {
  return order === 'asc';
};

export type PackageExt = Package & { author: AuthorAvatar; dist?: { tarball: string } };

const debug = buildDebug('verdaccio:web:api:package');

function addPackageWebApi(
  route: Router,
  storage: IStorageHandler,
  auth: IAuth,
  config: Config
): void {
  debug('initialized package web api');
  const can = allow(auth);

  const checkAllow = (name: string, remoteUser: RemoteUser): Promise<boolean> =>
    new Promise((resolve, reject): void => {
      try {
        auth.allow_access({ packageName: name }, remoteUser, (err, allowed): void => {
          if (err) {
            resolve(false);
          }
          resolve(allowed);
        });
      } catch (err) {
        reject(err);
      }
    });

  // Get list of all visible package
  route.get(
    '/packages',
    function (req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer): void {
      debug('hit package web api %o');
      storage.getLocalDatabase(async function (err, packages): Promise<void> {
        if (err) {
          throw err;
        }
        async function processPackages(packages: PackageExt[] = []): Promise<PackageExt[]> {
          const permissions: PackageExt[] = [];
          const packagesToProcess = packages.slice();
          debug('process packages %o', packagesToProcess);
          for (const pkg of packagesToProcess) {
            const pkgCopy = { ...pkg };
            pkgCopy.author = formatAuthor(pkg.author);
            try {
              if (await checkAllow(pkg.name, req.remote_user)) {
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
                    req,
                    config.url_prefix
                  );
                }
                permissions.push(pkgCopy);
              }
            } catch (err) {
              debug('process packages error %o', err);
              logger.logger.error(
                { name: pkg.name, error: err },
                'permission process for @{name} has failed: @{error}'
              );
              throw err;
            }
          }

          return permissions;
        }

        const order = getOrder(config?.web?.sort_packages);
        debug('order %o', order);

        try {
          next(sortByName(await processPackages(packages), order));
        } catch (error) {
          next(error);
        }
      });
    }
  );

  // Get package readme
  route.get(
    '/package/readme/(@:scope/)?:package/:version?',
    can('access'),
    function (req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer): void {
      const packageName = req.params.scope
        ? addScope(req.params.scope, req.params.package)
        : req.params.package;

      storage.getPackage({
        name: packageName,
        uplinksLook: true,
        req,
        callback: function (err, info): void {
          if (err) {
            return next(err);
          }

          res.set(HEADER_TYPE.CONTENT_TYPE, HEADERS.TEXT_PLAIN);
          try {
            next(parseReadme(info.name, info.readme));
          } catch {
            next(sanitizyReadme('ERROR: No README data found!'));
          }
        },
      });
    }
  );

  route.get(
    '/sidebar/(@:scope/)?:package',
    can('access'),
    function (req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer): void {
      const packageName: string = req.params.scope
        ? addScope(req.params.scope, req.params.package)
        : req.params.package;

      storage.getPackage({
        name: packageName,
        uplinksLook: true,
        keepUpLinkData: true,
        req,
        callback: function (err: Error, info: $SidebarPackage): void {
          if (_.isNil(err)) {
            const { v } = req.query;
            let sideBarInfo = _.clone(info);
            sideBarInfo.versions = convertDistRemoteToLocalTarballUrls(
              info,
              req,
              config.url_prefix
            ).versions;
            if (typeof v === 'string' && isVersionValid(info, v)) {
              sideBarInfo.latest = sideBarInfo.versions[v];
              sideBarInfo.latest.author = formatAuthor(sideBarInfo.latest.author);
            } else {
              sideBarInfo.latest = sideBarInfo.versions[info[DIST_TAGS].latest];
              sideBarInfo.latest.author = formatAuthor(sideBarInfo.latest.author);
            }
            sideBarInfo = deleteProperties(['readme', '_attachments', '_rev', 'name'], sideBarInfo);
            const authorAvatar = config.web
              ? addGravatarSupport(sideBarInfo, config.web.gravatar)
              : addGravatarSupport(sideBarInfo);
            next(authorAvatar);
          } else {
            res.status(HTTP_STATUS.NOT_FOUND);
            res.end();
          }
        },
      });
    }
  );
}

export default addPackageWebApi;
