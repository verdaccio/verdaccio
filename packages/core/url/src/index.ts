import { URL } from 'url';
import _ from 'lodash';
import buildDebug from 'debug';
import isURLValidator from 'validator/lib/isURL';

import { ConfigYaml } from '@verdaccio/types';
import { HEADERS } from '@verdaccio/commons-api';

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
    returnProtocol = commaIndex > 0 ? headerProtocol.substr(0, commaIndex) : headerProtocol;
  } else {
    debug('req protocol: %o', headerProtocol);
    returnProtocol = protocol;
  }

  return validProtocols.includes(returnProtocol) ? returnProtocol : defaultProtocol;
}

function wrapPrefix(prefix: string): string {
  if (prefix === '' || _.isNil(prefix)) {
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
  const result = new URL(wrapPrefix(prefix), `${protocol}://${host}`);
  debug('combined url %o', result.href);
  return result.href;
}

export function validateURL(publicUrl: string | void) {
  try {
    const parsed = new URL(publicUrl as string);
    if (!validProtocols.includes(parsed.protocol.replace(':', ''))) {
      throw Error('invalid protocol');
    }
    return true;
  } catch (err) {
    // TODO: add error logger here
    return false;
  }
}

export function getPublicUrl(url_prefix: string = '', req): string {
  if (validateURL(process.env.VERDACCIO_PUBLIC_URL as string)) {
    const envURL = new URL(process.env.VERDACCIO_PUBLIC_URL as string).href;
    debug('public url by env %o', envURL);
    return envURL;
  } else if (req.get('host')) {
    const host = req.get('host');
    if (!isHost(host)) {
      throw new Error('invalid host');
    }
    const protocol = getWebProtocol(req.get(HEADERS.FORWARDED_PROTO), req.protocol);
    const combinedUrl = combineBaseUrl(protocol, host, url_prefix);
    debug('public url by request %o', combinedUrl);
    return combinedUrl;
  } else {
    return '/';
  }
}
