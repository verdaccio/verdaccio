import { types } from 'node:util';

import { PLUGIN_CATEGORY, pluginUtils } from '@verdaccio/core';

import type { PluginCategory } from './types';

export function getAuthRegistrationError(plugin: any): string | undefined {
  for (const method of ['adduser', 'add_user']) {
    const implementation = plugin?.[method];
    if (implementation === undefined) continue;
    if (
      typeof implementation !== 'function' ||
      types.isAsyncFunction(implementation) ||
      Object.prototype.toString.call(implementation) === '[object AsyncFunction]'
    ) {
      return `Auth plugin ${method} must be a non-async function returning void and reporting its result through the callback.`;
    }
  }
}

export function authSanityCheck(plugin: any): boolean {
  return pluginUtils.authSanityCheck(plugin) && getAuthRegistrationError(plugin) === undefined;
}

// Re-export the remaining sanity checks from @verdaccio/core.
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
