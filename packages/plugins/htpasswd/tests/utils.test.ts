// @ts-ignore: Module has no default export
import { type HttpError } from 'http-errors';
import MockDate from 'mockdate';
import crypto from 'node:crypto';
import { beforeAll, beforeEach, describe, expect, test, vi } from 'vitest';

import { constants } from '@verdaccio/core';

import { DEFAULT_BCRYPT_ROUNDS } from '../src/utils';
import {
  addUserToHTPasswd,
  changePasswordToHTPasswd,
  generateHtpasswdLine,
  lockAndRead,
  parseHTPasswd,
  sanityCheck,
  verifyPassword,
} from '../src/utils';

const mockReadFile = vi.fn();
const mockUnlockFile = vi.fn();

const defaultHashConfig = {
  algorithm: constants.HtpasswdHashAlgorithm.bcrypt,
  rounds: DEFAULT_BCRYPT_ROUNDS,
};

const mockTimeAndRandomBytes = () => {
  MockDate.set('2018-01-14T11:17:40.712Z');
  // @ts-ignore: Module has no default export
  crypto.randomBytes = vi.fn(() => {
    return {
      toString: (): string => '$6',
    };
  });
  Math.random = vi.fn(() => 0.38849);
};

vi.mock('@verdaccio/file-locking', () => ({
  readFile: () => mockReadFile(),
  unlockFile: () => mockUnlockFile(),
}));

describe('parseHTPasswd', () => {
  test('should parse the password for a single line', () => {
    const input = 'test:$6b9MlB3WUELU:autocreated 2017-11-06T18:17:21.957Z';
    const output = { test: '$6b9MlB3WUELU' };
    expect(parseHTPasswd(input)).toEqual(output);
  });

  test('should parse the password for two lines', () => {
    const input = `user1:$6b9MlB3WUELU:autocreated 2017-11-06T18:17:21.957Z
user2:$6FrCaT/v0dwE:autocreated 2017-12-14T13:30:20.838Z`;
    const output = { user1: '$6b9MlB3WUELU', user2: '$6FrCaT/v0dwE' };
    expect(parseHTPasswd(input)).toEqual(output);
  });

  test('should parse the password for multiple lines', () => {
    const input = `user1:$6b9MlB3WUELU:autocreated 2017-11-06T18:17:21.957Z
user2:$6FrCaT/v0dwE:autocreated 2017-12-14T13:30:20.838Z
user3:$6FrCdfd\v0dwE:autocreated 2017-12-14T13:30:20.838Z
user4:$6FrCasdvppdwE:autocreated 2017-12-14T13:30:20.838Z`;
    const output = {
      user1: '$6b9MlB3WUELU',
      user2: '$6FrCaT/v0dwE',
      user3: '$6FrCdfd\v0dwE',
      user4: '$6FrCasdvppdwE',
    };
    expect(parseHTPasswd(input)).toEqual(output);
  });
});

describe('verifyPassword', () => {
  test('should verify the MD5/Crypt3 password with true', async () => {
    const input = ['test', '$apr1$sKXK9.lG$rZ4Iy63Vtn8jF9/USc4BV0'];
    expect(await verifyPassword(input[0], input[1])).toBeTruthy();
  });
  test('should verify the MD5/Crypt3 password with false', async () => {
    const input = ['testpasswordchanged', '$apr1$sKXK9.lG$rZ4Iy63Vtn8jF9/USc4BV0'];
    expect(await verifyPassword(input[0], input[1])).toBeFalsy();
  });
  test('should verify the plain password with true', async () => {
    const input = ['testpasswordchanged', '{PLAIN}testpasswordchanged'];
    expect(await verifyPassword(input[0], input[1])).toBeTruthy();
  });
  test('should verify the plain password with false', async () => {
    const input = ['testpassword', '{PLAIN}testpasswordchanged'];
    expect(await verifyPassword(input[0], input[1])).toBeFalsy();
  });
  test('should verify the crypto SHA password with true', async () => {
    const input = ['testpassword', '{SHA}i7YRj4/Wk1rQh2o740pxfTJwj/0='];
    expect(await verifyPassword(input[0], input[1])).toBeTruthy();
  });
  test('should verify the crypto SHA password with false', async () => {
    const input = ['testpasswordchanged', '{SHA}i7YRj4/Wk1rQh2o740pxfTJwj/0='];
    expect(await verifyPassword(input[0], input[1])).toBeFalsy();
  });
  test('should verify the bcrypt password with true', async () => {
    const input = ['testpassword', '$2y$04$Wqed4yN0OktGbiUdxSTwtOva1xfESfkNIZfcS9/vmHLsn3.lkFxJO'];
    expect(await verifyPassword(input[0], input[1])).toBeTruthy();
  });
  test('should verify the bcrypt password with false', async () => {
    const input = [
      'testpasswordchanged',
      '$2y$04$Wqed4yN0OktGbiUdxSTwtOva1xfESfkNIZfcS9/vmHLsn3.lkFxJO',
    ];
    expect(await verifyPassword(input[0], input[1])).toBeFalsy();
  });
});

