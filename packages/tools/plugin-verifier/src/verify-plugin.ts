import buildDebug from 'debug';
import { resolve } from 'node:path';

import { PLUGIN_PREFIX } from '@verdaccio/core';
import { asyncLoadPlugin } from '@verdaccio/loaders';
import { logger, setup } from '@verdaccio/logger';

import { runDiagnostics } from './diagnostics';
import { getSanityCheck } from './sanity-checks';
import type { VerifyPluginOptions, VerifyResult } from './types';

const debug = buildDebug('verdaccio:plugin:verifier');

/**
 * Verifies that a plugin can be loaded by Verdaccio.
 *
 * Uses `asyncLoadPlugin` from `@verdaccio/loaders` — the same loader
 * Verdaccio uses at startup — so the verification is identical to what
 * happens in production.
 *
 * Steps verified:
 * 1. Module resolution — can the plugin be found/required?
 * 2. Export validation — does it export a function or a class (default export)?
 * 3. Instantiation — can the plugin be instantiated with a config and options?
 * 4. Sanity check — does the instance implement the required methods for its category?
 *
 * When loading fails, detailed diagnostics are included in the result
 * to pinpoint exactly which step failed and why.
 */
export async function verifyPlugin(options: VerifyPluginOptions): Promise<VerifyResult> {
  const {
    pluginPath,
    category,
    pluginConfig = {},
    sanityCheck: customSanityCheck,
    prefix = PLUGIN_PREFIX,
    pluginsFolder,
    configPath,
  } = options;

  debug('verifying plugin %o for category %o', pluginPath, category);
  debug('prefix: %o, pluginsFolder: %o', prefix, pluginsFolder);

  await setup({});

  const sanityCheck = customSanityCheck ?? getSanityCheck(category);
  debug('using %s sanity check', customSanityCheck ? 'custom' : 'default');

  const config: any = {
    ...pluginConfig,
  };

  if (pluginsFolder) {
    config.plugins = resolve(pluginsFolder);
    debug('resolved plugins folder: %o', config.plugins);
  }

  if (configPath) {
    config.configPath = configPath;
    debug('config path: %o', config.configPath);
  }

  const pluginConfigs = { [pluginPath]: pluginConfig };
  debug('plugin config: %o', pluginConfigs);

  try {
    const plugins = await asyncLoadPlugin(
      pluginConfigs,
      { config, logger },
      sanityCheck,
      false,
      prefix,
      category
    );

    debug('plugins loaded: %o', plugins.length);

    if (plugins.length > 0) {
      debug('verification succeeded for %o', pluginPath);
      return {
        success: true,
        pluginName: pluginPath,
        category,
        pluginsLoaded: plugins.length,
      };
    }

    debug('verification failed, running diagnostics for %o', pluginPath);
    const diagnostics = await runDiagnostics(options);
    const failedStep = diagnostics.find((d) => !d.pass);

    return {
      success: false,
      pluginName: pluginPath,
      category,
      pluginsLoaded: 0,
      error:
        failedStep?.message ??
        `Plugin "${pluginPath}" could not be loaded for category "${category}"`,
      diagnostics,
    };
  } catch (err: any) {
    debug('verification error for %o: %o', pluginPath, err.message);
    const diagnostics = await runDiagnostics(options);

    return {
      success: false,
      pluginName: pluginPath,
      category,
      pluginsLoaded: 0,
      error: err.message,
      diagnostics,
    };
  }
}
