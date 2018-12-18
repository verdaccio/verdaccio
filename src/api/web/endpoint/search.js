// @flow

import Search from '../../../lib/search';
import {DIST_TAGS} from '../../../lib/utils';
import type {Router} from 'express';
import type {IAuth, $ResponseExtend, $RequestExtend, $NextFunctionVer, IStorageHandler} from '../../../../types';

function addSearchWebApi(route: Router, storage: IStorageHandler, auth: IAuth) {
  // Search package
  route.get('/search/:anything', function(req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer) {
    const results: any = Search.query(req.params.anything);
    const packages = [];

    const getPackageInfo = function(i) {
      storage.getPackage({
        name: results[i].ref,
        callback: (err, entry) => {
          if (!err && entry) {
            auth.allow_access({packageName: entry.name}, req.remote_user, function(err, allowed) {
              if (err || !allowed) {
                return;
              }

              packages.push(entry.versions[entry[DIST_TAGS].latest]);
            });
          }

          if (i >= results.length - 1) {
            next(packages);
          } else {
            getPackageInfo(i + 1);
          }
        },
      });
    };

    if (results.length) {
      getPackageInfo(0);
    } else {
      next([]);
    }
  });
}

export default addSearchWebApi;
