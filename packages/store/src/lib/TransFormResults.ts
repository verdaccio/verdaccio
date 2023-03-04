import buildDebug from 'debug';
import _ from 'lodash';
import { Transform } from 'stream';

import { searchUtils } from '@verdaccio/core';

const debug = buildDebug('verdaccio:storage:search:transform');

export class TransFormResults extends Transform {
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
      // from remotes we should expect chunks as arrays
      (chunk as searchUtils.SearchItem[])
        .filter((pkgItem) => {
          debug(`streaming remote pkg name ${pkgItem?.package?.name}`);
          return true;
        })
        .forEach((pkgItem) => {
          this.push({ ...pkgItem, verdaccioPkgCached: false, verdaccioPrivate: false });
        });
      return callback();
    } else {
      // local we expect objects
      debug(`streaming local pkg name ${chunk?.package?.name}`);
      this.push(chunk);
      return callback();
    }
  }
}
