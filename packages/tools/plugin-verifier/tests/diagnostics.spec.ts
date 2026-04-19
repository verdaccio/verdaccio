import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

import { PLUGIN_CATEGORY } from '@verdaccio/core';

import { resolveEntryPoint, runDiagnostics } from '../src/diagnostics';

const fixturesPath = join(import.meta.dirname, 'fixtures');

describe('runDiagnostics', () => {
  describe('resolve phase', () => {
    it('should fail when plugins folder does not exist', async () => {
      const steps = await runDiagnostics({
        pluginPath: 'some-plugin',
        category: PLUGIN_CATEGORY.AUTHENTICATION,
        pluginsFolder: '/does/not/exist',
      });

      expect(steps).toHaveLength(1);
      expect(steps[0].phase).toBe('resolve');
      expect(steps[0].pass).toBe(false);
      expect(steps[0].message).toContain('does not exist');
    });

    it('should fail when plugin directory is not found in plugins folder', async () => {
      const steps = await runDiagnostics({
        pluginPath: 'non-existent',
        category: PLUGIN_CATEGORY.AUTHENTICATION,
        pluginsFolder: fixturesPath,
      });

      expect(steps).toHaveLength(1);
      expect(steps[0].phase).toBe('resolve');
      expect(steps[0].pass).toBe(false);
      expect(steps[0].message).toContain('verdaccio-non-existent');
    });

    it('should resolve from plugins folder successfully', async () => {
      const steps = await runDiagnostics({
        pluginPath: 'valid-auth-plugin',
        category: PLUGIN_CATEGORY.AUTHENTICATION,
        pluginsFolder: fixturesPath,
      });

      const resolveStep = steps.find((s) => s.phase === 'resolve');
      expect(resolveStep?.pass).toBe(true);
      expect(resolveStep?.message).toContain('resolved from');
    });

    it('should resolve from node_modules when no plugins folder given', async () => {
      const steps = await runDiagnostics({
        pluginPath: '@verdaccio/core',
        category: PLUGIN_CATEGORY.AUTHENTICATION,
      });

      const resolveStep = steps.find((s) => s.phase === 'resolve');
      expect(resolveStep?.pass).toBe(true);
    });

    it('should fail resolution from node_modules for missing package', async () => {
      const steps = await runDiagnostics({
        pluginPath: 'totally-nonexistent-package-xyz',
        category: PLUGIN_CATEGORY.AUTHENTICATION,
      });

      expect(steps).toHaveLength(1);
      expect(steps[0].phase).toBe('resolve');
      expect(steps[0].pass).toBe(false);
      expect(steps[0].message).toContain('not found');
    });

    it('should handle scoped plugin names without adding prefix', async () => {
      const steps = await runDiagnostics({
        pluginPath: '@scope/my-plugin',
        category: PLUGIN_CATEGORY.AUTHENTICATION,
      });

      expect(steps).toHaveLength(1);
      expect(steps[0].phase).toBe('resolve');
      expect(steps[0].pass).toBe(false);
      // Scoped names should not get the verdaccio- prefix
      expect(steps[0].message).toContain('@scope/my-plugin');
      expect(steps[0].message).not.toContain('verdaccio-@scope');
    });
  });

  describe('export phase', () => {
    it('should fail when module does not export a function', async () => {
      const steps = await runDiagnostics({
        pluginPath: 'invalid-plugin',
        category: PLUGIN_CATEGORY.AUTHENTICATION,
        pluginsFolder: fixturesPath,
      });

      const exportStep = steps.find((s) => s.phase === 'export');
      expect(exportStep).toBeDefined();
      expect(exportStep?.pass).toBe(false);
      expect(exportStep?.message).toContain('does not export a function');
      expect(exportStep?.message).toContain('Exported keys');
    });

    it('should detect CommonJS factory function export', async () => {
      const steps = await runDiagnostics({
        pluginPath: 'valid-auth-plugin',
        category: PLUGIN_CATEGORY.AUTHENTICATION,
        pluginsFolder: fixturesPath,
      });

      const exportStep = steps.find((s) => s.phase === 'export');
      expect(exportStep?.pass).toBe(true);
      expect(exportStep?.message).toContain('CommonJS');
    });

    it('should detect ES6 default export', async () => {
      const steps = await runDiagnostics({
        pluginPath: 'valid-auth-es6-plugin',
        category: PLUGIN_CATEGORY.AUTHENTICATION,
        pluginsFolder: fixturesPath,
      });

      const exportStep = steps.find((s) => s.phase === 'export');
      expect(exportStep?.pass).toBe(true);
      expect(exportStep?.message).toContain('ES6');
    });
  });

  describe('instantiate phase', () => {
    it('should fail when plugin throws during instantiation', async () => {
      const steps = await runDiagnostics({
        pluginPath: 'throwing-plugin',
        category: PLUGIN_CATEGORY.AUTHENTICATION,
        pluginsFolder: fixturesPath,
      });

      const instantiateStep = steps.find((s) => s.phase === 'instantiate');
      expect(instantiateStep).toBeDefined();
      expect(instantiateStep?.pass).toBe(false);
      expect(instantiateStep?.message).toContain('threw during instantiation');
    });

    it('should fail when plugin factory returns null', async () => {
      const steps = await runDiagnostics({
        pluginPath: 'null-plugin',
        category: PLUGIN_CATEGORY.AUTHENTICATION,
        pluginsFolder: fixturesPath,
      });

      const instantiateStep = steps.find((s) => s.phase === 'instantiate');
      expect(instantiateStep).toBeDefined();
      expect(instantiateStep?.pass).toBe(false);
      expect(instantiateStep?.message).toContain('null');
    });

    it('should pass instantiation for a valid plugin', async () => {
      const steps = await runDiagnostics({
        pluginPath: 'valid-auth-plugin',
        category: PLUGIN_CATEGORY.AUTHENTICATION,
        pluginsFolder: fixturesPath,
      });

      const instantiateStep = steps.find((s) => s.phase === 'instantiate');
      expect(instantiateStep?.pass).toBe(true);
      expect(instantiateStep?.message).toContain('successfully');
    });
  });

  describe('sanity-check phase', () => {
    it('should fail when plugin does not implement required methods', async () => {
      const steps = await runDiagnostics({
        pluginPath: 'wrong-category-plugin',
        category: PLUGIN_CATEGORY.AUTHENTICATION,
        pluginsFolder: fixturesPath,
      });

      const sanityStep = steps.find((s) => s.phase === 'sanity-check');
      expect(sanityStep).toBeDefined();
      expect(sanityStep?.pass).toBe(false);
      expect(sanityStep?.message).toContain('authentication');
      expect(sanityStep?.message).toContain('Available methods');
    });

    it('should pass all phases for a valid plugin', async () => {
      const steps = await runDiagnostics({
        pluginPath: 'valid-auth-plugin',
        category: PLUGIN_CATEGORY.AUTHENTICATION,
        pluginsFolder: fixturesPath,
      });

      expect(steps).toHaveLength(4);
      expect(steps.every((s) => s.pass)).toBe(true);
      expect(steps.map((s) => s.phase)).toEqual([
        'resolve',
        'export',
        'instantiate',
        'sanity-check',
      ]);
    });

    it('should use custom sanity check when provided', async () => {
      const steps = await runDiagnostics({
        pluginPath: 'valid-auth-plugin',
        category: PLUGIN_CATEGORY.AUTHENTICATION,
        pluginsFolder: fixturesPath,
        sanityCheck: () => false,
      });

      const sanityStep = steps.find((s) => s.phase === 'sanity-check');
      expect(sanityStep?.pass).toBe(false);
    });

    it('should verify each plugin category', async () => {
      const categoryFixtures = [
        { category: PLUGIN_CATEGORY.STORAGE, fixture: 'valid-storage-plugin' },
        { category: PLUGIN_CATEGORY.MIDDLEWARE, fixture: 'valid-middleware-plugin' },
        { category: PLUGIN_CATEGORY.FILTER, fixture: 'valid-filter-plugin' },
      ];

      for (const { category, fixture } of categoryFixtures) {
        const steps = await runDiagnostics({
          pluginPath: fixture,
          category,
          pluginsFolder: fixturesPath,
        });

        const sanityStep = steps.find((s) => s.phase === 'sanity-check');
        expect(sanityStep?.pass).toBe(true);
      }
    });
  });

  describe('early return behavior', () => {
    it('should stop at resolve phase on failure', async () => {
      const steps = await runDiagnostics({
        pluginPath: 'non-existent',
        category: PLUGIN_CATEGORY.AUTHENTICATION,
        pluginsFolder: fixturesPath,
      });

      expect(steps).toHaveLength(1);
      expect(steps[0].phase).toBe('resolve');
    });

    it('should stop at export phase on failure', async () => {
      const steps = await runDiagnostics({
        pluginPath: 'invalid-plugin',
        category: PLUGIN_CATEGORY.AUTHENTICATION,
        pluginsFolder: fixturesPath,
      });

      expect(steps).toHaveLength(2);
      expect(steps[0].phase).toBe('resolve');
      expect(steps[1].phase).toBe('export');
    });

    it('should stop at instantiate phase on failure', async () => {
      const steps = await runDiagnostics({
        pluginPath: 'throwing-plugin',
        category: PLUGIN_CATEGORY.AUTHENTICATION,
        pluginsFolder: fixturesPath,
      });

      expect(steps).toHaveLength(3);
      expect(steps[0].phase).toBe('resolve');
      expect(steps[1].phase).toBe('export');
      expect(steps[2].phase).toBe('instantiate');
    });
  });

  describe('resolveEntryPoint', () => {
    it('should resolve exports["."] as a string', () => {
      const dir = join(fixturesPath, 'entry-point-exports-string');
      expect(resolveEntryPoint(dir)).toBe(join(dir, './lib/main.js'));
    });

    it('should resolve exports["."].import.default', () => {
      const dir = join(fixturesPath, 'entry-point-exports-import-default');
      expect(resolveEntryPoint(dir)).toBe(join(dir, './lib/entry.mjs'));
    });

    it('should resolve exports["."].import as a string', () => {
      const dir = join(fixturesPath, 'entry-point-exports-import-string');
      expect(resolveEntryPoint(dir)).toBe(join(dir, './lib/entry.mjs'));
    });

    it('should resolve exports["."].default', () => {
      const dir = join(fixturesPath, 'entry-point-exports-default');
      expect(resolveEntryPoint(dir)).toBe(join(dir, './lib/fallback.js'));
    });

    it('should resolve pkg.module', () => {
      const dir = join(fixturesPath, 'entry-point-module');
      expect(resolveEntryPoint(dir)).toBe(join(dir, './esm/index.mjs'));
    });

    it('should resolve pkg.main', () => {
      const dir = join(fixturesPath, 'entry-point-main');
      expect(resolveEntryPoint(dir)).toBe(join(dir, './dist/index.cjs'));
    });

    it('should fallback to index.js when no package.json exists', () => {
      const dir = join(fixturesPath, 'entry-point-fallback');
      expect(resolveEntryPoint(dir)).toBe(join(dir, 'index.js'));
    });

    it('should fallback to index.js when package.json is invalid', () => {
      const dir = join(fixturesPath, 'entry-point-bad-json');
      expect(resolveEntryPoint(dir)).toBe(join(dir, 'index.js'));
    });
  });

  describe('plugin config forwarding', () => {
    it('should pass plugin config to the plugin constructor', async () => {
      const steps = await runDiagnostics({
        pluginPath: 'valid-auth-plugin',
        category: PLUGIN_CATEGORY.AUTHENTICATION,
        pluginsFolder: fixturesPath,
        pluginConfig: { custom: 'value' },
      });

      expect(steps.every((s) => s.pass)).toBe(true);
    });
  });
});
