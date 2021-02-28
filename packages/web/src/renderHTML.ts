import { URL } from 'url';
import buildDebug from 'debug';
import LRU from 'lru-cache';
import { HEADERS } from '@verdaccio/commons-api';
import { getPublicUrl } from '@verdaccio/url';

import { WEB_TITLE } from '@verdaccio/config';
import { validatePrimaryColor } from './utils/web-utils';
import renderTemplate from './template';

const pkgJSON = require('../package.json');
const DEFAULT_LANGUAGE = 'es-US';
const cache = new LRU({ max: 500, maxAge: 1000 * 60 * 60 });

const debug = buildDebug('verdaccio:web:render');

const defaultManifestFiles = {
  js: ['runtime.js', 'vendors.js', 'main.js'],
  css: [],
  ico: 'favicon.ico',
};

export default function renderHTML(config, req, res) {
  const { manifest, manifestFiles } = require('@verdaccio/ui-theme');
  const { url_prefix } = config;
  const basePath = getPublicUrl(config?.url_prefix, req);
  const basename = new URL(basePath).pathname;
  const language = config?.i18n?.web ?? DEFAULT_LANGUAGE;
  const darkMode = config?.web?.darkMode ?? false;
  const title = config?.web?.title ?? WEB_TITLE;
  const scope = config?.web?.scope ?? '';
  // FIXME: logo URI is incomplete
  let logoURI = config?.web?.logo ?? '';
  const version = pkgJSON.version;
  const primaryColor = validatePrimaryColor(config?.web?.primary_color) ?? '#4b5e40';
  const { scriptsBodyAfter, metaScripts, bodyBefore } = config?.web;
  const options = {
    darkMode,
    url_prefix,
    basename,
    basePath,
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
      debug('web options %o', options);
      debug('web manifestFiles %o', manifestFiles);
      webPage = renderTemplate(
        {
          manifest: manifestFiles ?? defaultManifestFiles,
          options,
          scriptsBodyAfter,
          metaScripts,
          bodyBefore,
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
