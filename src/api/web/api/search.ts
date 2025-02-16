import { Router } from 'express';

import { WebUrls } from '@verdaccio/middleware';
import { SearchMemoryIndexer } from '@verdaccio/search-indexer';
import { Manifest } from '@verdaccio/types';

import Auth from '../../../lib/auth';
import { DIST_TAGS } from '../../../lib/constants';
import Storage from '../../../lib/storage';
import { $NextFunctionVer, $RequestExtend, $ResponseExtend } from '../../../types';
import { wrapPath } from './utils';

function addSearchWebApi(storage: Storage, auth: Auth): Router {
  const route = Router();
  // Search package
  route.get(
    wrapPath(WebUrls.search),
    async function (
      req: $RequestExtend,
      _res: $ResponseExtend,
      next: $NextFunctionVer
    ): Promise<void> {
      const term = req.params.anything;
      const indexer = (await SearchMemoryIndexer.query(term)) as any;
      const packages: any[] = [];
      const results = indexer.hits;

      const getPackageInfo = function (i): void {
        storage.getPackage({
          name: results[i].id,
          uplinksLook: false,
          callback: (err, entry: Manifest): void => {
            if (!err && entry) {
              auth.allow_access(
                { packageName: entry.name },
                req.remote_user,
                function (err, allowed): void {
                  if (err || !allowed) {
                    return;
                  }

                  packages.push(entry.versions[entry[DIST_TAGS].latest]);
                }
              );
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
    }
  );

  return route;
}

export default addSearchWebApi;
