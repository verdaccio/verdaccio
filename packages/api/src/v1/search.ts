import buildDebug from 'debug';

import type { Auth } from '@verdaccio/auth';
import type { searchUtils } from '@verdaccio/core';
import { HTTP_STATUS } from '@verdaccio/core';
import { SEARCH_API_ENDPOINTS, rateLimit } from '@verdaccio/middleware';
import type { Storage } from '@verdaccio/store';
import type { Config, Logger } from '@verdaccio/types';

const debug = buildDebug('verdaccio:api:search');

const DEFAULT_SIZE = 20;
// the public npm registry caps page size at 250 as well
const MAX_SIZE = 250;
// upper bound for the pagination offset so a single request cannot force
// an access check on an arbitrarily large slice of the catalog
const MAX_FROM = 10_000;
// access checks run in batches so the scan can stop early once the
// requested page is filled
const CHECK_ACCESS_BATCH_SIZE = 50;

function parseQueryInt(value: unknown, defaultValue: number, max: number): number {
  const parsed = Number.parseInt(String(value), 10);
  if (Number.isNaN(parsed) || parsed < 0) {
    return defaultValue;
  }
  return Math.min(parsed, max);
}

/**
 * Endpoint for npm search v1
 * Empty value
 *  - {"objects":[],"total":0,"time":"Sun Jul 25 2021 14:09:11 GMT+0000 (Coordinated Universal Time)"}
 * req: 'GET /-/v1/search?text=react&size=20&frpom=0&quality=0.65&popularity=0.98&maintenance=0.5'
 */
export default function (
  route,
  auth: Auth,
  storage: Storage,
  config: Config,
  logger: Logger
): void {
  function checkAccess(pkg: any, auth: any, remoteUser): Promise<searchUtils.SearchItemPkg | null> {
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

  route.get(
    SEARCH_API_ENDPOINTS.search,
    rateLimit(config?.userRateLimit),
    async (req, res, next) => {
      const { query, url } = req;
      // `size` and `from` are attacker-controlled: clamp them so a single
      // request cannot demand unbounded work
      const size = parseQueryInt(query.size, DEFAULT_SIZE, MAX_SIZE);
      const from = parseQueryInt(query.from, 0, MAX_FROM);
      // rebuild the query and relative url from the clamped values so the
      // bounds hold end-to-end: storage plugins read `query.size`/`query.from`
      // and the uplink proxy forwards `url` verbatim to the remote registry
      const safeQuery = { ...query, size, from };
      const searchParams = new URLSearchParams(query);
      searchParams.set('size', String(size));
      searchParams.set('from', String(from));
      const safeUrl = `${url.split('?')[0]}?${searchParams.toString()}`;
      const abort = new AbortController();
      const onClientClose = (): void => {
        debug('search web aborted');
        abort.abort();
      };
      req.socket.on('close', onClientClose);

      try {
        debug('storage search initiated');
        const data = await storage.search({
          query: safeQuery,
          url: safeUrl,
          abort,
        });
        debug('storage items total: %o', data.length);

        // evaluate access in batches and stop as soon as the requested page
        // is filled, instead of running an auth check on every result
        const requested = from + size;
        const allowed: searchUtils.SearchItemPkg[] = [];
        for (
          let i = 0;
          i < data.length && allowed.length < requested && !abort.signal.aborted;
          i += CHECK_ACCESS_BATCH_SIZE
        ) {
          const batch = await Promise.all(
            data
              .slice(i, i + CHECK_ACCESS_BATCH_SIZE)
              .map((pkgItem) => checkAccess(pkgItem, auth, req.remote_user))
          );
          for (const item of batch) {
            if (item !== null) {
              allowed.push(item);
            }
          }
        }

        const final: searchUtils.SearchItemPkg[] = allowed.slice(from, requested);
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
    }
  );
}
