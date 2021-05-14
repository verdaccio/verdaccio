import semver from 'semver';
import _ from 'lodash';
import { Package } from '@verdaccio/types';
import { logger } from '../../../../lib/logger';

function compileTextSearch(textSearch: string): (pkg: Package) => boolean {
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
  const matcher = function (q) {
    const match = q.match(/author:(.*)/);
    if (match !== null) {
      return (pkg) => personMatch(pkg.author, match[1]);
    }

    // TODO: maintainer, keywords, not/is unstable insecure, boost-exact
    // TODO implement some scoring system for freetext
    return (pkg) => {
      return ['name', 'displayName', 'description']
        .map((k) => pkg[k])
        .filter((x) => x !== undefined)
        .some((txt) => txt.includes(q));
    };
  };

  const textMatchers = (textSearch || '').split(' ').map(matcher);
  return (pkg) => textMatchers.every((m) => m(pkg));
}

function removeDuplicates(results) {
  const pkgNames: any[] = [];
  return results.filter((pkg) => {
    if (pkgNames.includes(pkg?.package?.name)) {
      logger.debug(`discard ${pkg.package.name}`)
      return false;
    }
    pkgNames.push(pkg?.package?.name);
    logger.debug(`list ${pkgNames}`)
    return true;
  })

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
        return resolve(allowed ? pkg: null);
      }
    });
  });
}

const sendResponse = async (resultBuf, resultStream, auth, req): Promise<any> => {
  logger.debug(`send response ${resultBuf?.length}`);
  resultStream.destroy();

  const resultsCollection = resultBuf.map((pkg) => {
    if(pkg?.name) {
      return {
        package: pkg,
        // not sure if flags is need it
        flags: {
          unstable: Object.keys(pkg.versions).some((v) => semver.satisfies(v, '^1.0.0'))
            ? undefined
            : true
        },
        local: true,
        score: {
          final: 1,
          detail: {
            quality: 1,
            popularity: 1,
            maintenance: 0
          }
        },
        searchScore: 100000
      }
    } else {
      return pkg;
    }
  });
  const checkAccessPromises = await Promise.all(removeDuplicates(resultsCollection).map((pkgItem) => {
    return checkAccess(pkgItem, auth, req.remote_user);
  }));

  const final = checkAccessPromises.filter(i => !_.isNull(i));

  const response = {
    objects: final,
    total: final.length,
    time: new Date().toUTCString()
  };

  logger.debug(`total response ${final.length}`);
  // res.status(200).json(response);
  return response;
};

export default function (route, auth, storage): void {
  logger.debug('search v1');
  route.get('/-/v1/search', async (req, res, next) => {
    // TODO: implement proper result scoring weighted by quality, popularity and maintenance query parameters
    let [text, size, from /* , quality, popularity, maintenance */] = [
      'text',
      'size',
      'from' /* , 'quality', 'popularity', 'maintenance' */
    ].map((k) => req.query[k]);

    size = parseInt(size) || 20;
    from = parseInt(from) || 0;

    const isInteresting = compileTextSearch(text);

    const resultStream = storage.search(0, { req });
    let resultBuf = [] as any;
    let completed = false;

    resultStream.on('data', (pkg) => {
      // packages from the upstreams
      if(_.isArray(pkg)) {
        resultBuf = resultBuf.concat(pkg.filter((pkgItem) => {
          logger.debug(`[remote] pkg name ${pkgItem?.package?.name}`);
          if (!isInteresting(pkgItem?.package)) {
            logger.debug(`[remote] not interesting ${pkgItem?.package?.name}`);
            return;
          }

          return true;
        }))
      } else {
        // packages from local
        // due compability with `/-/all` we cannot refactor storage.search();
        logger.debug(`[local] pkg name ${pkg?.name}`);
        if (!isInteresting(pkg)) {
          logger.debug(`[local] not interesting ${pkg?.name}`);
          return;
        }
        resultBuf.push(pkg);
      }
    });
    resultStream.on('end', async () => {
      if (!completed) {
        completed = true;
        try {
        const response = await sendResponse(resultBuf, resultStream, auth, req);
        res.status(200).json(response);
        } catch(err) {
          next(err);
        }
      }
    });
  });
}

