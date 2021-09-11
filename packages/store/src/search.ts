/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable no-invalid-this

import { PassThrough, Transform, pipeline } from 'stream';
import lunr from 'lunr';
import lunrMutable from 'lunr-mutable-indexes';
import _ from 'lodash';
import buildDebug from 'debug';
import { logger } from '@verdaccio/logger';
import { Version } from '@verdaccio/types';
import { IProxy, ProxyList, ProxySearchParams } from '@verdaccio/proxy';
import { VerdaccioError } from '@verdaccio/commons-api';
import { searchUtils, errorUtils } from '@verdaccio/core';
import { LocalStorage } from './local-storage';
import { Storage } from './storage';

const debug = buildDebug('verdaccio:storage:search');
export interface ISearchResult {
  ref: string;
  score: number;
}
export interface IWebSearch {
  index: lunrMutable.index;
  storage: Storage;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query(query: string): ISearchResult[];
  add(pkg: Version): void;
  remove(name: string): void;
  reindex(): void;
  configureStorage(storage: Storage): void;
}

export function removeDuplicates(results: searchUtils.SearchPackageItem[]) {
  const pkgNames: any[] = [];
  return results.filter((pkg) => {
    if (pkgNames.includes(pkg?.package?.name)) {
      return false;
    }
    pkgNames.push(pkg?.package?.name);
    return true;
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

export class SearchManager {
  public readonly uplinks: ProxyList;
  public readonly localStorage: LocalStorage;
  constructor(uplinks: ProxyList, storage: LocalStorage) {
    this.uplinks = uplinks;
    this.localStorage = storage;
  }

  public get proxyList() {
    const uplinksList = Object.keys(this.uplinks);

    return uplinksList;
  }

  public async search(options: ProxySearchParams): Promise<searchUtils.SearchPackageItem[]> {
    const transformResults = new TransFormResults({ objectMode: true });
    const streamPassThrough = new PassThrough({ objectMode: true });
    const upLinkList = this.proxyList;

    const searchUplinksStreams = upLinkList.map((uplinkId) => {
      const uplink = this.uplinks[uplinkId];
      if (!uplink) {
        // this should never tecnically happens
        logger.fatal({ uplinkId }, 'uplink @upLinkId not found');
        throw new Error(`uplink ${uplinkId} not found`);
      }
      return this.consumeSearchStream(uplinkId, uplink, options, streamPassThrough);
    });

    try {
      debug('search uplinks');
      await Promise.all([...searchUplinksStreams]);
      debug('search uplinks done');
    } catch (err) {
      logger.error({ err }, ' error on uplinks search @{err}');
      streamPassThrough.emit('error', err);
      throw err;
    }
    debug('search local');
    await this.localStorage.search(streamPassThrough, options.query as searchUtils.SearchQuery);

    const data: searchUtils.SearchPackageItem[] = [];
    const outPutStream = new PassThrough({ objectMode: true });
    pipeline(streamPassThrough, transformResults, outPutStream, (err) => {
      if (err) {
        throw errorUtils.getInternalError(err ? err.message : 'unknown error');
      } else {
        debug('Pipeline succeeded.');
      }
    });

    outPutStream.on('data', (chunk) => {
      data.push(chunk);
    });

    return new Promise((resolve) => {
      outPutStream.on('finish', async () => {
        const checkAccessPromises: searchUtils.SearchPackageItem[] = removeDuplicates(data);
        debug('stream finish event %s', checkAccessPromises.length);
        return resolve(checkAccessPromises);
      });
      debug('search done');
    });
  }

  /**
   * Consume the upstream and pipe it to a transformable stream.
   */
  private consumeSearchStream(
    uplinkId: string,
    uplink: IProxy,
    options: ProxySearchParams,
    searchPassThrough: PassThrough
  ): Promise<any> {
    // TODO: review how to handle abort
    const abortController = new AbortController();
    return uplink.search({ ...options, abort: abortController }).then((bodyStream) => {
      bodyStream.pipe(searchPassThrough, { end: false });
      bodyStream.on('error', (err: VerdaccioError): void => {
        logger.error(
          { uplinkId, err: err },
          'search error for uplink @{uplinkId}: @{err?.message}'
        );
        searchPassThrough.end();
      });
      return new Promise((resolve) => bodyStream.on('end', resolve));
    });
  }
}

/**
 * Handle the search Indexer.
 */
class Search implements IWebSearch {
  public readonly index: lunrMutable.index;
  // @ts-ignore
  public storage: Storage;

  /**
   * Constructor.
   */
  public constructor() {
    this.index = lunrMutable(function (): void {
      // FIXME: there is no types for this library
      /* eslint no-invalid-this:off */
      // @ts-ignore
      this.field('name', { boost: 10 });
      // @ts-ignore
      this.field('description', { boost: 4 });
      // @ts-ignore
      this.field('author', { boost: 6 });
      // @ts-ignore
      this.field('keywords', { boost: 7 });
      // @ts-ignore
      this.field('version');
      // @ts-ignore
      this.field('readme');
    });

    this.index.builder.pipeline.remove(lunr.stemmer);
  }

  public init() {
    return Promise.resolve();
  }

  /**
   * Performs a query to the indexer.
   * If the keyword is a * it returns all local elements
   * otherwise performs a search
   * @param {*} q the keyword
   * @return {Array} list of results.
   */
  public query(query: string): ISearchResult[] {
    const localStorage = this.storage.localStorage as LocalStorage;

    return query === '*'
      ? (localStorage.storagePlugin as any).get((items): any => {
          items.map(function (pkg): any {
            return { ref: pkg, score: 1 };
          });
        })
      : this.index.search(`*${query}*`);
  }

  /**
   * Add a new element to index
   * @param {*} pkg the package
   */
  public add(pkg: Version): void {
    this.index.add({
      id: pkg.name,
      name: pkg.name,
      description: pkg.description,
      version: `v${pkg.version}`,
      keywords: pkg.keywords,
      author: pkg._npmUser ? pkg._npmUser.name : '???',
    });
  }

  /**
   * Remove an element from the index.
   * @param {*} name the id element
   */
  public remove(name: string): void {
    this.index.remove({ id: name });
  }

  /**
   * Force a re-index.
   */
  public reindex(): void {
    this.storage.getLocalDatabase((error, packages): void => {
      if (error) {
        // that function shouldn't produce any
        throw error;
      }
      let i = packages.length;
      while (i--) {
        this.add(packages[i]);
      }
    });
  }

  /**
   * Set up the {Storage}
   * @param {*} storage An storage reference.
   */
  public configureStorage(storage: Storage): void {
    this.storage = storage;
    this.reindex();
  }
}

const SearchInstance = new Search();

export { SearchInstance };
