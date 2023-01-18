import _ from 'lodash';
import semver from 'semver';

import { Package } from '@verdaccio/types';

import { HTTP_STATUS } from '../../../../lib/constants';
import { logger } from '../../../../lib/logger';

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

function checkAccess(pkg: any, auth: any, remoteUser): Promise<Package | null> {
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
  const checkAccessPromises: SearchResult[] = await Promise.all(
    removeDuplicates(resultsCollection).map((pkgItem) => {
      return checkAccess(pkgItem, auth, req.remote_user);
    })
  );

  const final: SearchResult[] = checkAccessPromises.filter((i) => !_.isNull(i)).slice(from, size);
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
export default function (route, auth, storage): void {
  route.get('/-/v1/search', async (req, res, next) => {
    // TODO: implement proper result scoring weighted by quality, popularity and maintenance query parameters
    let [text, size, from /* , quality, popularity, maintenance */] = [
      'text',
      'size',
      'from' /* , 'quality', 'popularity', 'maintenance' */,
    ].map((k) => req.query[k]);

    size = parseInt(size) || 20;
    from = parseInt(from) || 0;

    const isInteresting = compileTextSearch(text);

    const resultStream = storage.search(0, { req });
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
          logger.info('search endpoint ok results @{total}', { total: response.total });
          res.status(HTTP_STATUS.OK).json(response);
        } catch (err) {
          logger.error('search endpoint has failed @{err}', { err });
          next(err);
        }
      }
    });
  });
}
