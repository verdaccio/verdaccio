import { Router } from 'express';
import _ from 'lodash';

import { allow } from '@verdaccio/middleware';
import {
  convertDistRemoteToLocalTarballUrls,
  getLocalRegistryTarballUri,
} from '@verdaccio/tarball';
import { Config, Manifest } from '@verdaccio/types';
import { generateGravatarUrl } from '@verdaccio/utils';

import Auth from '../../../lib/auth';
import { DIST_TAGS, HEADERS, HEADER_TYPE, HTTP_STATUS } from '../../../lib/constants';
import { logger } from '../../../lib/logger';
import Storage from '../../../lib/storage';
import {
  ErrorCode,
  addGravatarSupport,
  addScope,
  deleteProperties,
  formatAuthor,
  isVersionValid,
  parseReadme,
  sortByName,
} from '../../../lib/utils';
import { $NextFunctionVer, $RequestExtend, $ResponseExtend, $SidebarPackage } from '../../../types';

const getOrder = (order = 'asc') => {
  return order === 'asc';
};

export type PackcageExt = Manifest & { author: any; dist?: { tarball: string } };

function addPackageWebApi(pkgRouter: Router, storage: Storage, auth: Auth, config: Config): Router {
  const can = allow(auth, {
    beforeAll: (params, message) => {
      logger.debug(params, message);
    },
    afterAll: (params, message) => logger.debug(params, message),
  });

  const checkAllow = (name, remoteUser): Promise<boolean> =>
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
  pkgRouter.get(
    '/-/verdaccio/data/packages',
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

        const { web } = config;
        // @ts-ignore
        const order: boolean = config.web ? getOrder(web.sort_packages) : true;

        try {
          next(sortByName(await processPackages(packages), order));
        } catch (error) {
          next(ErrorCode.getInternalError());
        }
      });
    }
  );

  // Get package readme
  pkgRouter.get(
    [
      '/-/verdaccio/data/package/readme/@:scope/:package/:version?',
      '/-/verdaccio/data/package/readme/:package/:version?',
    ],
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
    [
      '/-/verdaccio/data/sidebar/:scope/:package',
      '/-/verdaccio/data/sidebar/:package'
    ],
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
