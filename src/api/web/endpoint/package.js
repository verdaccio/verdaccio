// @flow

import _ from 'lodash';
import {addScope, addGravatarSupport, deleteProperties, sortByName, DIST_TAGS} from '../../../lib/utils';
import {allow} from '../../middleware';
import async from 'async';
import marked from 'marked';
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

  // Get list of all visible package
  route.get('/packages', function(req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer) {
    storage.getLocalDatabase(function(err, packages) {
      if (err) {
        // that function shouldn't produce any
        throw err;
      }

      async.filterSeries(
        packages,
        function(pkg, cb) {
          auth.allow_access(pkg.name, req.remote_user, function(err, allowed) {
            setImmediate(function() {
              if (err) {
                cb(null, false);
              } else {
                cb(err, allowed);
              }
            });
          });
        },
        function(err, packages) {
          if (err) {
            throw err;
          }

          next(sortByName(packages));
        }
      );
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
        next(marked(info.readme || 'ERROR: No README data found!'));
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
          const sideBarInfo: any = _.clone(info);
          sideBarInfo.latest = info.versions[info[DIST_TAGS].latest];

          info = deleteProperties(['readme', 'versions'], sideBarInfo);
          info = addGravatarSupport(sideBarInfo);
          next(info);
        } else {
          res.status(404);
          res.end();
        }
      },
    });
  });
}

export default addPackageWebApi;
