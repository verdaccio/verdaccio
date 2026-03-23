import { describe, expect, test } from 'vitest';

import { pluginUtils } from '@verdaccio/core';

import PackageFilterPlugin from '../src/index';

const noopLogger = {
  debug: () => {},
  error: () => {},
  warn: () => {},
  info: () => {},
  trace: () => {},
  fatal: () => {},
  child: () => noopLogger,
} as any;

const pluginOptions = {
  logger: noopLogger,
  config: {} as any,
} as pluginUtils.PluginOptions;

describe('Plugin loading verification', () => {
  test('should export a default class', () => {
    expect(PackageFilterPlugin).toBeDefined();
    expect(typeof PackageFilterPlugin).toBe('function');
  });

  test('should be instantiable with minimal config', () => {
    const plugin = new PackageFilterPlugin({}, pluginOptions);
    expect(plugin).toBeInstanceOf(PackageFilterPlugin);
  });

  test('should implement filter_metadata method', () => {
    const plugin = new PackageFilterPlugin({}, pluginOptions);
    expect(typeof plugin.filter_metadata).toBe('function');
  });

  test('should extend pluginUtils.Plugin', () => {
    const plugin = new PackageFilterPlugin({}, pluginOptions);
    expect(plugin).toBeInstanceOf(pluginUtils.Plugin);
  });
});
