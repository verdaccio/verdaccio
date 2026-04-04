import buildDebug from 'debug';

import type { Auth } from '@verdaccio/auth';
import type { searchUtils } from '@verdaccio/core';
import { HTTP_STATUS } from '@verdaccio/core';
import { SEARCH_API_ENDPOINTS } from '@verdaccio/middleware';
import type { Storage } from '@verdaccio/store';
import type { Logger, Manifest } from '@verdaccio/types';

const debug = buildDebug('verdaccio:api:search');

/**
 * Endpoint for npm search v1
 * Empty value
 *  - {"objects":[],"total":0,"time":"Sun Jul 25 2021 14:09:11 GMT+0000 (Coordinated Universal Time)"}
 * req: 'GET /-/v1/search?text=react&size=20&frpom=0&quality=0.65&popularity=0.98&maintenance=0.5'
 */
export default function (route, auth: Auth, storage: Storage, logger: Logger): void {
  function checkAccess(pkg: any, auth: any, remoteUser): Promise<Manifest | null> {
    return new Promise((resolve, reject) => {
      auth.allow_access({ packageName: pkg?.package?.name }, remoteUser, function (err, allowed) {
        if (err) {
          if (err.status && String(err.status).match(/^4\d\d$/)) {
            // auth plugin returns 4xx user error,
            // that's equivalent of !allowed basically
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

  route.get(SEARCH_API_ENDPOINTS.search, async (req, res, next) => {
    const { query, url } = req;
    let [size, from] = ['size', 'from'].map((k) => query[k]);
    let data;
    const abort = new AbortController();
    const onClientClose = (): void => {
      debug('search web aborted');
      abort.abort();
    };
    req.socket.on('close', onClientClose);

    try {
      size = parseInt(size ?? '20', 10);
      from = parseInt(from ?? '0', 10);

      debug('storage search initiated');
      data = await storage.search({
        query,
        url,
        abort,
      });
      debug('storage items tota: %o', data.length);
      const checkAccessPromises: searchUtils.SearchItemPkg[] = await Promise.all(
        data.map((pkgItem) => {
          return checkAccess(pkgItem, auth, req.remote_user);
        })
      );

      const final: searchUtils.SearchItemPkg[] = checkAccessPromises
        .filter((i) => i !== null)
        .slice(from, from + size);
      logger.debug(`search results ${final?.length}`);

      const response: searchUtils.SearchResults = {
        objects: final,
        total: final.length,
        time: new Date().toUTCString(),
      };

      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      logger.error({ error }, 'search endpoint has failed @{error.message}');
      next(error);
      return;
    } finally {
      req.socket.off('close', onClientClose);
    }
  });
}
