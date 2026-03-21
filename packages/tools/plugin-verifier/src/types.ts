import type { PLUGIN_CATEGORY } from '@verdaccio/core';

export type PluginCategory = (typeof PLUGIN_CATEGORY)[keyof typeof PLUGIN_CATEGORY];

export interface VerifyPluginOptions {
  /**
   * The plugin identifier as it would appear in config.yaml.
   * For file-based plugins, this is the folder name inside `pluginsFolder`.
   * For npm plugins, this is the package name (without the prefix for unscoped packages).
   */
  pluginPath: string;
  /**
   * The plugin category to verify against.
   */
  category: PluginCategory;
  /**
   * Optional plugin configuration passed as the first argument when instantiating the plugin.
   */
  pluginConfig?: Record<string, unknown>;
  /**
   * Optional custom sanity check function. If not provided, the default
   * sanity check for the given category is used.
   */
  sanityCheck?: (plugin: any) => boolean;
  /**
   * Plugin name prefix. Defaults to 'verdaccio'.
   */
  prefix?: string;
  /**
   * Absolute path to a plugins folder for file-based plugin loading.
   * Maps to `config.plugins` in Verdaccio configuration.
   */
  pluginsFolder?: string;
  /**
   * Absolute path to the Verdaccio configuration file.
   * Maps to `config.configPath` — required by plugins that resolve
   * relative paths (e.g. htpasswd resolves its `file` relative to this).
   */
  configPath?: string;
}

export interface DiagnosticStep {
  /**
   * The verification phase this diagnostic refers to.
   */
  phase: 'resolve' | 'export' | 'instantiate' | 'sanity-check';
  /**
   * Whether this phase passed.
   */
  pass: boolean;
  /**
   * Human-readable message describing the result.
   */
  message: string;
}

export interface VerifyResult {
  /**
   * Whether the plugin was successfully loaded and passed all checks.
   */
  success: boolean;
  /**
   * The plugin identifier used.
   */
  pluginName: string;
  /**
   * The plugin category verified against.
   */
  category: PluginCategory;
  /**
   * Number of plugins successfully loaded.
   */
  pluginsLoaded: number;
  /**
   * Error message if loading failed.
   */
  error?: string;
  /**
   * Step-by-step diagnostics showing which phase passed or failed.
   * Only populated when the plugin fails to load.
   */
  diagnostics?: DiagnosticStep[];
}
