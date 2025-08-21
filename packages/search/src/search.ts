import buildDebug from 'debug';
import _ from 'lodash';
import { PassThrough } from 'node:stream';

import { searchUtils } from '@verdaccio/core';
import { IProxy, ProxyInstanceList, ProxySearchParams, setupUpLinks } from '@verdaccio/proxy';
import { Config, Logger } from '@verdaccio/types';

import { removeDuplicates } from './search-utils';

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
  public async search(options: ProxySearchParams): Promise<searchUtils.SearchResults> {
    const results: searchUtils.SearchResults = {
      total: 0,
      time: new Date().toISOString(),
      objects: [],
    };
    const searchItems: searchUtils.SearchPackageItem[] = [];

    const upLinkList = this.getProxyList();
    const streamPassThrough = new PassThrough({ objectMode: true });
    debug('uplinks found %s', upLinkList.length);
    const searchUplinksStreams = upLinkList.map((uplinkName: string) => {
      const uplink = this.uplinks[uplinkName];
      if (!uplink) {
        // this line should never happens
        this.logger.error({ uplinkName }, 'uplink @uplinkName not found');
      }
      return this.consumeSearchStream(uplinkName, uplink, options, streamPassThrough);
    });

    try {
      debug('searching on %s uplinks...', searchUplinksStreams?.length);
      // only process those streams end successfully, if all request fails
      // just include local storage results (if local fails then return 500)
      await Promise.allSettled([...searchUplinksStreams]);
      streamPassThrough.end();

      for await (const chunk of streamPassThrough) {
        if (_.isString(chunk)) {
          const searchResults: searchUtils.SearchResults = JSON.parse(
            chunk
          ) as searchUtils.SearchResults;
          const objects: searchUtils.SearchPackageItem[] = searchResults.objects;

          objects.forEach((searchItem) => {
            debug(`streaming remote pkg name ${searchItem?.package?.name}`);

            // @ts-ignore
            return searchItems.push({
              ...searchItem,
              verdaccioPkgCached: false,
              verdaccioPrivate: false,
            });
          });

          results.total += searchResults.total;
        }
      }
      debug('searching all uplinks done');
    } catch (err: any) {
      this.logger.error({ err: err?.message }, ' error on uplinks search @{err}');
      throw err;
    }

    results.objects = removeDuplicates(searchItems);

    // Adjust the total to account for the number of duplicates that were removed.
    results.total -= searchItems.length - results.objects.length;

    return results;
  }

  /**
   * Consume the upstream and pipe it to a transformable stream.
   */
  private consumeSearchStream(
    uplinkName: string,
    uplink: IProxy,
    options: ProxySearchParams,
    searchPassThrough: PassThrough
  ): Promise<any> {
    return uplink.search({ ...options }).then((bodyStream) => {
      bodyStream.pipe(searchPassThrough, { end: false });
      bodyStream.on('error', (err: any): void => {
        this.logger.error(
          { uplinkName, err: err },
          'search error for uplink @{uplinkName}: @{err?.message}'
        );
        searchPassThrough.end();
      });
      return new Promise((resolve) => bodyStream.on('end', resolve));
    });
  }
}

export { Search };
