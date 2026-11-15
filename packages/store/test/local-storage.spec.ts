import { beforeAll, describe, expect, test, vi } from 'vitest';

import { Config, getDefaultConfig } from '@verdaccio/config';
import { setup } from '@verdaccio/logger';
import type { Logger } from '@verdaccio/types';

import { LocalStorage } from '../src/local-storage';
import type { PluginStorage } from '../src/local-storage';
import { configExample } from './helpers';

let logger: Logger;
beforeAll(async () => {
  logger = await setup({ type: 'stdout', format: 'pretty', level: 'trace' });
});

describe('LocalStorage', () => {
  test('returns the validated secret key after persisting it', async () => {
    const config = new Config(configExample(getDefaultConfig()));
    const localStorage = new LocalStorage(config, logger);
    const getSecret = vi.fn().mockResolvedValue('stored-secret');
    const setSecret = vi.fn().mockResolvedValue(undefined);
    localStorage.storagePlugin = { getSecret, setSecret } as unknown as PluginStorage;
    vi.spyOn(config, 'checkSecretKey').mockReturnValue('validated-secret');

    await expect(localStorage.getSecret(config)).resolves.toBe('validated-secret');
    expect(setSecret).toHaveBeenCalledWith('validated-secret');
  });

  test('does not rewrite an unchanged secret key', async () => {
    const config = new Config(configExample(getDefaultConfig()));
    const localStorage = new LocalStorage(config, logger);
    const getSecret = vi.fn().mockResolvedValue('stored-secret');
    const setSecret = vi.fn().mockResolvedValue(undefined);
    localStorage.storagePlugin = { getSecret, setSecret } as unknown as PluginStorage;
    vi.spyOn(config, 'checkSecretKey').mockReturnValue('stored-secret');

    await expect(localStorage.getSecret(config)).resolves.toBe('stored-secret');
    expect(setSecret).not.toHaveBeenCalled();
  });
});
