import type { Auth } from '@verdaccio/auth';
import type { searchUtils } from '@verdaccio/core';
import { HTTP_STATUS, errorUtils } from '@verdaccio/core';
import { SEARCH_API_ENDPOINTS, rateLimit } from '@verdaccio/middleware';
import type { Storage } from '@verdaccio/store';
import type { Config, Logger } from '@verdaccio/types';

const DEFAULT_SIZE = 20;
// the public npm registry caps page size at 250 as well
const MAX_SIZE = 250;
// upper bound for the pagination offset so a single request cannot force
// an access check on an arbitrarily large slice of the catalog
const MAX_FROM = 10_000;
// access checks run in batches so the scan can stop early once the
// requested page is filled
const CHECK_ACCESS_BATCH_SIZE = 50;
const SEARCH_TIMEOUT_MS = 30_000;

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
  function checkAccess(
    pkg: any,
    auth: any,
    remoteUser
  ): Promise<searchUtils.SearchPackageItem | null> {
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
      const safeQuery = { ...query, size, from };
      const abort = new AbortController();
      const onClientClose = (): void => {
        if (!res.writableEnded) abort.abort(new Error('search client disconnected'));
      };
      res.on('close', onClientClose);
      const timeout = setTimeout(() => {
        abort.abort(errorUtils.getServiceUnavailable('search pagination timed out'));
      }, SEARCH_TIMEOUT_MS);
      timeout.unref();
      let onAbort: () => void;
      const cancelled = new Promise<never>((_resolve, reject) => {
        onAbort = () => reject(abort.signal.reason);
        abort.signal.addEventListener('abort', onAbort, { once: true });
      });

      try {
        const requested = from + size;
        const access = new Map<string, Promise<boolean>>();
        const collect = async (): Promise<searchUtils.SearchPackageItem[]> => {
          if (size === 0) return [];
          let allowed: searchUtils.SearchPackageItem[] = [];
          for await (const data of storage.searchPages({ query: safeQuery, url, abort })) {
            abort.signal.throwIfAborted();
            allowed = [];
            for (
              let i = 0;
              i < data.length && allowed.length < requested;
              i += CHECK_ACCESS_BATCH_SIZE
            ) {
              abort.signal.throwIfAborted();
              const batch = await Promise.race([
                Promise.all(
                  data.slice(i, i + CHECK_ACCESS_BATCH_SIZE).map(async (item) => {
                    const name = item.package.name;
                    let permission = access.get(name);
                    if (!permission) {
                      permission = checkAccess(item, auth, req.remote_user).then(
                        (result) => result !== null
                      );
                      access.set(name, permission);
                    }
                    return (await permission) ? item : null;
                  })
                ),
                cancelled,
              ]);
              for (const item of batch) if (item !== null) allowed.push(item);
            }
            if (allowed.length >= requested) break;
          }
          abort.signal.throwIfAborted();
          return allowed.slice(from, requested);
        };
        const final = await Promise.race([collect(), cancelled]);
        logger.debug(`search results ${final?.length}`);

        const response = {
          objects: final,
          total: final.length,
          time: new Date().toUTCString(),
        };

        res.status(HTTP_STATUS.OK).json(response);
      } catch (error) {
        if (res.destroyed) return;
        logger.error({ error }, 'search endpoint has failed @{error.message}');
        next(error);
        return;
      } finally {
        clearTimeout(timeout);
        abort.signal.removeEventListener('abort', onAbort!);
        res.off('close', onClientClose);
        abort.abort();
      }
    }
  );
}
