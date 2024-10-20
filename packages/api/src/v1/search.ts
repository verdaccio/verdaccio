import buildDebug from 'debug';
import _ from 'lodash';

import { Auth } from '@verdaccio/auth';
import { HTTP_STATUS, searchUtils } from '@verdaccio/core';
import { Storage } from '@verdaccio/store';
import { Manifest } from '@verdaccio/types';
import { Logger } from '@verdaccio/types';

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

  route.get('/-/v1/search', async (req, res, next) => {
    const { query, url } = req;
    let [size, from] = ['size', 'from'].map((k) => query[k]);
    let data;
    const abort = new AbortController();

    req.socket.on('close', function () {
      debug('search web aborted');
      abort.abort();
    });

    size = parseInt(size, 10) || 20;
    from = parseInt(from, 10) || 0;

    try {
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
        .filter((i) => !_.isNull(i))
        .slice(from, size);
      logger.debug(`search results ${final?.length}`);

      const response: searchUtils.SearchResults = {
        objects: final,
        total: final.length,
        time: new Date().toUTCString(),
      };

      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      logger.error({ error }, 'search endpoint has failed @{error.message}');
      next(next);
      return;
    }
  });
}
