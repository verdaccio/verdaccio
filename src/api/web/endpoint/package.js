// @flow

import _ from 'lodash';
import {addScope, addGravatarSupport, deleteProperties, sortByName, DIST_TAGS, parseReadme} from '../../../lib/utils';
import {allow} from '../../middleware';
import logger from '../../../lib/logger';
import type {Router} from 'express';
import type {
  IAuth,
  $ResponseExtend,
  $RequestExtend,
  $NextFunctionVer,
  IStorageHandler,
  $SidebarPackage} from '../../../../types';


function addPackageWebApi(route: Router, storage: IStorageHandler, auth: IAuth) {
  const can = allow(auth);

  const checkAllow = (name, remoteUser) => new Promise((resolve, reject) => {
    try {
      auth.allow_access(name, remoteUser, (err, allowed) => {
        if (err) {
          resolve(false);
        } else {
          resolve(allowed);
        }
      });
    } catch (err) {
      reject(err);
    }
  });

  // Get list of all visible package
  route.get('/packages', function(req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer) {
    storage.getLocalDatabase(async function(err, packages) {
      if (err) {
        throw err;
      }

      async function processPermissionsPackages(packages) {
        const permissions = [];
        for (let pkg of packages) {
          try {
            if (await checkAllow(pkg.name, req.remote_user)) {
              permissions.push(pkg);
            }
          } catch (err) {
            logger.logger.error({name: pkg.name, error: err}, 'permission process for @{name} has failed: @{error}');
            throw err;
          }
        }

        return permissions;
      }

      next(sortByName(await processPermissionsPackages(packages)));
    });
  });

  // Get package readme
  route.get('/package/readme/(@:scope/)?:package/:version?', can('access'),
  function(req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer) {
    const packageName = req.params.scope ? addScope(req.params.scope, req.params.package) : req.params.package;

    storage.getPackage({
      name: packageName,
      req,
      callback: function(err, info) {
        if (err) {
          return next(err);
        }

        res.set('Content-Type', 'text/plain');
        const readme = parseReadme(info.name, info.readme);

        next(readme);
      },
    });
  });

  route.get('/sidebar/(@:scope/)?:package',
  function(req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer) {
    const packageName: string = req.params.scope ? addScope(req.params.scope, req.params.package) : req.params.package;

    storage.getPackage({
      name: packageName,
      keepUpLinkData: true,
      req,
      callback: function(err: Error, info: $SidebarPackage) {
        if (_.isNil(err)) {
          let sideBarInfo: any = _.clone(info);
          sideBarInfo.latest = info.versions[info[DIST_TAGS].latest];
          sideBarInfo = deleteProperties(['readme', '_attachments', '_rev', 'name'], sideBarInfo);
          sideBarInfo = addGravatarSupport(sideBarInfo);
          next(sideBarInfo);
        } else {
          res.status(404);
          res.end();
        }
      },
    });
  });
}

export default addPackageWebApi;
