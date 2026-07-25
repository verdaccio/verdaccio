import path from 'node:path';
import { describe, expect, test, vi } from 'vitest';

import { tryLoadAsync } from '../src/utils';

const pluginsDir = path.join(__dirname, 'partials', 'modern-plugins');
const pluginPath = (name: string) => path.join(pluginsDir, name);

describe('tryLoadAsync', () => {
  test('loads a CommonJS plugin via require', async () => {
    const onError = vi.fn();
    const plugin = await tryLoadAsync(pluginPath('verdaccio-cjs-plugin'), onError);

    expect(typeof plugin).toBe('function');
    expect(onError).not.toHaveBeenCalled();
  });

  test('loads an ESM directory plugin via the dynamic import fallback', async () => {
    const onError = vi.fn();
    const plugin: any = await tryLoadAsync(pluginPath('verdaccio-esm-plugin'), onError);

    expect(typeof plugin?.default).toBe('function');
    expect(onError).not.toHaveBeenCalled();
  });

  test('loads an ESM plugin using top-level await', async () => {
    const onError = vi.fn();
    const plugin: any = await tryLoadAsync(pluginPath('verdaccio-tla-plugin'), onError);

    expect(typeof plugin?.default).toBe('function');
    expect(onError).not.toHaveBeenCalled();
  });

  test('loads a manifest-less ESM directory plugin (index.js only)', async () => {
    const onError = vi.fn();
    const plugin: any = await tryLoadAsync(pluginPath('verdaccio-no-manifest-plugin'), onError);

    expect(typeof plugin?.default).toBe('function');
    expect(onError).not.toHaveBeenCalled();
  });

  test('falls back past a non-string exports import condition (no default)', async () => {
    const onError = vi.fn();
    const plugin: any = await tryLoadAsync(
      pluginPath('verdaccio-exports-no-default-plugin'),
      onError
    );

    expect(typeof plugin?.default).toBe('function');
    expect(onError).not.toHaveBeenCalled();
  });

  test('returns null when the plugin does not exist', async () => {
    const onError = vi.fn();
    const plugin = await tryLoadAsync(pluginPath('verdaccio-does-not-exist'), onError);

    expect(plugin).toBeNull();
    expect(onError).not.toHaveBeenCalled();
  });

  test('rethrows evaluation errors without retrying via import()', async () => {
    const onError = vi.fn();
    // @ts-expect-error test-only marker set by the broken plugin fixture
    delete globalThis.__verdaccioBrokenPluginEvaluations;

    await expect(tryLoadAsync(pluginPath('verdaccio-broken-plugin'), onError)).rejects.toThrow(
      'plugin init exploded'
    );
    expect(onError).toHaveBeenCalledWith(
      { err: expect.stringContaining('plugin init exploded') },
      'error loading plugin @{err}'
    );
    // an import() retry would evaluate the module a second time
    // @ts-expect-error test-only marker set by the broken plugin fixture
    expect(globalThis.__verdaccioBrokenPluginEvaluations).toBe(1);
  });
});
