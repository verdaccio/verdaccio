/* eslint-disable jest/no-mocks-import */
import fs from 'fs';
import path from 'path';
import { dirSync } from 'tmp-promise';
import { Token } from '@verdaccio/types';

import LocalDatabase from '../src/local-database';

// FIXME: remove this mocks imports
import logger from './__mocks__/Logger';

describe('Local Database', () => {
  let tmpFolder;
  let locaDatabase;
  beforeEach(async () => {
    tmpFolder = dirSync({ unsafeCleanup: true });
    const tempFolder = path.join(tmpFolder.name, 'verdaccio-test.yaml');
    const writeMock = jest.spyOn(fs, 'writeFileSync').mockImplementation();
    locaDatabase = new LocalDatabase( // @ts-expect-error
      {
        storage: 'storage',
        config_path: tempFolder,
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
