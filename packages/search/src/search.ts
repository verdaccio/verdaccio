import buildDebug from 'debug';
import { PassThrough, pipeline as streamPipeline } from 'stream';

import { errorUtils, searchUtils } from '@verdaccio/core';
import { IProxy, ProxyInstanceList, ProxySearchParams, setupUpLinks } from '@verdaccio/proxy';
import { Config, Logger } from '@verdaccio/types';

import { removeDuplicates } from './search-utils';
import { TransFormResults } from './transform-results';

const debug = buildDebug('verdaccio:search');

class Search {
  public readonly uplinks: ProxyInstanceList;
  public readonly logger: Logger;
  constructor(config: Config, logger: Logger) {
    this.logger = logger.child({ module: 'proxy' });
    this.uplinks = setupUpLinks(config, this.logger);
  }

  private getProxyList() {
    const uplinksList = Object.keys(this.uplinks);

    return uplinksList;
  }

  /**
   * Handle search on packages and proxies.
   * Iterate all proxies configured and search in all endpoints in v2 and pipe all responses
   * to a stream, once the proxies request has finished search in local storage for all packages
   * (privated and cached).
   */
  public async search(
    options: ProxySearchParams,
    searchCachedPackages
  ): Promise<searchUtils.SearchPackageItem[]> {
    if (!searchCachedPackages) {
      throw errorUtils.getInternalError('local package search is not defined');
    }

    const transformResults = new TransFormResults({ objectMode: true });
    const streamPassThrough = new PassThrough({ objectMode: true });
    const upLinkList = this.getProxyList();
    debug('uplinks found %s', upLinkList.length);
    const searchUplinksStreams = upLinkList.map((uplinkId: string) => {
      const uplink = this.uplinks[uplinkId];
      if (!uplink) {
        // this line should never happens
        this.logger.error({ uplinkId }, 'uplink @upLinkId not found');
      }
      return this.consumeSearchStream(uplinkId, uplink, options, streamPassThrough);
    });

    try {
      debug('searching on %s uplinks...', searchUplinksStreams?.length);
      // only process those streams end successfully, if all request fails
      // just include local storage results (if local fails then return 500)
      await Promise.allSettled([...searchUplinksStreams]);
      debug('searching all uplinks done');
    } catch (err: any) {
      this.logger.error({ err: err?.message }, ' error on uplinks search @{err}');
      streamPassThrough.emit('error', err);
    }
    debug('search local');
    try {
      await searchCachedPackages(streamPassThrough, options.query as searchUtils.SearchQuery);
    } catch (err: any) {
      this.logger.error({ err: err?.message }, ' error on local search @{err}');
      streamPassThrough.emit('error', err);
    }
    const data: searchUtils.SearchPackageItem[] = [];
    const outPutStream = new PassThrough({ objectMode: true });
    streamPipeline(streamPassThrough, transformResults, outPutStream, (err: any) => {
      if (err) {
        this.logger.error({ err: err?.message }, ' error on search @{err}');
        throw errorUtils.getInternalError(err ? err.message : 'unknown search error');
      } else {
        debug('pipeline succeeded');
      }
    });

    outPutStream.on('data', (chunk) => {
      data.push(chunk);
    });

    return new Promise((resolve) => {
      outPutStream.on('finish', async () => {
        const searchFinalResults: searchUtils.SearchPackageItem[] = removeDuplicates(data);
        debug('search stream total results: %o', searchFinalResults.length);
        return resolve(searchFinalResults);
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
    return uplink.search({ ...options }).then((bodyStream) => {
      bodyStream.pipe(searchPassThrough, { end: false });
      bodyStream.on('error', (err: any): void => {
        this.logger.error(
          { uplinkId, err: err },
          'search error for uplink @{uplinkId}: @{err?.message}'
        );
        searchPassThrough.end();
      });
      return new Promise((resolve) => bodyStream.on('end', resolve));
    });
  }
}

export { Search };
