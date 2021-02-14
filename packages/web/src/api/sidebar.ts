import buildDebug from 'debug';
import _ from 'lodash';
import {
  convertDistRemoteToLocalTarballUrls,
  isVersionValid,
  formatAuthor,
} from '@verdaccio/utils';
import { HTTP_STATUS, DIST_TAGS } from '@verdaccio/commons-api';
import { allow, $RequestExtend, $ResponseExtend, $NextFunctionVer } from '@verdaccio/middleware';

import { Router } from 'express';
import { IAuth } from '@verdaccio/auth';
import { IStorageHandler } from '@verdaccio/store';
import { Config, Package, Version } from '@verdaccio/types';

import { addGravatarSupport, addScope, AuthorAvatar, deleteProperties } from '../utils/web-utils';

export { $RequestExtend, $ResponseExtend, $NextFunctionVer }; // Was required by other packages

export type PackageExt = Package & { author: AuthorAvatar; dist?: { tarball: string } };

export type $SidebarPackage = Package & { latest: Version };
const debug = buildDebug('verdaccio:web:api:sidebar');

function addSidebarWebApi(
  route: Router,
  config: Config,
  storage: IStorageHandler,
  auth: IAuth
): void {
  debug('initialized sidebar web api');
  const can = allow(auth);
  // Get package readme
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

export default addSidebarWebApi;
