import { Router } from 'express';

import type { Auth } from '@verdaccio/auth';
import { WebUrls } from '@verdaccio/middleware';
import { SearchMemoryIndexer } from '@verdaccio/search-indexer';
import type { Manifest } from '@verdaccio/types';

import { DIST_TAGS } from '../../../lib/constants';
import type Storage from '../../../lib/storage';
import type { $NextFunctionVer, $RequestExtend, $ResponseExtend } from '../../../types';
import { wrapPath } from './utils';

const MAX_SEARCH_RESULTS = 20;

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
        const continueOrFinish = (): void => {
          if (packages.length >= MAX_SEARCH_RESULTS || i >= results.length - 1) {
            next(packages.slice(0, MAX_SEARCH_RESULTS));
          } else {
            getPackageInfo(i + 1);
          }
        };

        storage.getPackage({
          name: results[i].id,
          uplinksLook: false,
          callback: (err, entry: Manifest): void => {
            if (err || !entry) {
              continueOrFinish();
              return;
            }

            auth.allow_access(
              { packageName: entry.name },
              req.remote_user,
              function (err, allowed): void {
                if (!err && allowed) {
                  packages.push(entry.versions[entry[DIST_TAGS].latest]);
                }

                continueOrFinish();
              }
            );
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
