import JSONStream from 'JSONStream';
import buildDebug from 'debug';
import got, {
  Agents,
  Delays,
  Options,
  RequestError,
  RetryOptions,
  Headers as gotHeaders,
} from 'got-cjs';
import _ from 'lodash';
import Stream, { PassThrough, Readable } from 'stream';
import { URL } from 'url';

import {
  API_ERROR,
  HEADERS,
  HTTP_STATUS,
  TOKEN_BASIC,
  TOKEN_BEARER,
  constants,
  errorUtils,
  searchUtils,
} from '@verdaccio/core';
import { Manifest } from '@verdaccio/types';
import { Config, Logger, UpLinkConf } from '@verdaccio/types';
import { buildToken } from '@verdaccio/utils';

import CustomAgents, { AgentOptionsConf } from './agent';
import { parseInterval } from './proxy-utils';

const debug = buildDebug('verdaccio:proxy');

const encode = function (thing): string {
  return encodeURIComponent(thing).replace(/^%40/, '@');
};

const jsonContentType = HEADERS.JSON;
const contentTypeAccept = `${jsonContentType};`;

/**
 * Just a helper (`config[key] || default` doesn't work because of zeroes)
 */
const setConfig = (config: UpLinkConfLocal, key: string, def): string => {
  return _.isNil(config[key]) === false ? config[key] : def;
};

export type UpLinkConfLocal = UpLinkConf & {
  no_proxy?: string;
};

export interface ProxyList {
  [key: string]: IProxy;
}

export type ProxySearchParams = {
  url: string;
  abort: AbortController;
  query?: searchUtils.SearchQuery;
  headers?: Headers;
  retry?: Partial<RetryOptions>;
};
export interface IProxy {
  config: UpLinkConfLocal;
  failed_requests: number;
  userAgent: string;
  ca?: string | void;
  logger: Logger;
  server_id: string;
  url: URL;
  maxage: number;
  timeout: Delays;
  max_fails: number;
  fail_timeout: number;
  upname: string;
  search(options: ProxySearchParams): Promise<Stream.Readable>;
  getRemoteMetadata(
    name: string,
    options: Partial<ISyncUplinksOptions>
  ): Promise<[Manifest, string]>;
  fetchTarball(
    url: string,
    options: Partial<Pick<ISyncUplinksOptions, 'remoteAddress' | 'etag' | 'retry'>>
  ): PassThrough;
}

// this type is need it by storage
export { Options as FetchOptions };

export interface ISyncUplinksOptions extends Options {
  uplinksLook?: boolean;
  etag?: string;
  remoteAddress?: string;
}

/**
 * Implements Storage interface
 * (same for storage.js, local-storage.js, up-storage.js)
 */
class ProxyStorage implements IProxy {
  public config: UpLinkConfLocal;
  public failed_requests: number;
  public userAgent: string;
  public ca: string | void;
  public logger: Logger;
  public server_id: string;
  public url: URL;
  public maxage: number;
  public timeout: Delays;
  public max_fails: number;
  public fail_timeout: number;
  public agent_options: AgentOptionsConf;
  // FIXME: upname is assigned to each instance
  // @ts-ignore
  public upname: string;
  public proxy: string | undefined;
  private agent: Agents;
  // @ts-ignore
  public last_request_time: number | null;
  public strict_ssl: boolean;
  private retry: Partial<RetryOptions>;

