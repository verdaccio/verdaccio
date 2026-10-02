import { access, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { afterEach, expect, test, vi } from 'vitest';

import { Config, parseConfigFile } from '@verdaccio/config';
import type { pluginUtils } from '@verdaccio/core';
import { fileUtils } from '@verdaccio/core';

const options = {
  logger: { warn: vi.fn(), info: vi.fn() },
  config: new Config(parseConfigFile(path.join(import.meta.dirname, './__fixtures__/config.yaml'))),
} as any as pluginUtils.PluginOptions;

afterEach(() => {
  vi.doUnmock('../src/utils.ts');
  vi.resetModules();
});

test('returns a preliminary sanity check rejection through the callback', async () => {
  const failure = new Error('verification failed');
  const sanityCheck = vi.fn().mockRejectedValue(failure);
  vi.doMock('../src/utils.ts', async (importOriginal) => ({
    ...((await importOriginal()) as object),
    sanityCheck,
  }));

  const HTPasswd = (await import('../src/htpasswd')).default;
  const plugin = new HTPasswd({ file: './htpasswd' }, options);
  const callback = vi.fn();

  expect(plugin.adduser('user', 'password', callback)).toBeUndefined();
  await vi.waitFor(() => expect(callback).toHaveBeenCalledTimes(1));
  expect(callback).toHaveBeenCalledWith(failure, false);
  expect(sanityCheck).toHaveBeenCalledTimes(1);
});

test('unlocks and returns a sanity check rejection after reading the file', async () => {
  const failure = new Error('verification failed');
  const sanityCheck = vi.fn().mockResolvedValueOnce(null).mockRejectedValueOnce(failure);
  vi.doMock('../src/utils.ts', async (importOriginal) => ({
    ...((await importOriginal()) as object),
    sanityCheck,
  }));

  const folder = await fileUtils.createTempFolder('htpasswd');
  const file = path.join(folder, 'htpasswd');
  await writeFile(file, '');

  const HTPasswd = (await import('../src/htpasswd')).default;
  const plugin = new HTPasswd({ file }, options);
  const callback = vi.fn();

  await new Promise<void>((resolve) => {
    plugin.adduser('user', 'password', (error, success) => {
      callback(error, success);
      resolve();
    });
  });

  expect(callback).toHaveBeenCalledTimes(1);
  expect(callback).toHaveBeenCalledWith(failure, false);
  expect(sanityCheck).toHaveBeenCalledTimes(2);
  await expect(access(`${file}.lock`)).rejects.toMatchObject({ code: 'ENOENT' });
});

test('does not call back again when the callback throws', async () => {
  const sanityCheck = vi.fn().mockResolvedValue(new Error('registration disabled'));
  vi.doMock('../src/utils.ts', async (importOriginal) => ({
    ...((await importOriginal()) as object),
    sanityCheck,
  }));
  const thrown = new Error('callback failed');
  const unhandled = new Promise((resolve) => process.once('unhandledRejection', resolve));

  const HTPasswd = (await import('../src/htpasswd')).default;
  const plugin = new HTPasswd({ file: './htpasswd' }, options);
  const callback = vi.fn(() => {
    throw thrown;
  });

  plugin.adduser('user', 'password', callback);

  await expect(unhandled).resolves.toBe(thrown);
  expect(callback).toHaveBeenCalledTimes(1);
});
