import { URL } from 'url';
import buildDebug from 'debug';
import LRU from 'lru-cache';
import { HEADERS } from '@verdaccio/commons-api';
import { getPublicUrl } from '@verdaccio/url';

import { WEB_TITLE } from '@verdaccio/config';
import { hasLogin, validatePrimaryColor } from './utils/web-utils';
import renderTemplate from './template';

const pkgJSON = require('../package.json');
const DEFAULT_LANGUAGE = 'es-US';
const cache = new LRU({ max: 500, maxAge: 1000 * 60 * 60 });

const debug = buildDebug('verdaccio:web:render');

const defaultManifestFiles = {
  js: ['runtime.js', 'vendors.js', 'main.js'],
  ico: 'favicon.ico',
};

export default function renderHTML(config, manifest, manifestFiles, req, res) {
  const { url_prefix } = config;
  const base = getPublicUrl(config?.url_prefix, req);
  const basename = new URL(base).pathname;
  const language = config?.i18n?.web ?? DEFAULT_LANGUAGE;
  const darkMode = config?.web?.darkMode ?? false;
  const title = config?.web?.title ?? WEB_TITLE;
  const login = hasLogin(config);
  const scope = config?.web?.scope ?? '';
  const logoURI = config?.web?.logo ?? '';
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
    logoURI,
    login,
    pkgManagers,
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
  } catch (error: any) {
    throw new Error(`theme could not be load, stack ${error.stack}`);
  }
  res.setHeader('Content-Type', HEADERS.TEXT_HTML);
  res.send(webPage);
  debug('render web');
}