describe('generateHtpasswdLine', () => {
  beforeAll(mockTimeAndRandomBytes);

  const [user, passwd] = ['username', 'password'];

  test('should correctly generate line for md5', async () => {
    const md5Conf = { algorithm: constants.HtpasswdHashAlgorithm.md5 };
    expect(await generateHtpasswdLine(user, passwd, md5Conf)).toMatchSnapshot();
  });

  test('should correctly generate line for sha1', async () => {
    const sha1Conf = { algorithm: constants.HtpasswdHashAlgorithm.sha1 };
    expect(await generateHtpasswdLine(user, passwd, sha1Conf)).toMatchSnapshot();
  });

  test('should correctly generate line for crypt', async () => {
    const cryptConf = { algorithm: constants.HtpasswdHashAlgorithm.crypt };
    expect(await generateHtpasswdLine(user, passwd, cryptConf)).toMatchSnapshot();
  });

  test('should correctly generate line for bcrypt', async () => {
    const bcryptAlgoConfig = {
      algorithm: constants.HtpasswdHashAlgorithm.bcrypt,
      rounds: 2,
    };
    expect(await generateHtpasswdLine(user, passwd, bcryptAlgoConfig)).toMatchSnapshot();
  });
});

describe('addUserToHTPasswd - bcrypt', () => {
  beforeAll(mockTimeAndRandomBytes);

  test('should add new htpasswd to the end', async () => {
    const input = ['', 'username', 'password'];
    expect(
      await addUserToHTPasswd(input[0], input[1], input[2], defaultHashConfig)
    ).toMatchSnapshot();
  });

  test('should add new htpasswd to the end in multiline input', async () => {
    const body = `test1:$6b9MlB3WUELU:autocreated 2017-11-06T18:17:21.957Z
    test2:$6FrCaT/v0dwE:autocreated 2017-12-14T13:30:20.838Z`;
    const input = [body, 'username', 'password'];
    expect(
      await addUserToHTPasswd(input[0], input[1], input[2], defaultHashConfig)
    ).toMatchSnapshot();
  });

  test('should throw an error for incorrect username with space', async () => {
    const [a, b, c] = ['', 'firstname lastname', 'password'];
    await expect(
      addUserToHTPasswd(a, b, c, defaultHashConfig)
    ).rejects.toThrowErrorMatchingSnapshot();
  });
});
describe('lockAndRead', () => {
  test('should call the readFile method', () => {
    const cb = (): void => {};
    lockAndRead('.htpasswd', cb);
    expect(mockReadFile).toHaveBeenCalled();
  });
});