  public constructor(config: UpLinkConfLocal, mainConfig: Config, logger: Logger, agent?: Agents) {
    this.config = config;
    this.failed_requests = 0;
    this.userAgent = mainConfig.user_agent ?? 'hidden';
    this.ca = config.ca;
    this.logger = logger;
    this.server_id = mainConfig.server_id;
    this.agent_options = setConfig(this.config, 'agent_options', {
      keepAlive: true,
      maxSockets: 40,
      maxFreeSockets: 10,
    }) as AgentOptionsConf;
    this.url = new URL(this.config.url);
    const isHTTPS = this.url.protocol === 'https:';
    this._setupProxy(this.url.hostname, config, mainConfig, isHTTPS);
    this.agent = agent ?? this.getAgent();
    this.config.url = this.config.url.replace(/\/$/, '');

    if (this.config.timeout && Number(this.config.timeout) >= 1000) {
      this.logger.warn(
        [
          'Too big timeout value: ' + this.config.timeout,
          'We changed time format to nginx-like one',
          '(see http://nginx.org/en/docs/syntax.html)',
          'so please update your config accordingly',
        ].join('\n')
      );
    }

    // a bunch of different configurable timers
    this.maxage = parseInterval(setConfig(this.config, 'maxage', '2m'));
    // https://github.com/sindresorhus/got/blob/main/documentation/6-timeout.md
    this.timeout = {
      request: parseInterval(setConfig(this.config, 'timeout', '30s')),
    };
    debug('set timeout %s', this.timeout);
    this.max_fails = Number(setConfig(this.config, 'max_fails', this.config.max_fails ?? 2));
    this.fail_timeout = parseInterval(setConfig(this.config, 'fail_timeout', '5m'));
    this.strict_ssl = Boolean(setConfig(this.config, 'strict_ssl', true));
    this.retry = { limit: this.max_fails ?? 2 };
  }

  private getAgent() {
    if (!this.agent) {
      // TODO: the config.ca (certificates) is not yet injected here
      const agentInstance = new CustomAgents(this.config.url, this.proxy, this.agent_options);
      return agentInstance.get();
    } else {
      return this.agent;
    }
  }

  public getHeaders(headers = {}): gotHeaders {
    const accept = HEADERS.ACCEPT;
    const acceptEncoding = HEADERS.ACCEPT_ENCODING;
    const userAgent = HEADERS.USER_AGENT;

    headers[accept] = headers[accept] || contentTypeAccept;
    headers[acceptEncoding] = headers[acceptEncoding] || 'gzip';
    // registry.npmjs.org will only return search result if user-agent include string 'npm'
    headers[userAgent] = headers[userAgent] || `npm (${this.userAgent})`;
    return this.setAuthNext(headers);
  }

  /**
   * Validate configuration auth and assign Header authorization
   * @param {Object} headers
   * @return {Object}
   * @private
   */
  private setAuthNext(headers: gotHeaders): gotHeaders {
    const { auth } = this.config;
    if (typeof auth === 'undefined' || typeof headers[HEADERS.AUTHORIZATION] === 'string') {
      return headers;
    }

    if (_.isObject(auth) === false && _.isObject((auth as any).token) === false) {
      this._throwErrorAuth('Auth invalid');
    }

    // get NPM_TOKEN http://blog.npmjs.org/post/118393368555/deploying-with-npm-private-modules
    // or get other variable export in env
    // https://github.com/verdaccio/verdaccio/releases/tag/v2.5.0
    let token: any;
    const tokenConf: any = auth;
    if (_.isNil(tokenConf.token) === false && _.isString(tokenConf.token)) {
      token = tokenConf.token;
    } else if (_.isNil(tokenConf.token_env) === false) {
      if (typeof tokenConf.token_env === 'string') {
        token = process.env[tokenConf.token_env];
      } else if (typeof tokenConf.token_env === 'boolean' && tokenConf.token_env) {
        token = process.env.NPM_TOKEN;
      } else {
        this.logger.error(constants.ERROR_CODE.token_required);
        this._throwErrorAuth(constants.ERROR_CODE.token_required);
      }
    } else {
      token = process.env.NPM_TOKEN;
    }

    if (typeof token === 'undefined') {
      this._throwErrorAuth(constants.ERROR_CODE.token_required);
    }

    // define type Auth allow basic and bearer
    const type = tokenConf.type || TOKEN_BASIC;
    this._setHeaderAuthorization(headers, type, token);

    return headers;
  }

  /**
   * @param {string} message
   * @throws {Error}
   * @private
   */
  private _throwErrorAuth(message: string): Error {
    this.logger.error(message);
    throw new Error(message);
  }

