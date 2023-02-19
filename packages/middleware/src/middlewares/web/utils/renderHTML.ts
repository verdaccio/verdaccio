import buildDebug from 'debug';
import LRU from 'lru-cache';
import path from 'path';
import { URL } from 'url';

import { WEB_TITLE } from '@verdaccio/config';
import { HEADERS } from '@verdaccio/core';
import { TemplateUIOptions } from '@verdaccio/types';
import { isURLhasValidProtocol } from '@verdaccio/url';
import { getPublicUrl } from '@verdaccio/url';

import renderTemplate from './template';
import { hasLogin, validatePrimaryColor } from './web-utils';

const DEFAULT_LANGUAGE = 'es-US';
const cache = new LRU({ max: 500, ttl: 1000 * 60 * 60 });

const debug = buildDebug('verdaccio:web:render');

const defaultManifestFiles = {
  js: ['runtime.js', 'vendors.js', 'main.js'],
  ico: 'favicon.ico',
};

export function resolveLogo(config, req) {
  const isLocalFile = config?.web?.logo && !isURLhasValidProtocol(config?.web?.logo);

  if (isLocalFile) {
    return `${getPublicUrl(config?.url_prefix, req)}-/static/${path.basename(config?.web?.logo)}`;
  } else if (isURLhasValidProtocol(config?.web?.logo)) {
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
  const needHtmlCache = [undefined, null].includes(config?.web?.html_cache)
    ? true
    : config.web.html_cache;
  const darkMode = config?.web?.darkMode ?? false;
  const title = config?.web?.title ?? WEB_TITLE;
  const login = hasLogin(config);
  const scope = config?.web?.scope ?? '';
  const logo = resolveLogo(config, req);
  const pkgManagers = config?.web?.pkgManagers ?? ['yarn', 'pnpm', 'npm'];
  const version = config?.web?.version;
  const flags = {
    ...config.flags,
    // legacy from 5.x
    ...config.experiments,
  };
  const primaryColor = validatePrimaryColor(config?.web?.primary_color) ?? '#4b5e40';
  const {
    scriptsBodyAfter,
    metaScripts,
    scriptsbodyBefore,
    showInfo,
    showSettings,
    showThemeSwitch,
    showFooter,
    showSearch,
    showDownloadTarball,
  } = Object.assign(
    {},
    {
      scriptsBodyAfter: [],
      bodyBefore: [],
      metaScripts: [],
    },
    config?.web
  );
  const options: TemplateUIOptions = {
    showInfo,
    showSettings,
    showThemeSwitch,
    showFooter,
    showSearch,
    showDownloadTarball,
    darkMode,
    url_prefix,
    basename,
    base,
    primaryColor,
    version,
    logo,
    flags,
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
      if (needHtmlCache) {
        cache.set('template', webPage);
        debug('set template cache');
      }
    } else {
      debug('reuse template cache');
    }
  } catch (error: any) {
    throw new Error(`theme could not be load, stack ${error.stack}`);
  }
  res.setHeader('Content-Type', HEADERS.TEXT_HTML);
  res.send(webPage);
  debug('web rendered');
}
