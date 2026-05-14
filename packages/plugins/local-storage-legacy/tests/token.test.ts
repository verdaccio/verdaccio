import fs from 'fs';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import type { Config, Token } from '@verdaccio/types';

import LocalDatabase from '../src/local-database';
import * as pkgUtils from '../src/pkg-utils';
import MockConfig from './helpers/Config';
import logger from './helpers/Logger';

const optionsPlugin = {
  logger,
  config: new MockConfig() as unknown as Config,
};

let locaDatabase: LocalDatabase;
let loadPrivatePackages;

describe('Local Database', () => {
  beforeEach(() => {
    const writeMock = vi.spyOn(fs, 'writeFileSync').mockImplementation();
    loadPrivatePackages = vi
      .spyOn(pkgUtils, 'loadPrivatePackages')
      .mockReturnValue({ list: [], secret: '' });
    locaDatabase = new LocalDatabase(optionsPlugin.config, optionsPlugin.logger);
    (locaDatabase as LocalDatabase).clean();
    writeMock.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('token', () => {
    const token: Token = {
      user: 'someUser',
      viewToken: 'viewToken',
      key: 'someHash',
      readonly: true,
      createdTimestamp: new Date().getTime(),
    };

    test('should save and get token', async () => {
      await locaDatabase.saveToken(token);
      const tokens = await locaDatabase.readTokens({ user: token.user });
      expect(tokens).toHaveLength(1);
      expect(tokens[0]).toEqual(token);
    });

    test('should revoke and get token', async () => {
      await locaDatabase.saveToken(token);
      const tokens = await locaDatabase.readTokens({ user: token.user });
      expect(tokens).toHaveLength(1);
      expect(tokens[0]).toEqual(token);
      await locaDatabase.deleteToken(token.user, token.key);
      const tokens2 = await locaDatabase.readTokens({ user: token.user });
      expect(tokens2).toHaveLength(0);
    });

    test('should fail on revoke', async () => {
      await expect(locaDatabase.deleteToken({ user: 'foo', key: 'bar' })).rejects.toThrow(
        'user not found'
      );
    });

    test('should verify save more than one token', async () => {
      await locaDatabase.saveToken(token);
      const tokens = await locaDatabase.readTokens({ user: token.user });
      expect(tokens).toHaveLength(1);
      expect(tokens[0]).toEqual(token);
      await locaDatabase.saveToken({ ...token, key: 'foo' });
      expect(tokens).toHaveLength(2);
      expect(tokens[1].key).toEqual('foo');
    });
  });
});