  /**
   * Assign Header authorization with type authentication
   * @param {Object} headers
   * @param {string} type
   * @param {string} token
   * @private
   */
  private _setHeaderAuthorization(headers: any, type: string, token: any): void {
    const _type: string = type.toLowerCase();

    if (_type !== TOKEN_BEARER.toLowerCase() && _type !== TOKEN_BASIC.toLowerCase()) {
      this._throwErrorAuth(`Auth type '${_type}' not allowed`);
    }

    type = _.upperFirst(type);
    headers[HEADERS.AUTHORIZATION] = buildToken(type, token);
  }

  /**
   * It will add or override specified headers from config file.
   *
   * Eg:
   *
   * uplinks:
   npmjs:
   url: https://registry.npmjs.org/
   headers:
   Accept: "application/vnd.npm.install-v2+json; q=1.0"
   verdaccio-staging:
   url: https://mycompany.com/npm
   headers:
   Accept: "application/json"
   authorization: "Basic YourBase64EncodedCredentials=="

   * @param {Object} headers
   * @private
   * @deprecated use applyUplinkHeaders
   */
  private _overrideWithUpLinkConfLocaligHeaders(headers: Headers): any {
    if (!this.config.headers) {
      return headers;
    }

    // add/override headers specified in the config
    /* eslint guard-for-in: 0 */
    for (const key in this.config.headers) {
      headers[key] = this.config.headers[key];
    }
  }

  private applyUplinkHeaders(headers: gotHeaders): gotHeaders {
    if (!this.config.headers) {
      return headers;
    }

    // add/override headers specified in the config
    /* eslint guard-for-in: 0 */
    for (const key in this.config.headers) {
      headers[key] = this.config.headers[key];
    }
    return headers;
  }

