import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, test, vi } from 'vitest';

import { tryLoadAsync } from '../src/utils';

const pluginsDir = path.join(import.meta.dirname, 'partials', 'modern-plugins');
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

  test('resolves the exports sugar form without a dot subpath', async () => {
    const onError = vi.fn();
    const plugin: any = await tryLoadAsync(pluginPath('verdaccio-exports-sugar-plugin'), onError);

    expect(typeof plugin?.default).toBe('function');
    expect(onError).not.toHaveBeenCalled();
  });

  test('returns null for a directory without any entry point', async () => {
    const onError = vi.fn();
    const plugin = await tryLoadAsync(pluginPath('verdaccio-empty-dir-plugin'), onError);

    expect(plugin).toBeNull();
    expect(onError).not.toHaveBeenCalled();
  });

  test('reports the real error when a plugin dependency is missing', async () => {
    const onError = vi.fn();
    // @ts-expect-error test-only marker set by the fixture
    delete globalThis.__verdaccioMissingDepEvaluations;

    await expect(tryLoadAsync(pluginPath('verdaccio-missing-dep-plugin'), onError)).rejects.toThrow(
      "Cannot find module 'this-dependency-does-not-exist-xyz'"
    );
    expect(onError).toHaveBeenCalledWith(
      { err: expect.stringContaining('this-dependency-does-not-exist-xyz') },
      'error loading plugin @{err}'
    );
    // no import() retry: the plugin must be evaluated exactly once
    // @ts-expect-error test-only marker set by the fixture
    expect(globalThis.__verdaccioMissingDepEvaluations).toBe(1);
  });

  test('reports the real error when an ESM plugin dependency is missing', async () => {
    const onError = vi.fn();

    await expect(
      tryLoadAsync(pluginPath('verdaccio-esm-missing-dep-plugin'), onError)
    ).rejects.toThrow("Cannot find package 'this-esm-dep-does-not-exist-xyz'");
    expect(onError).toHaveBeenCalledWith(
      { err: expect.stringContaining('this-esm-dep-does-not-exist-xyz') },
      'error loading plugin @{err}'
    );
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

describe('tryLoadAsync entry point resolution', () => {
  const tempDirs: string[] = [];
  const tlaSource = `await Promise.resolve();
export default function plugin() {
  return { register_middlewares() {} };
}
`;

  afterEach(async () => {
    await Promise.all(tempDirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })));
  });

  async function createTlaPlugin(
    pkg: Record<string, unknown>,
    files: Record<string, string> = { 'index.js': tlaSource }
  ): Promise<string> {
    const dir = await mkdtemp(path.join(tmpdir(), 'verdaccio-tla-'));
    tempDirs.push(dir);
    await writeFile(
      path.join(dir, 'package.json'),
      JSON.stringify({ name: 'tla-plugin', version: '1.0.0', type: 'module', ...pkg })
    );
    for (const [file, content] of Object.entries(files)) {
      await writeFile(path.join(dir, file), content);
    }
    return dir;
  }

  test('resolves a string exports field', async () => {
    const onError = vi.fn();
    const dir = await createTlaPlugin({ exports: './entry.js' }, { 'entry.js': tlaSource });
    const plugin: any = await tryLoadAsync(dir, onError);

    expect(typeof plugin?.default).toBe('function');
    expect(onError).not.toHaveBeenCalled();
  });

  test('resolves nested exports import.default', async () => {
    const onError = vi.fn();
    const dir = await createTlaPlugin({
      exports: { '.': { import: { default: './index.js' } } },
    });
    const plugin: any = await tryLoadAsync(dir, onError);

    expect(typeof plugin?.default).toBe('function');
    expect(onError).not.toHaveBeenCalled();
  });

  test('resolves exports default as a string', async () => {
    const onError = vi.fn();
    const dir = await createTlaPlugin({
      exports: { '.': { default: './index.js' } },
    });
    const plugin: any = await tryLoadAsync(dir, onError);

    expect(typeof plugin?.default).toBe('function');
    expect(onError).not.toHaveBeenCalled();
  });

  test('resolves the module field when exports is absent', async () => {
    const onError = vi.fn();
    const dir = await createTlaPlugin({ module: './mod.js' }, { 'mod.js': tlaSource });
    const plugin: any = await tryLoadAsync(dir, onError);

    expect(typeof plugin?.default).toBe('function');
    expect(onError).not.toHaveBeenCalled();
  });

  test('falls back to index.js when the manifest has no entry fields', async () => {
    const onError = vi.fn();
    const dir = await createTlaPlugin({});
    const plugin: any = await tryLoadAsync(dir, onError);

    expect(typeof plugin?.default).toBe('function');
    expect(onError).not.toHaveBeenCalled();
  });

  test('reports a missing dependency on the import() path', async () => {
    const onError = vi.fn();
    const dir = await createTlaPlugin(
      {},
      {
        'index.js': `await Promise.resolve();
await import('this-esm-dep-does-not-exist-xyz');
export default function plugin() {}
`,
      }
    );

    await expect(tryLoadAsync(dir, onError)).rejects.toThrow(
      "Cannot find package 'this-esm-dep-does-not-exist-xyz'"
    );
    expect(onError).toHaveBeenCalledWith(
      { err: expect.stringContaining('this-esm-dep-does-not-exist-xyz') },
      'error loading plugin @{err}'
    );
  });
});
