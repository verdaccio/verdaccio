import buildDebug from 'debug';
import { Router } from 'express';
import { URLSearchParams } from 'node:url';

import type { Auth } from '@verdaccio/auth';
import { errorUtils } from '@verdaccio/core';
import type { SearchQuery } from '@verdaccio/core/src/search-utils';
import { WebUrls } from '@verdaccio/middleware';
import type { Storage } from '@verdaccio/store';
import type { Manifest } from '@verdaccio/types';

import type { $NextFunctionVer, $RequestExtend, $ResponseExtend } from './package';

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
    WebUrls.search,
    async function (
      req: $RequestExtend,
      _res: $ResponseExtend,
      next: $NextFunctionVer
    ): Promise<void> {
      try {
        const abort = new AbortController();
        const onClose = () => {
          debug('search web aborted');
          abort.abort();
        };
        req.socket.on('close', onClose);
        _res.on('finish', () => {
          req.socket.removeListener('close', onClose);
        });
        const text: string = (req.params.anything as string) ?? '';
        // These values are declared as optimal by npm cli
        // FUTURE: could be overwritten by ui settings.
        const size = 20;
        const from = 0;
        const query: SearchQuery = {
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
        const data = await storage?.search({
          query,
          url: `/-/v1/search?${urlParams.toString()}`,
          abort,
        });
        const checkAccessPromises = await Promise.all(
          data.map((pkgItem) => {
            return checkAccess(pkgItem, auth, req.remote_user);
          })
        );

        const final = checkAccessPromises
          .filter((i): i is Manifest => i !== null)
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
