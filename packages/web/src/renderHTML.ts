import buildDebug from 'debug';
import LRU from 'lru-cache';
import { HEADERS } from '@verdaccio/commons-api';
import { combineBaseUrl, getWebProtocol } from '@verdaccio/utils';
import { WEB_TITLE } from '@verdaccio/config';

import { validatePrimaryColor } from './utils/web-utils';
import renderTemplate from './template';

const pkgJSON = require('../package.json');
const DEFAULT_LANGUAGE = 'es-US';
const cache = new LRU({ max: 500, maxAge: 1000 * 60 * 60 });

const debug = buildDebug('verdaccio:web:render');

const manifestFiles = {
  js: ['runtime.js', 'vendors.js', 'main.js'],
  css: ['main.css'],
  ico: 'ico.co',
};

export default function renderHTML(config, req, res) {
  const { manifest } = require('@verdaccio/ui-theme');
  const protocol = getWebProtocol(req.get(HEADERS.FORWARDED_PROTO), req.protocol);
  const host = req.get('host');
  const { url_prefix } = config;
  const uri = `${protocol}://${host}`;
  const base = combineBaseUrl(protocol, host, url_prefix);
  const language = config?.i18n?.web ?? DEFAULT_LANGUAGE;
  const darkMode = config?.web?.darkMode ?? false;
  const title = config?.web?.title ?? WEB_TITLE;
  const scope = config?.web?.scope ?? '';
  // FIXME: logo URI is incomplete
  let logoURI = config?.web?.logo ?? '';
  const version = pkgJSON.version;
  const primaryColor = validatePrimaryColor(config?.web?.primary_color);
  const { scriptsBodyAfter, metaScripts, bodyBefore, bodyAfter } = config?.web;
  const options = {
    uri,
    darkMode,
    protocol,
    host,
    url_prefix,
    base,
    primaryColor,
    version,
    logoURI,
    title,
    scope,
    language,
  };

  let webPage;

  try {
    webPage = cache.get('template');

    if (!webPage) {
      webPage = renderTemplate(
        {
          manifest: manifestFiles,
          options,
          scriptsBodyAfter,
          metaScripts,
          bodyBefore,
          bodyAfter,
        },
        manifest
      );
      debug('template :: %o', webPage);
      cache.set('template', webPage);
      debug('set template cache');
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
