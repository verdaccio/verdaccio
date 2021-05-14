import semver from 'semver';
import _ from 'lodash';
import { Package } from '@verdaccio/types';
import buildDebug from 'debug';
import { logger } from '../../../../lib/logger';

const debug = buildDebug('verdaccio:search');

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

export default function (route, auth, storage): void {
  debug('search v1');
  logger.debug('search v1');
  route.get('/-/v1/search', (req, res) => {
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
    const resultBuf = [] as any;
    let completed = false;

    const sendResponse = (): void => {
      logger.debug(`send response ${resultBuf?.length}`);
      completed = true;
      resultStream.destroy();

      const final = resultBuf.slice(from, size).map((pkg) => {
        return {
          package: pkg,
          flags: {
            unstable: Object.keys(pkg.versions).some((v) => semver.satisfies(v, '^1.0.0'))
              ? undefined
              : true
          },
          score: {
            final: 1,
            detail: {
              quality: 1,
              popularity: 1,
              maintenance: 0
            }
          },
          searchScore: 100000
        };
      });
      const response = {
        objects: final,
        total: final.length,
        time: new Date().toUTCString()
      };

      logger.debug(`total response ${final.length}`);
      res.status(200).json(response);
    };

    resultStream.on('data', (pkg) => {
      logger.info('streaming search data');
      if(_.isArray(pkg)) {
        resultBuf.concat(pkg.filter((pkgItem) => {
          logger.debug(`pkg name ${pkgItem?.package?.name}`);
          if (!isInteresting(pkgItem?.package)) {
            logger.debug(`not interesting ${pkgItem?.package?.name}`);
            return;
          }

          return true;
        }))
      } else {
        logger.debug(`pkg name ${pkg?.name}`);
        if (!isInteresting(pkg)) {
          logger.debug(`not interesting ${pkg?.name}`);
          return;
        }
        resultBuf.push(pkg);
      }
    });
    resultStream.on('end', () => {
      if (!completed) {
        sendResponse();
      }
    });
  });
}

