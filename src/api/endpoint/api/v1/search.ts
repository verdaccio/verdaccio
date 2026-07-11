import _ from 'lodash';
import semver from 'semver';

import { SEARCH_API_ENDPOINTS, rateLimit } from '@verdaccio/middleware';
import type { Config, Manifest } from '@verdaccio/types';

import { HTTP_STATUS } from '../../../../lib/constants';
import { logger } from '../../../../lib/logger';

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

type PublisherMaintainer = {
  username: string;
  email: string;
};

type PackageResults = {
  name: string;
  scope: string;
  version: string;
  description: string;
  date: string;
  links: {
    npm: string;
    homepage?: string;
    repository?: string;
    bugs?: string;
  };
  author: { name: string };
  publisher: PublisherMaintainer;
  maintainer: PublisherMaintainer;
};

type SearchResult = {
  package: PackageResults;
  flags?: { unstable: boolean | void };
  local?: boolean;
  score: {
    final: number;
    detail: {
      quality: number;
      popularity: number;
      maintenance: number;
    };
  };
  searchScore: number;
};

type SearchResults = {
  objects: SearchResult[];
  total: number;
  time: string;
};

const personMatch = (person, search) => {
  if (typeof person === 'string') {
    return person.includes(search);
  }

  if (typeof person === 'object') {
    for (const field of Object.values(person)) {
      if (typeof field === 'string' && field.includes(search)) {
        return true;
      }
    }
  }

  return false;
};

const matcher = function (query) {
  const match = query.match(/author:(.*)/);
  if (match !== null) {
    return function (pkg) {
      return personMatch(pkg.author, match[1]);
    };
  }

  // TODO: maintainer, keywords, boost-exact
  // TODO implement some scoring system for freetext
  return (pkg) => {
    return ['name', 'displayName', 'description']
      .map((k) => {
        return pkg[k];
      })
      .filter((x) => {
        return x !== undefined;
      })
      .some((txt) => {
        return txt.includes(query);
      });
  };
};

function compileTextSearch(textSearch: string): (pkg: PackageResults) => boolean {
  const textMatchers = (textSearch || '').split(' ').map(matcher);
  return (pkg) => textMatchers.every((m) => m(pkg));
}

function removeDuplicates(results) {
  const pkgNames: any[] = [];
  return results.filter((pkg) => {
    if (pkgNames.includes(pkg?.package?.name)) {
      return false;
    }
    pkgNames.push(pkg?.package?.name);
    return true;
  });
}

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

async function sendResponse(
  resultBuf,
  resultStream,
  auth,
  req,
  from: number,
  size: number
): Promise<SearchResults> {
  resultStream.destroy();
  const resultsCollection = resultBuf.map((pkg): SearchResult => {
    if (pkg?.name) {
      return {
        package: pkg,
        // not sure if flags is need it
        flags: {
          unstable: Object.keys(pkg.versions).some((v) => semver.satisfies(v, '^1.0.0'))
            ? undefined
            : true,
        },
        local: true,
        score: {
          final: 1,
          detail: {
            quality: 1,
            popularity: 1,
            maintenance: 0,
          },
        },
        searchScore: 100000,
      };
    } else {
      return pkg;
    }
  });
  const uniqueResults = removeDuplicates(resultsCollection);

  // evaluate access in batches and stop as soon as the requested page
  // is filled, instead of running an auth check on every result
  const requested = from + size;
  const allowed: SearchResult[] = [];
  for (
    let i = 0;
    i < uniqueResults.length && allowed.length < requested;
    i += CHECK_ACCESS_BATCH_SIZE
  ) {
    const batch = await Promise.all(
      uniqueResults
        .slice(i, i + CHECK_ACCESS_BATCH_SIZE)
        .map((pkgItem) => checkAccess(pkgItem, auth, req.remote_user))
    );
    for (const item of batch) {
      if (!_.isNull(item)) {
        allowed.push(item as SearchResult);
      }
    }
  }

  const final: SearchResult[] = allowed.slice(from, requested);
  logger.debug(`search results ${final?.length}`);

  const response: SearchResults = {
    objects: final,
    total: final.length,
    time: new Date().toUTCString(),
  };

  logger.debug(`total response ${final.length}`);
  return response;
}

/**
 * Endpoint for npm search v1
 * req: 'GET /-/v1/search?text=react&size=20&from=0&quality=0.65&popularity=0.98&maintenance=0.5'
 */
export default function (route, auth, storage, config: Config): void {
  route.get(
    SEARCH_API_ENDPOINTS.search,
    rateLimit(config?.userRateLimit),
    async (req, res, next) => {
      // TODO: implement proper result scoring weighted by quality, popularity and maintenance query parameters
      const text = req.query.text as string;

      // `size` and `from` are attacker-controlled: clamp them so a single
      // request cannot demand unbounded work
      const size = parseQueryInt(req.query.size, DEFAULT_SIZE, MAX_SIZE);
      const from = parseQueryInt(req.query.from, 0, MAX_FROM);

      // rebuild the relative url from the clamped values so the bounds hold
      // end-to-end: the uplink proxy forwards it verbatim to the remote registry
      const searchParams = new URLSearchParams(req.query as Record<string, string>);
      searchParams.set('size', String(size));
      searchParams.set('from', String(from));
      const safeUrl = `${req.url.split('?')[0]}?${searchParams.toString()}`;

      const isInteresting = compileTextSearch(text);

      const resultStream = storage.search(0, { req, url: safeUrl });
      let resultBuf = [] as any;
      let completed = false;

      resultStream.on('data', (pkg: SearchResult[] | PackageResults) => {
        // packages from the upstreams
        if (_.isArray(pkg)) {
          resultBuf = resultBuf.concat(
            (pkg as SearchResult[]).filter((pkgItem) => {
              if (!isInteresting(pkgItem?.package)) {
                return;
              }
              logger.debug(`[remote] pkg name ${pkgItem?.package?.name}`);
              return true;
            })
          );
        } else {
          // packages from local
          // due compability with `/-/all` we cannot refactor storage.search();
          if (!isInteresting(pkg)) {
            return;
          }
          logger.debug(`[local] pkg name ${(pkg as PackageResults)?.name}`);
          resultBuf.push(pkg);
        }
      });

      resultStream.on('error', function () {
        logger.error('search endpoint has failed');
        res.socket.destroy();
      });

      resultStream.on('end', async () => {
        if (!completed) {
          completed = true;
          try {
            const response = await sendResponse(resultBuf, resultStream, auth, req, from, size);
            // @ts-expect-error
            logger.info('search endpoint ok results @{total}', { total: response.total });
            res.status(HTTP_STATUS.OK).json(response);
          } catch (err) {
            // @ts-expect-error
            logger.error('search endpoint has failed @{err}', { err });
            next(err);
          }
        }
      });
    }
  );
}
