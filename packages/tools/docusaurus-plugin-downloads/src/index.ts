/* eslint-disable no-console */
import { LoadContext, Plugin } from '@docusaurus/types';
import { normalizeUrl } from '@docusaurus/utils';
import { readFileSync } from 'fs';
import { join } from 'path';

const data = {
  package: 'verdaccio',
  downloads: {
    '4.0.0-beta.8': 3,
    '4.6.1': 5,
    '4.5.1': 247,
    '8.0.0-next-8.5': 6,
    '5.30.1': 2,
    '2.5.0': 2,
    '4.12.2': 883,
    '4.0.0': 13,
    '5.14.0': 347,
    '5.27.0': 428,
    '5.8.0': 20,
    '5.23.2': 572,
    '5.2.2': 39,
    '5.7.0': 17,
    '4.6.2': 50,
    '3.8.6': 3,
    '4.0.0-beta.5': 4,
    '3.7.1': 1,
    '3.11.5': 1,
    '4.0.0-beta.9': 3,
    '4.0.3': 9,
    '5.28.0': 7,
    '8.0.0-next-8.6': 6,
    '2.1.0': 3,
    '6.0.5': 6716,
    '3.0.0-alpha.4': 3,
    '5.15.3': 116,
    '3.0.0-beta.12': 2,
    '5.11.0': 23,
    '5.4.0': 40,
    '5.1.2': 8438,
    '5.13.3': 670,
    '5.31.1': 8896,
    '5.9.0': 82,
    '4.12.0': 102,
    '6.0.0-6-next.44': 3,
    '3.1.0': 1,
    '6.0.2': 3241,
    '3.8.5': 1,
    '5.16.0': 1,
    '5.33.0': 13489,
    '2.7.4': 4,
    '5.24.1': 138,
    '3.5.0': 3,
    '5.29.2': 469,
    '3.0.0-beta.2': 1,
    '5.31.0': 1960,
    '5.3.1': 7,
    '3.8.3': 1,
    '5.19.1': 52,
    '3.12.0': 16,
    '4.2.1': 1,
    '5.13.2': 1,
    '5.30.0': 5,
    '4.11.0': 238,
    '4.11.2': 1,
    '5.26.2': 195,
    '5.20.1': 768,
    '5.0.4': 2712,
    '5.19.0': 3,
    '5.13.0': 600,
    '4.3.5': 27,
    '3.2.0': 2,
    '4.8.1': 23,
    '5.1.3': 5,
    '2.7.3': 3,
    '5.22.0': 1,
    '5.6.2': 3,
    '5.21.1': 1861,
    '6.0.0-6-next.37': 3,
    '5.30.2': 397,
    '5.1.1': 182,
    '5.3.2': 5,
    '7.0.0-next.0': 3,
    '5.24.0': 1,
    '3.11.4': 1,
    '4.13.2': 3774,
    '3.13.1': 5,
    '5.32.2': 9226,
    '6.0.0-6-next.28': 1,
    '7.0.0-next.2': 1,
    '5.29.1': 117,
    '5.5.0': 5,
    '5.32.0': 55,
    '6.0.3': 70,
    '3.0.0-alpha.3': 3,
    '5.22.1': 207,
    '7.0.0-next.1': 1,
    '5.21.2': 18,
    '5.15.2': 8,
    '5.18.0': 201,
    '4.0.0-beta.6': 1,
    '2.2.7-r': 1,
    '5.12.0': 4,
    '2.1.2': 2,
    '4.13.0': 13,
    '5.26.1': 122,
    '4.11.3': 1,
    '5.10.2': 24,
    '6.0.4': 449,
    '6.0.0-beta.1': 411,
    '6.0.0-6-next.76': 3831,
    '5.16.3': 962,
    '2.3.5': 6,
    '3.0.0': 2,
    '3.11.2': 3,
    '3.0.0-alpha.12': 1,
    '4.5.0': 1,
    '5.23.0': 1,
    '2.2.5': 1,
    '3.7.0': 4,
    '3.5.1': 3,
    '4.12.1': 1,
    '4.4.0': 4,
    '4.0.0-beta.4': 1,
    '6.0.0-6-next.49': 1,
    '5.16.1': 1,
    '4.3.4': 4,
    '7.0.0-next-7.15': 1,
    '5.0.0-alpha.4': 1,
    '5.10.1': 2,
    '5.32.1': 6020,
    '3.0.0-beta.1': 3,
    '3.0.0-alpha.1': 1,
    '4.1.0': 2,
    '5.1.4': 1,
    '5.29.0': 1273,
    '5.15.4': 144,
    '3.0.2': 4,
    '3.11.3': 2,
    '3.10.2': 1,
    '6.0.0-6-next.53': 1,
    '4.4.2': 1,
    '6.0.0-6-next.42': 1,
    '3.0.0-beta.7': 1,
    '5.25.0': 8490,
    '3.1.2': 1,
    '5.17.0': 31,
    '6.0.0-6-next.50': 1,
    '4.0.0-beta.3': 1,
    '5.1.5': 1,
    '4.2.2': 3,
    '3.0.1': 3,
    '2.6.0': 2,
    '2.6.6': 1,
    '4.3.3': 1,
    '6.0.0-6-next.59': 3,
    '6.0.0-6-next.31': 3,
    '5.30.3': 2799,
    '5.23.1': 2,
    '6.0.0-6-next.36': 3,
    '2.2.2': 2,
    '5.21.0': 2,
    '2.2.6': 1,
    '2.1.7': 1,
    '8.0.0-next-8.4': 1,
    '3.4.0': 3,
    '2.1.1': 2,
    '4.3.1': 1,
    '2.3.4': 2,
    '4.0.0-alpha.0': 2,
    '5.13.1': 3,
    '5.26.3': 821,
    '5.26.0': 9,
    '6.0.1': 1032,
    '5.5.2': 55,
    '5.1.6': 173,
    '5.0.0': 7,
    '8.0.0-next-8.7': 10,
    '2.6.4': 1,
    '6.0.0': 20147,
    '5.6.0': 14,
    '5.3.0': 7,
    '7.0.0-next-7.10': 1,
    '3.8.4': 1,
    '3.0.0-alpha.11': 1,
    '2.7.0': 1,
    '5.10.3': 1,
    '3.11.7': 2,
    '2.6.5': 1,
    '3.12.1': 3,
    '5.15.1': 1,
    '4.9.0': 1,
    '4.11.1': 6,
    '3.6.0': 1,
    '4.0.2': 1,
    '1.4.0': 1,
    '4.0.0-beta.10': 2,
    '4.0.4': 4,
    '2.3.6': 1,
    '6.0.0-6-next.51': 1,
    '2.2.0': 2,
    '5.15.0': 1,
    '3.11.0': 1,
    '3.11.1': 4,
    '5.1.0': 2,
    '6.0.0-6-next.73': 2,
    '7.0.0-next-8.21': 2,
    '5.27.1': 4,
    '4.7.0': 1,
    '6.0.0-beta.2': 3,
    '3.8.2': 1,
    '3.0.0-beta.0': 1,
    '6.0.0-6-next.67': 29,
    '5.2.0': 1,
    '4.10.0': 2,
  },
};

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
  const { pathFileName, debug = true } = options;
  if (debug) {
    console.log('[DOWNLOADS_PLUGIN] Opts Input:', opts);
    console.log('[DOWNLOADS_PLUGIN] Options:', options);
  }
  return {
    name: 'docusaurus-plugin-downloads',
    async loadContent() {
      let content: Record<string, unknown> | null = null;
      // const contributorsFilesName = pathFileName || join(__dirname, 'contributors.json');
      try {
        return { data };
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
      // const contributorsJsonPath = await createData('contributors.json', JSON.stringify(content));
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
