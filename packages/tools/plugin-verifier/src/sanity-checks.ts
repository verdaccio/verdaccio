import { PLUGIN_CATEGORY, pluginUtils } from '@verdaccio/core';

import type { PluginCategory } from './types';

// Re-export sanity checks from @verdaccio/core for convenience.
export const authSanityCheck = pluginUtils.authSanityCheck;
export const storageSanityCheck = pluginUtils.storageSanityCheck;
export const middlewareSanityCheck = pluginUtils.middlewareSanityCheck;
export const filterSanityCheck = pluginUtils.filterSanityCheck;

/**
 * Returns the appropriate sanity check function for the given plugin category.
 */
export function getSanityCheck(category: PluginCategory): (plugin: any) => boolean {
  switch (category) {
    case PLUGIN_CATEGORY.AUTHENTICATION:
      return authSanityCheck;
    case PLUGIN_CATEGORY.STORAGE:
      return storageSanityCheck;
    case PLUGIN_CATEGORY.MIDDLEWARE:
      return middlewareSanityCheck;
    case PLUGIN_CATEGORY.FILTER:
      return filterSanityCheck;
    default:
      return () => true;
  }
}