describe('sanityCheck', () => {
  let users;

  beforeEach(() => {
    users = { test: '$6FrCaT/v0dwE' };
  });

  test('should throw error for user already exists', async () => {
    const verifyFn = vi.fn();
    const input = await sanityCheck('test', users.test, verifyFn, users, Infinity);
    expect((input as HttpError<number>).status).toEqual(401);
    expect((input as HttpError<number>).message).toEqual('unauthorized access');
    expect(verifyFn).toHaveBeenCalled();
  });

  test('should throw error for registration disabled of users', async () => {
    const verifyFn = (): void => {};
    const input = await sanityCheck('username', users.test, verifyFn, users, -1);
    expect((input as HttpError<number>).status).toEqual(409);
    expect((input as HttpError<number>).message).toEqual('user registration disabled');
  });

  test('should throw error max number of users', async () => {
    const verifyFn = (): void => {};
    const input = await sanityCheck('username', users.test, verifyFn, users, 1);
    expect((input as HttpError<number>).status).toEqual(403);
    expect((input as HttpError<number>).message).toEqual('maximum amount of users reached');
  });

  test('should not throw anything and sanity check', async () => {
    const verifyFn = (): void => {};
    const input = await sanityCheck('username', users.test, verifyFn, users, 2);
    expect(input).toBeNull();
  });

  test('should throw error for required username field', async () => {
    const verifyFn = (): void => {};
    // @ts-expect-error
    const input = await sanityCheck(undefined, users.test, verifyFn, users, 2);
    expect((input as HttpError<number>).message).toEqual('username and password is required');
    expect((input as HttpError<number>).status).toEqual(400);
  });

  test('should throw error for required password field', async () => {
    const verifyFn = (): void => {};
    // @ts-expect-error
    const input = await sanityCheck('username', undefined, verifyFn, users, 2);
    expect((input as HttpError<number>).message).toEqual('username and password is required');
    expect((input as HttpError<number>).status).toEqual(400);
  });

  test('should throw error for required username & password fields', async () => {
    const verifyFn = (): void => {};
    // @ts-expect-error
    const input = await sanityCheck(undefined, undefined, verifyFn, users, 2);
    expect((input as HttpError<number>).message).toEqual('username and password is required');
    expect((input as HttpError<number>).status).toEqual(400);
  });

  test('should throw error for existing username and password', async () => {
    const verifyFn = vi.fn(() => true);
    const input = await sanityCheck('test', users.test, verifyFn, users, 2);
    expect((input as HttpError<number>).status).toEqual(409);
    expect((input as HttpError<number>).message).toEqual('username is already registered');
    expect(verifyFn).toHaveBeenCalledTimes(1);
  });

  test(
    'should throw error for existing username and password with max number ' + 'of users reached',
    async () => {
      const verifyFn = vi.fn(() => true);
      const input = await sanityCheck('test', users.test, verifyFn, users, 1);
      expect((input as HttpError<number>).status).toEqual(409);
      expect((input as HttpError<number>).message).toEqual('username is already registered');
      expect(verifyFn).toHaveBeenCalledTimes(1);
    }
  );
});

describe('changePasswordToHTPasswd', () => {
  test('should throw error for wrong password', async () => {
    const body = 'test:$6b9MlB3WUELU:autocreated 2017-11-06T18:17:21.957Z';

    try {
      await changePasswordToHTPasswd(
        body,
        'test',
        'somerandompassword',
        'newPassword',
        defaultHashConfig
      );
    } catch (error: any) {
      expect(error.message).toEqual(
        `Unable to change password for user 'test': invalid old password`
      );
    }
  });

  test('should throw error when user does not exist', async () => {
    const body = 'test:$6b9MlB3WUELU:autocreated 2017-11-06T18:17:21.957Z';

    try {
      await changePasswordToHTPasswd(
        body,
        'test2',
        'somerandompassword',
        'newPassword',
        defaultHashConfig
      );
    } catch (error: any) {
      expect(error.message).toEqual(
        `Unable to change password for user 'test2': user does not currently exist`
      );
    }
  });

  test('should change the password', async () => {
    const body = 'root:$6qLTHoPfGLy2:autocreated 2018-08-20T13:38:12.164Z';

    expect(
      await changePasswordToHTPasswd(body, 'root', 'demo123', 'newPassword', defaultHashConfig)
    ).toMatchSnapshot();
  });
});
