import crypto from 'crypto';
import MockDate from 'mockdate';
import { beforeAll, beforeEach, describe, expect, test, vi } from 'vitest';

import { DEFAULT_BCRYPT_ROUNDS } from '../src/htpasswd';
import {
  HtpasswdHashAlgorithm,
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
  algorithm: HtpasswdHashAlgorithm.bcrypt,
  rounds: DEFAULT_BCRYPT_ROUNDS,
};

const mockTimeAndRandomBytes = () => {
  MockDate.set('2018-01-14T11:17:40.712Z');
  // @ts-expect-error
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
  test('should verify the MD5/Crypt3 password with true', () => {
    const input = ['test', '$apr1$sKXK9.lG$rZ4Iy63Vtn8jF9/USc4BV0'];
    expect(verifyPassword(input[0], input[1])).toBeTruthy();
  });
  test('should verify the MD5/Crypt3 password with false', () => {
    const input = ['testpasswordchanged', '$apr1$sKXK9.lG$rZ4Iy63Vtn8jF9/USc4BV0'];
    expect(verifyPassword(input[0], input[1])).toBeFalsy();
  });
  test('should verify the plain password with true', () => {
    const input = ['testpasswordchanged', '{PLAIN}testpasswordchanged'];
    expect(verifyPassword(input[0], input[1])).toBeTruthy();
  });
  test('should verify the plain password with false', () => {
    const input = ['testpassword', '{PLAIN}testpasswordchanged'];
    expect(verifyPassword(input[0], input[1])).toBeFalsy();
  });
  test('should verify the crypto SHA password with true', () => {
    const input = ['testpassword', '{SHA}i7YRj4/Wk1rQh2o740pxfTJwj/0='];
    expect(verifyPassword(input[0], input[1])).toBeTruthy();
  });
  test('should verify the crypto SHA password with false', () => {
    const input = ['testpasswordchanged', '{SHA}i7YRj4/Wk1rQh2o740pxfTJwj/0='];
    expect(verifyPassword(input[0], input[1])).toBeFalsy();
  });
  test('should verify the bcrypt password with true', () => {
    const input = ['testpassword', '$2y$04$Wqed4yN0OktGbiUdxSTwtOva1xfESfkNIZfcS9/vmHLsn3.lkFxJO'];
    expect(verifyPassword(input[0], input[1])).toBeTruthy();
  });
  test('should verify the bcrypt password with false', () => {
    const input = [
      'testpasswordchanged',
      '$2y$04$Wqed4yN0OktGbiUdxSTwtOva1xfESfkNIZfcS9/vmHLsn3.lkFxJO',
    ];
    expect(verifyPassword(input[0], input[1])).toBeFalsy();
  });
});

describe('generateHtpasswdLine', () => {
  beforeAll(mockTimeAndRandomBytes);

  const [user, passwd] = ['username', 'password'];

  test('should correctly generate line for md5', () => {
    const md5Conf = { algorithm: HtpasswdHashAlgorithm.md5 };
    expect(generateHtpasswdLine(user, passwd, md5Conf)).toMatchSnapshot();
  });

  test('should correctly generate line for sha1', () => {
    const sha1Conf = { algorithm: HtpasswdHashAlgorithm.sha1 };
    expect(generateHtpasswdLine(user, passwd, sha1Conf)).toMatchSnapshot();
  });

  test('should correctly generate line for crypt', () => {
    const cryptConf = { algorithm: HtpasswdHashAlgorithm.crypt };
    expect(generateHtpasswdLine(user, passwd, cryptConf)).toMatchSnapshot();
  });

  test('should correctly generate line for bcrypt', () => {
    const bcryptAlgoConfig = {
      algorithm: HtpasswdHashAlgorithm.bcrypt,
      rounds: 2,
    };
    expect(generateHtpasswdLine(user, passwd, bcryptAlgoConfig)).toMatchSnapshot();
  });
});

