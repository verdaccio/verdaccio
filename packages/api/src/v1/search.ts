import { Transform, pipeline, PassThrough } from 'stream';
import _ from 'lodash';
import buildDebug from 'debug';
import { Package } from '@verdaccio/types';
import { logger } from '@verdaccio/logger';
import { IAuth } from '@verdaccio/auth';
import { searchUtils } from '@verdaccio/core';
import { HTTP_STATUS, getInternalError } from '@verdaccio/commons-api';
import { Storage } from '@verdaccio/store';

const debug = buildDebug('verdaccio:api:search');

type SearchResults = {
  objects: searchUtils.SearchItemPkg[];
  total: number;
  time: string;
};

// const personMatch = (person, search) => {
//   if (typeof person === 'string') {
//     return person.includes(search);
//   }

//   if (typeof person === 'object') {
//     for (const field of Object.values(person)) {
//       if (typeof field === 'string' && field.includes(search)) {
//         return true;
//       }
//     }
//   }

//   return false;
// };

// const matcher = function (query) {
//   const match = query.match(/author:(.*)/);
//   if (match !== null) {
//     return function (pkg) {
//       return personMatch(pkg.author, match[1]);
//     };
//   }

//   // TODO: maintainer, keywords, boost-exact
//   // TODO implement some scoring system for freetext
//   return (pkg) => {
//     return ['name', 'displayName', 'description']
//       .map((k) => {
//         return pkg[k];
//       })
//       .filter((x) => {
//         return x !== undefined;
//       })
//       .some((txt) => {
//         return txt.includes(query);
//       });
//   };
// };

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

class TransFormResults extends Transform {
  public constructor(options) {
    super(options);
  }

  /**
   * Transform either array of packages or a single package into a stream of packages.
   * From uplinks the chunks are array but from local packages are objects.
   * @param {string} chunk
   * @param {string} encoding
   * @param {function} done
   * @returns {void}
   * @override
   */
  public _transform(chunk, _encoding, callback) {
    if (_.isArray(chunk)) {
      (chunk as searchUtils.SearchItem[])
        .filter((pkgItem) => {
          debug(`streaming remote pkg name ${pkgItem?.package?.name}`);
          return true;
        })
        .forEach((pkgItem) => {
          this.push(pkgItem);
        });
      return callback();
    } else {
      debug(`streaming local pkg name ${chunk?.package?.name}`);
      this.push(chunk);
      return callback();
    }
  }
}

/**
 * Endpoint for npm search v1
 * Empty value
 *  - {"objects":[],"total":0,"time":"Sun Jul 25 2021 14:09:11 GMT+0000 (Coordinated Universal Time)"}
 * req: 'GET /-/v1/search?text=react&size=20&frpom=0&quality=0.65&popularity=0.98&maintenance=0.5'
 */
export default function (route, auth: IAuth, storage: Storage): void {
  route.get('/-/v1/search', async (req, res, next) => {
    let [size, from] = ['size', 'from'].map((k) => req.query[k]);

    size = parseInt(size, 10) || 20;
    from = parseInt(from, 10) || 0;
    const data: any[] = [];
    const transformResults = new TransFormResults({ objectMode: true });

    const streamPassThrough = new PassThrough({ objectMode: true });
    storage.searchManager?.search(streamPassThrough, {
      query: req.query,
      url: req.url,
    });

    const outPutStream = new PassThrough({ objectMode: true });
    pipeline(streamPassThrough, transformResults, outPutStream, (err) => {
      if (err) {
        next(getInternalError(err ? err.message : 'unknown error'));
      } else {
        debug('Pipeline succeeded.');
      }
    });

    outPutStream.on('data', (chunk) => {
      data.push(chunk);
    });

    outPutStream.on('finish', async () => {
      debug('stream finish');
      const checkAccessPromises: searchUtils.SearchItemPkg[] = await Promise.all(
        removeDuplicates(data).map((pkgItem) => {
          return checkAccess(pkgItem, auth, req.remote_user);
        })
      );

      const final: searchUtils.SearchItemPkg[] = checkAccessPromises
        .filter((i) => !_.isNull(i))
        .slice(from, size);
      logger.debug(`search results ${final?.length}`);

      const response: SearchResults = {
        objects: final,
        total: final.length,
        time: new Date().toUTCString(),
      };

      res.status(HTTP_STATUS.OK).json(response);
    });
  });
}
