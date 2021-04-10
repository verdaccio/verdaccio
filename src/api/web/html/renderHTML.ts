import { URL } from 'url';
import buildDebug from 'debug';
import LRU from 'lru-cache';
import { HEADERS } from '@verdaccio/commons-api';

import { getPublicUrl } from '../../../lib/utils';
import { WEB_TITLE } from '../../../lib/constants';
import renderTemplate from './template';

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

export default function renderHTML(config, manifest, manifestFiles, req, res) {
  const { url_prefix } = config;
  const base = getPublicUrl(config?.url_prefix, req);
  const basename = new URL(base).pathname;
  const language = config?.i18n?.web ?? DEFAULT_LANGUAGE;
  const darkMode = config?.web?.darkMode ?? false;
  const title = config?.web?.title ?? WEB_TITLE;
  const scope = config?.web?.scope ?? '';
  let logoURI = config?.web?.logo ?? '';
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