describe('addUserToHTPasswd - bcrypt', () => {
  beforeAll(mockTimeAndRandomBytes);

  test('should add new htpasswd to the end', () => {
    const input = ['', 'username', 'password'];
    expect(addUserToHTPasswd(input[0], input[1], input[2], defaultHashConfig)).toMatchSnapshot();
  });

  test('should add new htpasswd to the end in multiline input', () => {
    const body = `test1:$6b9MlB3WUELU:autocreated 2017-11-06T18:17:21.957Z
    test2:$6FrCaT/v0dwE:autocreated 2017-12-14T13:30:20.838Z`;
    const input = [body, 'username', 'password'];
    expect(addUserToHTPasswd(input[0], input[1], input[2], defaultHashConfig)).toMatchSnapshot();
  });

  test('should throw an error for incorrect username with space', () => {
    const [a, b, c] = ['', 'firstname lastname', 'password'];
    expect(() => addUserToHTPasswd(a, b, c, defaultHashConfig)).toThrowErrorMatchingSnapshot();
  });
});

describe('lockAndRead', () => {
  test('should call the readFile method', () => {
    // FIXME: why is commented out?
    // const spy = jest.spyOn(fileLocking, 'readFile');
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

  test('should throw error for user already exists', () => {
    const verifyFn = vi.fn();
    const input = sanityCheck('test', users.test, verifyFn, users, Infinity);
    expect(input.status).toEqual(401);
    expect(input.message).toEqual('unauthorized access');
    expect(verifyFn).toHaveBeenCalled();
  });

  test('should throw error for registration disabled of users', () => {
    const verifyFn = (): void => {};
    const input = sanityCheck('username', users.test, verifyFn, users, -1);
    expect(input.status).toEqual(409);
    expect(input.message).toEqual('user registration disabled');
  });

  test('should throw error max number of users', () => {
    const verifyFn = (): void => {};
    const input = sanityCheck('username', users.test, verifyFn, users, 1);
    expect(input.status).toEqual(403);
    expect(input.message).toEqual('maximum amount of users reached');
  });

  test('should not throw anything and sanity check', () => {
    const verifyFn = (): void => {};
    const input = sanityCheck('username', users.test, verifyFn, users, 2);
    expect(input).toBeNull();
  });

  test('should throw error for required username field', () => {
    const verifyFn = (): void => {};
    const input = sanityCheck(undefined, users.test, verifyFn, users, 2);
    expect(input.message).toEqual('username and password is required');
    expect(input.status).toEqual(400);
  });

  test('should throw error for required password field', () => {
    const verifyFn = (): void => {};
    const input = sanityCheck('username', undefined, verifyFn, users, 2);
    expect(input.message).toEqual('username and password is required');
    expect(input.status).toEqual(400);
  });

  test('should throw error for required username & password fields', () => {
    const verifyFn = (): void => {};
    const input = sanityCheck(undefined, undefined, verifyFn, users, 2);
    expect(input.message).toEqual('username and password is required');
    expect(input.status).toEqual(400);
  });

  test('should throw error for existing username and password', () => {
    const verifyFn = vi.fn(() => true);
    const input = sanityCheck('test', users.test, verifyFn, users, 2);
    expect(input.status).toEqual(409);
    expect(input.message).toEqual('username is already registered');
    expect(verifyFn).toHaveBeenCalledTimes(1);
  });

  test(
    'should throw error for existing username and password with max number ' + 'of users reached',
    () => {
      const verifyFn = vi.fn(() => true);
      const input = sanityCheck('test', users.test, verifyFn, users, 1);
      expect(input.status).toEqual(409);
      expect(input.message).toEqual('username is already registered');
      expect(verifyFn).toHaveBeenCalledTimes(1);
    }
  );
});

describe('changePasswordToHTPasswd', () => {
  test('should throw error for wrong password', () => {
    const body = 'test:$6b9MlB3WUELU:autocreated 2017-11-06T18:17:21.957Z';

    try {
      changePasswordToHTPasswd(
        body,
        'test',
        'somerandompassword',
        'newPassword',
        defaultHashConfig
      );
    } catch (error: any) {
      expect(error.message).toEqual('Invalid old Password');
    }
  });

  test('should change the password', () => {
    const body = 'root:$6qLTHoPfGLy2:autocreated 2018-08-20T13:38:12.164Z';

    expect(
      changePasswordToHTPasswd(body, 'root', 'demo123', 'newPassword', defaultHashConfig)
    ).toMatchSnapshot();
  });
});
