/* eslint-disable jest/no-mocks-import */
import fs from 'fs';
import path from 'path';

import { fileUtils } from '@verdaccio/core';
import { Logger, Token } from '@verdaccio/types';

import LocalDatabase from '../src/local-database';

const logger: Logger = {
  error: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
  child: jest.fn(),
  warn: jest.fn(),
  http: jest.fn(),
  trace: jest.fn(),
};

describe('Local Database', () => {
  let tmpFolder;
  let locaDatabase;
  beforeEach(async () => {
    tmpFolder = await fileUtils.createTempFolder('local-storage-plugin-');
    const tempFolder = path.join(tmpFolder, 'verdaccio-test.yaml');
    const writeMock = jest.spyOn(fs, 'writeFileSync').mockImplementation();
    locaDatabase = new LocalDatabase( // @ts-expect-error
      {
        storage: 'storage',
        configPath: tempFolder,
        checkSecretKey: () => 'fooX',
      },
      logger
    );
    await (locaDatabase as any).init();
    (locaDatabase as any).clean();
    writeMock.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('token', () => {
    let token: Token = {
      user: 'someUser',
      token: 'foo..foo',
      key: 'someHash',
      readonly: true,
      created: 1234,
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
