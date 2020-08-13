import { SearchInstance } from '@verdaccio/store';
import { DIST_TAGS } from '@verdaccio/dev-commons';
import { Router } from 'express';
import { IAuth, $ResponseExtend, $RequestExtend, $NextFunctionVer, IStorageHandler } from '@verdaccio/dev-types';
import { Package } from '@verdaccio/types';

function addSearchWebApi(route: Router, storage: IStorageHandler, auth: IAuth): void {
  // Search package
  route.get('/search/:anything', function(req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer): void {
    const results: any = SearchInstance.query(req.params.anything);
    // FUTURE: figure out here the correct type
    const packages: any[] = [];

    const getPackageInfo = function(i): void {
      storage.getPackage({
        name: results[i].ref,
        uplinksLook: false,
        callback: (err, entry: Package): void => {
          if (!err && entry) {
            auth.allow_access({ packageName: entry.name }, req.remote_user, function(err, allowed): void {
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
