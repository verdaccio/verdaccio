import buildDebug from 'debug';
import { Router } from 'express';
import _ from 'lodash';

import { Auth } from '@verdaccio/auth';
import { errorUtils, searchUtils } from '@verdaccio/core';
import { Manifest } from '@verdaccio/types';

import Storage from '../../../lib/storage';
import { $NextFunctionVer, $RequestExtend, $ResponseExtend } from '../../../types';

const debug = buildDebug('verdaccio:web:api:search');

function checkAccess(pkg: any, auth: any, remoteUser): Promise<Manifest | null> {
  return new Promise((resolve, reject) => {
    auth.allow_access({ packageName: pkg?.package?.name }, remoteUser, function (err, allowed) {
      if (err) {
        if (err.status && String(err.status).match(/^4\d\d$/)) {
          // auth plugin returns 4xx user error,
          // that's equivalent of !allowed basically
          allowed = false;
          return resolve(null);
        } else {
          reject(err);
        }
      } else {
        return resolve(allowed ? pkg : null);
      }
    });
  });
}

function addSearchWebApi(storage: Storage, auth: Auth): Router {
  const router = Router(); /* eslint new-cap: 0 */
  router.get(
    '/-/verdaccio/data/search/:anything',
    async function (
      req: $RequestExtend,
      res: $ResponseExtend,
      next: $NextFunctionVer
    ): Promise<void> {
      try {
        let data;
        const abort = new AbortController();
        req.socket.on('close', function () {
          debug('search web aborted');
          abort.abort();
        });
        const text: string = (req.params.anything as string) ?? '';
        // These values are declared as optimal by npm cli
        // FUTURE: could be overwritten by ui settings.
        const size = 20;
        const from = 0;
        const query: searchUtils.SearchQuery = {
          from: 0,
          maintenance: 0.5,
          popularity: 0.98,
          quality: 0.65,
          size: 20,
          text,
        };
        // @ts-ignore
        const urlParams = new URLSearchParams(query);
        debug('search web init');
        data = await storage?.search({
          query,
          url: `/-/v1/search?${urlParams.toString()}`,
          abort,
        });
        const checkAccessPromises: searchUtils.SearchItemPkg[] = await Promise.all(
          data.map((pkgItem) => {
            return checkAccess(pkgItem, auth, req.remote_user);
          })
        );

        const final: searchUtils.SearchItemPkg[] = checkAccessPromises
          .filter((i) => !_.isNull(i))
          .slice(from, size);

        next(final);
      } catch (err: any) {
        next(errorUtils.getInternalError(err.message));
      }
    }
  );
  return router;
}

export default addSearchWebApi;