  public async getRemoteMetadata(
    name: string,
    options: Partial<ISyncUplinksOptions>
  ): Promise<[Manifest, string]> {
    if (this._ifRequestFailure()) {
      throw errorUtils.getInternalError(API_ERROR.UPLINK_OFFLINE);
    }

    // FUTURE: allow mix headers that comes from the client
    debug('getting metadata for package %s', name);
    let headers = this.getHeaders(options?.headers);
    headers = this.addProxyHeaders(headers, options.remoteAddress);
    headers = this.applyUplinkHeaders(headers);
    // the following headers cannot be overwritten
    if (_.isNil(options.etag) === false) {
      headers[HEADERS.NONE_MATCH] = options.etag;
      headers[HEADERS.ACCEPT] = contentTypeAccept;
    }
    const method = options.method || 'GET';
    const uri = this.config.url + `/${encode(name)}`;
    debug('set retry limit is %s', this.retry.limit);
    let response;
    let responseLength = 0;
    try {
      const retry = options?.retry ?? this.retry;
      debug('retry initial count %s', retry);
      response = await got(uri, {
        headers,
        responseType: 'json',
        method,
        agent: this.agent,
        retry,
        timeout: this.timeout,
        hooks: {
          afterResponse: [
            (afterResponse) => {
              const code = afterResponse.statusCode;
              debug('after response code is %s', code);
              if (code >= HTTP_STATUS.OK && code < HTTP_STATUS.MULTIPLE_CHOICES) {
                if (this.failed_requests >= this.max_fails) {
                  this.failed_requests = 0;
                  this.logger.warn(
                    {
                      host: this.url.host,
                    },
                    'host @{host} is now online'
                  );
                }
              }

              return afterResponse;
            },
          ],
          beforeRetry: [
            (error: RequestError, count: number) => {
              debug('retry %s count: %s', uri, count);
              this.failed_requests = count ?? 0;
              this.logger.info(
                {
                  request: {
                    method: method,
                    url: uri,
                  },
                  error: error.message,
                  retryCount: this.failed_requests,
                },
                "retry @{retryCount} req: '@{request.method} @{request.url}'"
              );
              if (this.failed_requests >= this.max_fails) {
                this.logger.warn(
                  {
                    host: this.url.host,
                  },
                  'host @{host} is now offline'
                );
              }
            },
          ],
        },
      })
        .on('request', () => {
          this.last_request_time = Date.now();
        })
        .on<any>('response', (eventResponse) => {
          const message = "@{!status}, req: '@{request.method} @{request.url}' (streaming)";
          this.logger.http(
            {
              request: {
                method: method,
                url: uri,
              },
              status: _.isNull(eventResponse) === false ? eventResponse.statusCode : 'ERR',
            },
            message
          );
        })
        .on('downloadProgress', (progress) => {
          if (progress.total) {
            debug('responseLength %s', progress.total);
            responseLength = progress.total;
          }
        });
      const etag = response.headers.etag as string;
      const data = response.body;

      // not modified status (304) registry does not return any payload
      // it is handled as an error
      if (response?.statusCode === HTTP_STATUS.NOT_MODIFIED) {
        throw errorUtils.getCode(HTTP_STATUS.NOT_MODIFIED, API_ERROR.NOT_MODIFIED_NO_DATA);
      }

      debug('uri %s success', uri);
      const message = "@{!status}, req: '@{request.method} @{request.url}'";
      this.logger.http(
        {
          // if error is null/false change this to undefined so it wont log
          request: { method: method, url: uri },
          status: response.statusCode,
          bytes: {
            in: options?.json ? JSON.stringify(options?.json).length : 0,
            out: responseLength || 0,
          },
        },
        message
      );
      return [data, etag];
    } catch (err: any) {
      debug('error %s on uri %s', err.code, uri);
      if (err.code === 'ERR_NON_2XX_3XX_RESPONSE') {
        const code = err.response.statusCode;
        debug('error code %s', code);
        if (code === HTTP_STATUS.NOT_FOUND) {
          throw errorUtils.getNotFound(errorUtils.API_ERROR.NOT_PACKAGE_UPLINK);
        }

        if (!(code >= HTTP_STATUS.OK && code < HTTP_STATUS.MULTIPLE_CHOICES)) {
          const error = errorUtils.getInternalError(
            `${errorUtils.API_ERROR.BAD_STATUS_CODE}: ${code}`
          );
          // we need this code to identify outside which status code triggered the error
          error.remoteStatus = code;
          throw error;
        }
      } else if (err.code === 'ETIMEDOUT') {
        debug('error code timeout');
        const code = err.code;
        const error = errorUtils.getInternalError(
          `${errorUtils.API_ERROR.SERVER_TIME_OUT}: ${code}`
        );
        // we need this code to identify outside which status code triggered the error
        error.remoteStatus = code;
        throw error;
      }
      throw err;
    }
  }

  // FIXME: handle stream and retry
  public fetchTarball(
    url: string,
    overrideOptions: Pick<ISyncUplinksOptions, 'remoteAddress' | 'etag' | 'retry'>
  ): any {
    debug('fetching url for %s', url);
    const options = { ...this.config, ...overrideOptions };
    let headers = this.getHeaders(options?.headers);
    headers = this.addProxyHeaders(headers, options.remoteAddress);
    headers = this.applyUplinkHeaders(headers);
    // the following headers cannot be overwritten
    if (_.isNil(options.etag) === false) {
      headers[HEADERS.NONE_MATCH] = options.etag;
      headers[HEADERS.ACCEPT] = contentTypeAccept;
    }
    const method = 'GET';
    // const uri = this.config.url + `/${encode(name)}`;
    debug('request uri for %s', url);

    const readStream = got
      .stream(url, {
        headers,
        method,
        agent: this.agent,
        // FIXME: this should be taken from construtor as priority
        retry: this.retry ?? options?.retry,
        timeout: this.timeout,
      })
      .on('request', () => {
        this.last_request_time = Date.now();
      });

    return readStream;
  }

