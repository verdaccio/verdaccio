/* eslint-disable no-console */
import { LoadContext, Plugin } from '@docusaurus/types';
import { normalizeUrl } from '@docusaurus/utils';

export interface PluginOptions {
  debug?: boolean;
  pathFileName?: string;
}

export const DEFAULT_OPTIONS: PluginOptions = {
  debug: false,
};

export default function downloadsPlugin(
  context: LoadContext,
  opts: PluginOptions
): Plugin<Record<string, unknown> | null> {
  const { baseUrl } = context.siteConfig;
  const options: PluginOptions = { ...DEFAULT_OPTIONS, ...opts };
  const { debug = true } = options;
  if (debug) {
    console.log('[DOWNLOADS_PLUGIN] Opts Input:', opts);
    console.log('[DOWNLOADS_PLUGIN] Options:', options);
  }
  return {
    name: 'docusaurus-plugin-downloads',
    async loadContent() {
      return {};
    },
    async contentLoaded({ content, actions }) {
      const { addRoute } = actions;
      if (!content) {
        return;
      }
      const routeOptions = {
        path: normalizeUrl([baseUrl, 'downloads']),
        component: '@site/src/components/Downloads.tsx',
        modules: {
          data: [],
        },
        exact: true,
      };
      if (debug) {
        console.error('[DOWNLOADS_PLUGIN] Route:', routeOptions);
      }
      // @ts-ignore
      addRoute(routeOptions);
    },
  };
}
