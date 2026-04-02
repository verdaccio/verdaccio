import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

import { PLUGIN_CATEGORY } from '@verdaccio/core';

import { verifyPlugin } from '../src/verify-plugin';

const fixturesPath = join(import.meta.dirname, 'fixtures');

describe('verifyPlugin', () => {
  describe('authentication plugins', () => {
    it('should verify a valid auth plugin (CommonJS)', async () => {
      const result = await verifyPlugin({
        pluginPath: 'valid-auth-plugin',
        category: PLUGIN_CATEGORY.AUTHENTICATION,
        pluginsFolder: fixturesPath,
      });

      expect(result.success).toBe(true);
      expect(result.pluginsLoaded).toBe(1);
      expect(result.error).toBeUndefined();
      expect(result.diagnostics).toBeUndefined();
    });

    it('should verify a valid auth plugin (ES6 default export)', async () => {
      const result = await verifyPlugin({
        pluginPath: 'valid-auth-es6-plugin',
        category: PLUGIN_CATEGORY.AUTHENTICATION,
        pluginsFolder: fixturesPath,
      });

      expect(result.success).toBe(true);
      expect(result.pluginsLoaded).toBe(1);
    });

    it('should fail sanity check when a middleware plugin is tested as auth', async () => {
      const result = await verifyPlugin({
        pluginPath: 'wrong-category-plugin',
        category: PLUGIN_CATEGORY.AUTHENTICATION,
        pluginsFolder: fixturesPath,
      });

      expect(result.success).toBe(false);
      expect(result.pluginsLoaded).toBe(0);
      expect(result.diagnostics).toBeDefined();

      const sanityStep = result.diagnostics!.find((d) => d.phase === 'sanity-check');
      expect(sanityStep?.pass).toBe(false);
      expect(sanityStep?.message).toContain('authentication');
      expect(sanityStep?.message).toContain('register_middlewares');
    });
  });

  describe('storage plugins', () => {
    it('should verify a valid storage plugin', async () => {
      const result = await verifyPlugin({
        pluginPath: 'valid-storage-plugin',
        category: PLUGIN_CATEGORY.STORAGE,
        pluginsFolder: fixturesPath,
      });

      expect(result.success).toBe(true);
      expect(result.pluginsLoaded).toBe(1);
    });
  });

  describe('middleware plugins', () => {
    it('should verify a valid middleware plugin', async () => {
      const result = await verifyPlugin({
        pluginPath: 'valid-middleware-plugin',
        category: PLUGIN_CATEGORY.MIDDLEWARE,
        pluginsFolder: fixturesPath,
      });

      expect(result.success).toBe(true);
      expect(result.pluginsLoaded).toBe(1);
    });
  });

  describe('filter plugins', () => {
    it('should verify a valid filter plugin', async () => {
      const result = await verifyPlugin({
        pluginPath: 'valid-filter-plugin',
        category: PLUGIN_CATEGORY.FILTER,
        pluginsFolder: fixturesPath,
      });

      expect(result.success).toBe(true);
      expect(result.pluginsLoaded).toBe(1);
    });
  });

  describe('diagnostics', () => {
    it('should diagnose plugin directory not found', async () => {
      const result = await verifyPlugin({
        pluginPath: 'non-existent-plugin',
        category: PLUGIN_CATEGORY.AUTHENTICATION,
        pluginsFolder: fixturesPath,
      });

      expect(result.success).toBe(false);
      expect(result.diagnostics).toBeDefined();
      expect(result.diagnostics).toHaveLength(1);

      const step = result.diagnostics![0];
      expect(step.phase).toBe('resolve');
      expect(step.pass).toBe(false);
      expect(step.message).toContain('verdaccio-non-existent-plugin');
    });

    it('should diagnose non-existent plugins folder', async () => {
      const result = await verifyPlugin({
        pluginPath: 'some-plugin',
        category: PLUGIN_CATEGORY.AUTHENTICATION,
        pluginsFolder: '/does/not/exist',
      });

      expect(result.success).toBe(false);
      expect(result.diagnostics).toBeDefined();

      const step = result.diagnostics![0];
      expect(step.phase).toBe('resolve');
      expect(step.pass).toBe(false);
      expect(step.message).toContain('does not exist');
    });

    it('should diagnose invalid export shape', async () => {
      const result = await verifyPlugin({
        pluginPath: 'invalid-plugin',
        category: PLUGIN_CATEGORY.AUTHENTICATION,
        pluginsFolder: fixturesPath,
      });

      expect(result.success).toBe(false);
      expect(result.diagnostics).toBeDefined();

      const resolveStep = result.diagnostics!.find((d) => d.phase === 'resolve');
      expect(resolveStep?.pass).toBe(true);

      const exportStep = result.diagnostics!.find((d) => d.phase === 'export');
      expect(exportStep?.pass).toBe(false);
      expect(exportStep?.message).toContain('does not export a function');
    });

    it('should diagnose instantiation failure', async () => {
      const result = await verifyPlugin({
        pluginPath: 'throwing-plugin',
        category: PLUGIN_CATEGORY.AUTHENTICATION,
        pluginsFolder: fixturesPath,
      });

      expect(result.success).toBe(false);
      expect(result.diagnostics).toBeDefined();

      const instantiateStep = result.diagnostics!.find((d) => d.phase === 'instantiate');
      expect(instantiateStep?.pass).toBe(false);
      expect(instantiateStep?.message).toContain('Plugin initialization failed');
    });

    it('should diagnose failed sanity check and list available methods', async () => {
      const result = await verifyPlugin({
        pluginPath: 'wrong-category-plugin',
        category: PLUGIN_CATEGORY.STORAGE,
        pluginsFolder: fixturesPath,
      });

      expect(result.success).toBe(false);
      expect(result.diagnostics).toBeDefined();

      const steps = result.diagnostics!;
      expect(steps.find((d) => d.phase === 'resolve')?.pass).toBe(true);
      expect(steps.find((d) => d.phase === 'export')?.pass).toBe(true);
      expect(steps.find((d) => d.phase === 'instantiate')?.pass).toBe(true);

      const sanityStep = steps.find((d) => d.phase === 'sanity-check');
      expect(sanityStep?.pass).toBe(false);
      expect(sanityStep?.message).toContain('storage');
      expect(sanityStep?.message).toContain('register_middlewares');
    });

    it('should show all steps passing on success', async () => {
      const result = await verifyPlugin({
        pluginPath: 'valid-auth-plugin',
        category: PLUGIN_CATEGORY.AUTHENTICATION,
        pluginsFolder: fixturesPath,
      });

      expect(result.success).toBe(true);
      expect(result.diagnostics).toBeUndefined();
    });
  });

  describe('custom sanity check', () => {
    it('should use a custom sanity check when provided', async () => {
      const result = await verifyPlugin({
        pluginPath: 'valid-auth-plugin',
        category: PLUGIN_CATEGORY.AUTHENTICATION,
        pluginsFolder: fixturesPath,
        sanityCheck: (plugin) => typeof plugin.authenticate === 'function',
      });

      expect(result.success).toBe(true);
      expect(result.pluginsLoaded).toBe(1);
    });

    it('should fail with a custom sanity check that does not pass', async () => {
      const result = await verifyPlugin({
        pluginPath: 'valid-auth-plugin',
        category: PLUGIN_CATEGORY.AUTHENTICATION,
        pluginsFolder: fixturesPath,
        sanityCheck: () => false,
      });

      expect(result.success).toBe(false);
      expect(result.pluginsLoaded).toBe(0);
    });
  });
});