  /**
   * Perform a stream search.
   * @param {*} options request options
   * @return {Stream}
   */
  public async search({ url, abort, retry }: ProxySearchParams): Promise<Stream.Readable> {
    try {
      const fullURL = new URL(`${this.url}${url}`);
      // FIXME: a better way to remove duplicate slashes?
      const uri = fullURL.href.replace(/([^:]\/)\/+/g, '$1');
      this.logger.http({ uri, uplink: this.upname }, 'search request to uplink @{uplink} - @{uri}');
      debug('searching on %s', uri);
      const response = got(uri, {
        signal: abort ? abort.signal : {},
        agent: this.agent,
        timeout: this.timeout,
        retry: retry ?? this.retry,
      });

      const res = await response.text();
      const streamSearch = new PassThrough({ objectMode: true });
      const streamResponse = Readable.from(res);
      // objects is one of the properties on the body, it ignores date and total
      streamResponse.pipe(JSONStream.parse('objects')).pipe(streamSearch, { end: true });
      return streamSearch;
    } catch (err: any) {
      debug('search error %s', err);
      if (err.response.statusCode === 409) {
        throw errorUtils.getInternalError(`bad status code ${err.response.statusCode} from uplink`);
      }
      this.logger.error(
        { errorMessage: err?.message, name: this.upname },
        'proxy uplink @{name} search error: @{errorMessage}'
      );
      throw err;
    }
  }

  private addProxyHeaders(headers: gotHeaders, remoteAddress?: string): gotHeaders {
    // Only submit X-Forwarded-For field if we don't have a proxy selected
    // in the config file.
    //
    // Otherwise misconfigured proxy could return 407
    if (!this.proxy) {
      headers[HEADERS.FORWARDED_FOR] =
        (headers['x-forwarded-for'] ? headers['x-forwarded-for'] + ', ' : '') + remoteAddress;
    }

    // always attach Via header to avoid loops, even if we're not proxying
    headers['via'] = headers['via'] ? headers['via'] + ', ' : '';
    headers['via'] += '1.1 ' + this.server_id + ' (Verdaccio)';

    return headers;
  }

  /**
   * If the request failure.
   * @return {boolean}
   * @private
   */
  private _ifRequestFailure(): boolean {
    return (
      this.failed_requests >= this.max_fails &&
      Math.abs(Date.now() - (this.last_request_time as number)) < this.fail_timeout
    );
  }

  /**
   * Set up a proxy.
   * @param {*} hostname
   * @param {*} config
   * @param {*} mainconfig
   * @param {*} isHTTPS
   */
  private _setupProxy(
    hostname: string,
    config: UpLinkConfLocal,
    mainconfig: Config,
    isHTTPS: boolean
  ): void {
    let noProxyList;
    const proxy_key: string = isHTTPS ? 'https_proxy' : 'http_proxy';

    // get http_proxy and no_proxy configs
    if (proxy_key in config) {
      this.proxy = config[proxy_key];
    } else if (proxy_key in mainconfig) {
      this.proxy = mainconfig[proxy_key];
    }
    if ('no_proxy' in config) {
      noProxyList = config.no_proxy;
    } else if ('no_proxy' in mainconfig) {
      noProxyList = mainconfig.no_proxy;
    }

    // use wget-like algorithm to determine if proxy shouldn't be used
    if (hostname[0] !== '.') {
      hostname = '.' + hostname;
    }

    if (_.isString(noProxyList) && noProxyList.length) {
      noProxyList = noProxyList.split(',');
    }

    if (_.isArray(noProxyList)) {
      for (let i = 0; i < noProxyList.length; i++) {
        let noProxyItem = noProxyList[i];
        if (noProxyItem[0] !== '.') {
          noProxyItem = '.' + noProxyItem;
        }
        if (hostname.endsWith(noProxyItem)) {
          if (this.proxy) {
            this.logger.debug(
              { url: this.url.href, rule: noProxyItem },
              'not using proxy for @{url}, excluded by @{rule} rule'
            );
            this.proxy = undefined;
          }
          break;
        }
      }
    }

    if (typeof this.proxy === 'string') {
      this.logger.debug(
        { url: this.url.href, proxy: this.proxy },
        'using proxy @{proxy} for @{url}'
      );
    }
  }
}

export { ProxyStorage };
