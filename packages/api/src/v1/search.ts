import buildDebug from 'debug';
import _ from 'lodash';

import { Auth } from '@verdaccio/auth';
import { HTTP_STATUS, searchUtils } from '@verdaccio/core';
import { SEARCH_API_ENDPOINTS } from '@verdaccio/middleware';
import { Storage } from '@verdaccio/store';
import { Logger } from '@verdaccio/types';

const debug = buildDebug('verdaccio:api:search');

/**
 * Endpoint for npm search v1
 * Empty value
 *  - {"objects":[],"total":0,"time":"Sun Jul 25 2021 14:09:11 GMT+0000 (Coordinated Universal Time)"}
 * req: 'GET /-/v1/search?text=react&size=20&frpom=0&quality=0.65&popularity=0.98&maintenance=0.5'
 */
export default function (route, auth: Auth, storage: Storage, logger: Logger): void {
  function checkAccess(
    item: searchUtils.SearchPackageItem,
    auth: any,
    remoteUser
  ): Promise<searchUtils.SearchPackageItem | null> {
    return new Promise((resolve, reject) => {
      auth.allow_access({ packageName: item?.package?.name }, remoteUser, function (err, allowed) {
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
          return resolve(allowed ? item : null);
        }
      });
    });
  }

  route.get(SEARCH_API_ENDPOINTS.search, async (req, res, next) => {
    const { query, url } = req;
    let [size, from] = ['size', 'from'].map((k) => query[k]);
    const abort = new AbortController();

    req.socket.on('error', function () {
      debug('search web aborted');
      abort.abort();
    });

    size = parseInt(size, 10) || 20;
    from = parseInt(from, 10) || 0;
    const end = from + size;

    try {
      debug('storage search initiated');
      const results: searchUtils.SearchResults = await storage.search({
        query,
        url,
        abort,
      });
      debug('storage items total: %o', results.total);

      const checkAccessPromises: (searchUtils.SearchPackageItem | null)[] = await Promise.all(
        results.objects.map((searchItem: searchUtils.SearchPackageItem) => {
          return checkAccess(searchItem, auth, req.remote_user);
        })
      );

      const finalItems: searchUtils.SearchPackageItem[] = checkAccessPromises
        .filter((i) => !_.isNull(i))
        .slice(from, end) as searchUtils.SearchPackageItem[];
      logger.debug(`search results ${finalItems?.length}`);

      // Adjust the total returned by the number that the user does not have access to.
      results.total -= results.objects.length - finalItems.length;
      results.objects = finalItems;

      res.status(HTTP_STATUS.OK).json(results);
    } catch (error) {
      logger.error({ error }, 'search endpoint has failed @{error.message}');
      next(next);
      return;
    }
  });
}
