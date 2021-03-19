import fs from 'fs';
// import { URL } from 'url';
import path from 'path';
import { URL } from 'url';
import LRU from 'lru-cache';
import _ from 'lodash';
import buildDebug from 'debug';
import express from 'express';
import isURLValidator from 'validator/lib/isURL';
const debug = buildDebug('verdaccio');

import { getWebProtocol, isHTTPProtocol } from '../../lib/utils';
import Search from '../../lib/search';
import { HEADERS, HTTP_STATUS, WEB_TITLE } from '../../lib/constants';
import loadPlugin from '../../lib/plugin-loader';

const { setSecurityWebHeaders } = require('../middleware');
const pkgJSON = require('../../../package.json');

const DEFAULT_LANGUAGE = 'es-US';
const validProtocols = ['https', 'http'];

export function loadTheme(config) {
  if (_.isNil(config.theme) === false) {
    return _.head(
      loadPlugin(
        config,
        config.theme,
        {},
        function (plugin) {
          return _.isString(plugin);
        },
        'verdaccio-theme'
      )
    );
  }
}

export function validatePrimaryColor(primaryColor) {
  const isHex = /^#+([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/i.test(primaryColor);
  if (!isHex) {
    debug('invalid primary color %o', primaryColor);
    return;
  }

  return primaryColor;
}

const sendFileCallback = (next) => (err) => {
  if (!err) {
    return;
  }
  if (err.status === HTTP_STATUS.NOT_FOUND) {
    next();
  } else {
    next(err);
  }
};

export default function (config, auth, storage) {
  Search.configureStorage(storage);
  /* eslint new-cap:off */
  const router = express.Router();

  router.use(auth.webUIJWTmiddleware());
  router.use(setSecurityWebHeaders);
  const themePath = loadTheme(config) || require('@verdaccio/ui-theme')();
  const indexTemplate = path.join(themePath, 'index.html');
  const template = fs.readFileSync(indexTemplate).toString();
  const cache = new LRU({ max: 500, maxAge: 1000 * 60 * 60 });

  // Logo
  let logoURI = _.get(config, 'web.logo') ? config.web.logo : '';
  if (logoURI && !isHTTPProtocol(logoURI)) {
    // URI related to a local file

    // Note: `path.join` will break on Windows, because it transforms `/` to `\`
    // Use POSIX version `path.posix.join` instead.
    logoURI = path.posix.join('/-/static/', path.basename(logoURI));
    router.get(logoURI, function (req, res, next) {
      res.sendFile(path.resolve(config.web.logo), sendFileCallback(next));
    });
  }

  // Static
  router.get('/-/static/*', function (req, res, next) {
    const filename = req.params[0];
    const file = `${themePath}/${filename}`;
    res.sendFile(file, sendFileCallback(next));
  });

  function renderHTML(req, res) {
    const base = getPublicUrl(config?.url_prefix, req);
    const basename = new URL(base).pathname;
    const language = config?.i18n?.web ?? DEFAULT_LANGUAGE;
    const darkMode = config?.web?.darkMode ?? false;
    const title = config?.web?.title ?? WEB_TITLE;
    const scope = config?.web?.scope ?? '';
    const primaryColor = validatePrimaryColor(config?.web?.primary_color);
    const options = {
      darkMode,
      // deprecated
      protocol: '',
      host: '',
      uri: '',
      // deprecated
      url_prefix: basename,
      base,
      primaryColor,
      version: pkgJSON.version,
      title,
      scope,
      language,
    };

    const webPage = template
      .replace(/ToReplaceByVerdaccioUI/g, JSON.stringify(options))
      .replace(/ToReplaceByVerdaccioBase/g, base)
      .replace(/ToReplaceByVerdaccioFavico/g, logoURI);
    res.setHeader('Content-Type', HEADERS.TEXT_HTML);
    res.send(webPage);
  }

  router.get('/-/web/:section/*', function (req, res) {
    renderHTML(req, res);
  });

  router.get('/', function (req, res) {
    renderHTML(req, res);
  });

  return router;
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
  const result = stripTrailingSlash(groupedURI.href);
  debug('combined url %o', result);
  return result;
}

const stripTrailingSlash = (str) => {
  return str.endsWith('/') ? str.slice(0, -1) : str;
};

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
