import buildDebug from 'debug';
import type { Response } from 'express';
import LRU from 'lru-cache';
import path from 'path';
import { URL } from 'url';

import { WEB_TITLE } from '@verdaccio/config';
import { HEADERS } from '@verdaccio/core';
import { ConfigYaml, TemplateUIOptions } from '@verdaccio/types';
import type { RequestOptions } from '@verdaccio/url';
import { getPublicUrl, isURLhasValidProtocol } from '@verdaccio/url';

import type { Manifest } from './manifest';
import renderTemplate from './template';
import type { WebpackManifest } from './template';
import { hasLogin, validatePrimaryColor } from './web-utils';

const DEFAULT_LANGUAGE = 'es-US';
const cache = new LRU({ max: 500, ttl: 1000 * 60 * 60 });

const debug = buildDebug('verdaccio:web:render');

const defaultManifestFiles: Manifest = {
  js: ['runtime.js', 'vendors.js', 'main.js'],
  ico: 'favicon.ico',
  css: [],
};

export function resolveLogo(
  logo: string | undefined,
  url_prefix: string | undefined,
  requestOptions: RequestOptions
) {
  if (typeof logo !== 'string') {
    return '';
  }
  const isLocalFile = logo && !isURLhasValidProtocol(logo);

  if (isLocalFile) {
    return `${getPublicUrl(url_prefix, requestOptions)}-/static/${path.basename(logo)}`;
  } else if (isURLhasValidProtocol(logo)) {
    return logo;
  } else {
    return '';
  }
}

export default function renderHTML(
  config: ConfigYaml,
  manifest: WebpackManifest,
  manifestFiles: Manifest | null | undefined,
  requestOptions: RequestOptions,
  res: Response
) {
  const { url_prefix } = config;
  const base = getPublicUrl(config?.url_prefix, requestOptions);
  const basename = new URL(base).pathname;
  const language = config?.i18n?.web ?? DEFAULT_LANGUAGE;
  const hideDeprecatedVersions = config?.web?.hideDeprecatedVersions ?? false;
  // @ts-ignore
  const needHtmlCache = [undefined, null].includes(config?.web?.html_cache)
    ? true
    : config?.web?.html_cache;
  const darkMode = config?.web?.darkMode ?? false;
  const title = config?.web?.title ?? WEB_TITLE;
  const login = hasLogin(config);
  const scope = config?.web?.scope ?? '';
  const favicon = resolveLogo(config?.web?.favicon, config?.url_prefix, requestOptions);
  const logo = resolveLogo(config?.web?.logo, config?.url_prefix, requestOptions);
  const logoDark = resolveLogo(config?.web?.logoDark, config?.url_prefix, requestOptions);
  const pkgManagers = config?.web?.pkgManagers ?? ['yarn', 'pnpm', 'npm'];
  const version = res.locals.app_version ?? '';
  const flags = {
    ...config.flags,
    // legacy from 5.x
    ...config.experiments,
  };
  const primaryColor =
    validatePrimaryColor(config?.web?.primary_color ?? config?.web?.primaryColor) ?? '#4b5e40';
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
    showRaw,
    showUplinks,
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
    showRaw,
    showUplinks,
    darkMode,
    url_prefix,
    basename,
    base,
    primaryColor,
    version,
    logo,
    logoDark,
    favicon,
    flags,
    login,
    pkgManagers,
    title,
    scope,
    language,
    hideDeprecatedVersions,
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
