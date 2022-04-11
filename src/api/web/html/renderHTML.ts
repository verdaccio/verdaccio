import path from 'path';
import { URL } from 'url';


import { WEB_TITLE } from '../../../lib/constants';
import { getPublicUrl, hasLogin, isHTTPProtocol } from '../../../lib/utils';
import renderTemplate from './template';
import { HEADERS } from '@verdaccio/commons-api';
import LRU from 'lru-cache';
import buildDebug from 'debug';

const pkgJSON = require('../../../../package.json');
const DEFAULT_LANGUAGE = 'es-US';
const cache = new LRU({ max: 500, maxAge: 1000 * 60 * 60 });

const debug = buildDebug('verdaccio');

const defaultManifestFiles = {
  js: ['runtime.js', 'vendors.js', 'main.js'],
  ico: 'favicon.ico',
};

export function validatePrimaryColor(primaryColor) {
  const isHex = /^#+([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/i.test(primaryColor);
  if (!isHex) {
    debug('invalid primary color %o', primaryColor);
    return;
  }

  return primaryColor;
}

export function resolveLogo(config, req) {
  const isLocalFile = config?.web?.logo && !isHTTPProtocol(config?.web?.logo);

  if (isLocalFile) {
    return `${getPublicUrl(config?.url_prefix, req)}-/static/${path.basename(config?.web?.logo)}`;
  } else if (isHTTPProtocol(config?.web?.logo)) {
    return config?.web?.logo;
  } else {
    return '';
  }
}

export default function renderHTML(config, manifest, manifestFiles, req, res) {
  const { url_prefix } = config;
  const base = getPublicUrl(config?.url_prefix, req);
  const basename = new URL(base).pathname;
  const language = config?.i18n?.web ?? DEFAULT_LANGUAGE;
  const needHtmlCache = [undefined, null].includes(config?.web?.html_cache) ? true : config.web.html_cache;
  const darkMode = config?.web?.darkMode ?? false;
  const title = config?.web?.title ?? WEB_TITLE;
  const scope = config?.web?.scope ?? '';
  const login = hasLogin(config);
  const logoURI = resolveLogo(config, req);
  const pkgManagers = config?.web?.pkgManagers ?? ['yarn', 'pnpm', 'npm'];
  const version = pkgJSON.version;
  const primaryColor = validatePrimaryColor(config?.web?.primary_color) ?? '#4b5e40';
  const { scriptsBodyAfter, metaScripts, scriptsbodyBefore } = Object.assign(
    {},
    {
      scriptsBodyAfter: [],
      bodyBefore: [],
      metaScripts: [],
    },
    config?.web
  );
  const options = {
    darkMode,
    url_prefix,
    basename,
    base,
    primaryColor,
    version,
    pkgManagers,
    login,
    logo: logoURI,
    title,
    scope,
    language,
  };

  let webPage;

  try {
    webPage = cache.get('template');
    if (!webPage) {
      debug('web options %o', options);
      debug('web manifestFiles %o', manifestFiles);
      webPage = renderTemplate(
        {
          manifest: manifestFiles ?? defaultManifestFiles,
          options,
          scriptsBodyAfter,
          metaScripts,
          scriptsbodyBefore,
        },
        manifest
      );
      debug('template :: %o', webPage);
      if (needHtmlCache) {
        cache.set('template', webPage);
        debug('set template cache');
      }
    } else {
      debug('reuse template cache');
    }
  } catch (error) {
    throw new Error(`theme could not be load, stack ${error.stack}`);
  }
  res.setHeader('Content-Type', HEADERS.TEXT_HTML);
  res.send(webPage);
  debug('render web');
}
