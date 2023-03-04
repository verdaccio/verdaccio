import buildDebug from 'debug';
import { URL } from 'url';
import isURLValidator from 'validator/lib/isURL';

import { HEADERS } from '@verdaccio/core';

const debug = buildDebug('verdaccio:core:url');

const validProtocols = ['https', 'http'];

/**
 * Check if URI is starting with "http://", "https://" or "//"
 * @param {string} uri
 */
export function isURLhasValidProtocol(uri: string): boolean {
  return /^(https?:)?\/\//.test(uri);
}

export function isHost(url: string = '', options = {}): boolean {
  return isURLValidator(url, {
    require_host: true,
    allow_trailing_dot: false,
    require_valid_protocol: false,
    // @ts-ignore
    require_port: false,
    require_tld: false,
    ...options,
  });
}

/**
 * Detect running protocol (http or https)
 */
export function getWebProtocol(headerProtocol: string | void, protocol: string): string {
  let returnProtocol;
  const [, defaultProtocol] = validProtocols;
  // HAProxy variant might return http,http with X-Forwarded-Proto
  if (typeof headerProtocol === 'string' && headerProtocol !== '') {
    debug('header protocol: %o', protocol);
    const commaIndex = headerProtocol.indexOf(',');
    returnProtocol = commaIndex > 0 ? headerProtocol.slice(0, commaIndex) : headerProtocol;
  } else {
    debug('req protocol: %o', headerProtocol);
    returnProtocol = protocol;
  }

  return validProtocols.includes(returnProtocol) ? returnProtocol : defaultProtocol;
}

export function wrapPrefix(prefix: string | void): string {
  if (prefix === '' || typeof prefix === 'undefined' || prefix === null) {
    return '';
  } else if (!prefix.startsWith('/') && prefix.endsWith('/')) {
    return `/${prefix}`;
  } else if (!prefix.startsWith('/') && !prefix.endsWith('/')) {
    return `/${prefix}/`;
  } else if (prefix.startsWith('/') && !prefix.endsWith('/')) {
    return `${prefix}/`;
  } else {
    return prefix;
  }
}

/**
 * Create base url for registry.
 * @return {String} base registry url
 */
export function combineBaseUrl(protocol: string, host: string, prefix: string = ''): string {
  debug('combined protocol %o', protocol);
  debug('combined host %o', host);
  const newPrefix = wrapPrefix(prefix);
  debug('combined prefix %o', newPrefix);
  const groupedURI = new URL(wrapPrefix(prefix), `${protocol}://${host}`);
  const result = groupedURI.href;
  debug('combined url %o', result);
  return result;
}

export function validateURL(publicUrl: string | void) {
  try {
    const parsed = new URL(publicUrl as string);
    if (!validProtocols.includes(parsed.protocol.replace(':', ''))) {
      throw Error('invalid protocol');
    }
    return true;
  } catch (err: any) {
    // TODO: add error logger here
    return false;
  }
}

export type RequestOptions = {
  /**
   * Request host.
   */
  host: string;
  /**
   * Request protocol.
   */
  protocol: string;
  /**
   * Request headers.
   */
  headers: { [key: string]: string };
  remoteAddress?: string;
  /**
   * Logged username the request, usually after token verification.
   */
  username?: string;
};

export function getPublicUrl(url_prefix: string = '', requestOptions: RequestOptions): string {
  if (validateURL(process.env.VERDACCIO_PUBLIC_URL as string)) {
    const envURL = new URL(wrapPrefix(url_prefix), process.env.VERDACCIO_PUBLIC_URL as string).href;
    debug('public url by env %o', envURL);
    return envURL;
  } else if (requestOptions.headers['host']) {
    const host = requestOptions.headers['host'];
    if (!isHost(host)) {
      throw new Error('invalid host');
    }
    const protoHeader =
      process.env.VERDACCIO_FORWARDED_PROTO?.toLocaleLowerCase() ??
      HEADERS.FORWARDED_PROTO.toLowerCase();
    const protocol = getWebProtocol(requestOptions.headers[protoHeader], requestOptions.protocol);
    const combinedUrl = combineBaseUrl(protocol, host, url_prefix);
    debug('public url by request %o', combinedUrl);
    return combinedUrl;
  } else {
    return '/';
  }
}
