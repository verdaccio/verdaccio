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
  public async search(options: ProxySearchParams): Promise<searchUtils.SearchPackageItem[]> {
    const results: searchUtils.SearchPackageItem[] = [];
    const upLinkList = this.getProxyList();
    // const transformResults = new TransFormResults({ objectMode: true });
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
        if (_.isArray(chunk)) {
          (chunk as searchUtils.SearchItem[])
            .filter((pkgItem) => {
              debug(`streaming remote pkg name ${pkgItem?.package?.name}`);
              return true;
            })
            .forEach((pkgItem) => {
              // @ts-ignore
              return results.push({
                ...pkgItem,
                verdaccioPkgCached: false,
                verdaccioPrivate: false,
              });
            });
        }
      }
      debug('searching all uplinks done');
    } catch (err: any) {
      this.logger.error({ err: err?.message }, ' error on uplinks search @{err}');
      throw err;
    }

    return removeDuplicates(results);
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
