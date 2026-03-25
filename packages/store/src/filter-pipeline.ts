import buildDebug from 'debug';

import type { pluginUtils } from '@verdaccio/core';
import { PLUGIN_CATEGORY, PLUGIN_PREFIX, pluginUtils as pluginSanity } from '@verdaccio/core';
import { asyncLoadPlugin } from '@verdaccio/loaders';
import type { Config, Logger, Manifest } from '@verdaccio/types';

const debug = buildDebug('verdaccio:filter-pipeline');

export type Filters = pluginUtils.ManifestFilter<Config>[];

/**
 * Apply all loaded filter plugins to a manifest in sequence.
 * Each filter receives the output of the previous one.
 */
export async function applyManifestFilters(
  manifest: Manifest,
  filters: pluginUtils.ManifestFilter<unknown>[],
  logger: Logger
): Promise<[Manifest, any[]]> {
  if (!filters || filters.length === 0) {
    return [manifest, []];
  }

  const filterPluginErrors: any[] = [];
  let filteredManifest = { ...manifest };
  for (const filter of filters) {
    try {
      filteredManifest = await filter.filter_metadata(filteredManifest);
    } catch (err: any) {
      logger.error({ err }, 'filter has failed: @{err.message}');
      filterPluginErrors.push(err);
    }
  }
  return [filteredManifest, filterPluginErrors];
}

/**
 * Load filter plugins using the same loader Verdaccio uses at startup.
 */
export async function loadFilterPlugins(config: Config, logger: Logger): Promise<Filters> {
  const filters = await asyncLoadPlugin<pluginUtils.ManifestFilter<unknown>>(
    config.filters,
    {
      config,
      logger,
    },
    pluginSanity.filterSanityCheck,
    false,
    config.server?.pluginPrefix ?? PLUGIN_PREFIX,
    PLUGIN_CATEGORY.FILTER
  );
  debug('filters available %o', filters.length);
  return filters;
}
