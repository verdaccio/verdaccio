/* eslint-disable no-console */
import { LoadContext, Plugin } from '@docusaurus/types';
import { normalizeUrl } from '@docusaurus/utils';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export interface PluginOptions {
  debug?: boolean;
  pathFileName?: string;
}

export const DEFAULT_OPTIONS: PluginOptions = {
  debug: false,
};

export default function contributorsPlugin(
  context: LoadContext,
  opts: PluginOptions
): Plugin<Record<string, unknown> | null> {
  const { baseUrl } = context.siteConfig;
  const options: PluginOptions = { ...DEFAULT_OPTIONS, ...opts };
  const { pathFileName, debug = true } = options;
  if (debug) {
    console.log('[CONTRIBUTORS_PLUGIN] Opts Input:', opts);
    console.log('[CONTRIBUTORS_PLUGIN] Options:', options);
  }
  return {
    name: 'docusaurus-plugin-contributors',
    async loadContent() {
      let content: Record<string, unknown> | null = null;
      const contributorsFilesName = pathFileName || join(__dirname, 'contributors.json');
      try {
        content = JSON.parse(readFileSync(contributorsFilesName, 'utf8'));
        return {
          contributors: content.contributors,
          repositories: content.repositories,
        };
      } catch (error) {
        console.log('error', error);
        return { error: true };
      }
    },
    async contentLoaded({ content, actions }) {
      const { createData, addRoute } = actions;
      if (!content) {
        return;
      }
      const contributorsJsonPath = await createData('contributors.json', JSON.stringify(content));
      const routeOptions = {
        path: normalizeUrl([baseUrl, 'contributors']),
        component: '@site/src/components/Contributors.tsx',
        modules: {
          data: contributorsJsonPath,
        },
        exact: true,
      };
      if (debug) {
        console.error('[CONTRIBUTORS_PLUGIN] Route:', routeOptions);
      }
      // @ts-ignore
      addRoute(routeOptions);
    },
  };
}
