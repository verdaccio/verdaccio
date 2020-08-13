import { buildToken } from '@verdaccio/utils';

import { ERROR_CODE, TOKEN_BASIC, TOKEN_BEARER, DEFAULT_REGISTRY, HEADERS } from '@verdaccio/dev-commons';
import { setup } from '@verdaccio/logger';

import { ProxyStorage } from '../src/up-storage';

setup([]);

function createUplink(config) {
  const defaultConfig = {
    url: DEFAULT_REGISTRY,
  };
  const mergeConfig = Object.assign({}, defaultConfig, config);
  // @ts-ignore
  return new ProxyStorage(mergeConfig, {});
}

function setHeaders(config: unknown = {}, headers: unknown = {}) {
  const uplink = createUplink(config);
  return uplink._setHeaders({
    headers,
  });
}

describe('uplink headers auth test', () => {
  test('if set headers empty should return default headers', () => {
    const headers = setHeaders();
    const keys = Object.keys(headers);
    const keysExpected = [HEADERS.ACCEPT, HEADERS.ACCEPT_ENCODING, HEADERS.USER_AGENT];

    expect(keys).toEqual(keysExpected);
    expect(keys).toHaveLength(3);
  });

  test('if assigns value invalid to attribute auth', () => {
    const fnError = function () {
      setHeaders({
        auth: '',
      });
    };

    expect(function () {
      fnError();
    }).toThrow(Error('Auth invalid'));
  });

  test('if assigns the header authorization', () => {
    const headers = setHeaders(
      {},
      {
        [HEADERS.AUTHORIZATION]: buildToken(TOKEN_BASIC, 'Zm9vX2Jhcg=='),
      }
    );

    expect(Object.keys(headers)).toHaveLength(4);
    expect(headers[HEADERS.AUTHORIZATION]).toEqual(buildToken(TOKEN_BASIC, 'Zm9vX2Jhcg=='));
  });

  test('if assigns headers authorization and token the header precedes', () => {
    const headers = setHeaders(
      {
        auth: {
          type: TOKEN_BEARER,
          token: 'tokenBearer',
        },
      },
      {
        [HEADERS.AUTHORIZATION]: buildToken(TOKEN_BASIC, 'tokenBasic'),
      }
    );

    expect(headers[HEADERS.AUTHORIZATION]).toEqual(buildToken(TOKEN_BASIC, 'tokenBasic'));
  });

  test('set type auth basic', () => {
    const headers = setHeaders({
      auth: {
        type: TOKEN_BASIC,
        token: 'Zm9vX2Jhcg==',
      },
    });

    expect(Object.keys(headers)).toHaveLength(4);
    expect(headers[HEADERS.AUTHORIZATION]).toEqual(buildToken(TOKEN_BASIC, 'Zm9vX2Jhcg=='));
  });

  test('set type auth bearer', () => {
    const headers = setHeaders({
      auth: {
        type: TOKEN_BEARER,
        token: 'Zm9vX2Jhcf===',
      },
    });

    expect(Object.keys(headers)).toHaveLength(4);
    expect(headers[HEADERS.AUTHORIZATION]).toEqual(buildToken(TOKEN_BEARER, 'Zm9vX2Jhcf==='));
  });

  test('set auth type invalid', () => {
    const fnError = function () {
      setHeaders({
        auth: {
          type: 'null',
          token: 'Zm9vX2Jhcf===',
        },
      });
    };

    expect(function () {
      fnError();
    }).toThrow(Error(`Auth type 'null' not allowed`));
  });

  test('set auth with NPM_TOKEN', () => {
    process.env.NPM_TOKEN = 'myToken';
    const headers = setHeaders({
      auth: {
        type: TOKEN_BEARER,
      },
    });

    expect(headers[HEADERS.AUTHORIZATION]).toBe(buildToken(TOKEN_BEARER, 'myToken'));
    delete process.env.NPM_TOKEN;
  });

  test('set auth with token name and assigns in env', () => {
    process.env.NPM_TOKEN_TEST = 'myTokenTest';
    const headers = setHeaders({
      auth: {
        type: TOKEN_BASIC,
        token_env: 'NPM_TOKEN_TEST',
      },
    });

    expect(headers[HEADERS.AUTHORIZATION]).toBe(buildToken(TOKEN_BASIC, 'myTokenTest'));
    delete process.env.NPM_TOKEN_TEST;
  });

  test('if token not set', () => {
    const fnError = function () {
      setHeaders({
        auth: {
          type: TOKEN_BASIC,
        },
      });
    };

    expect(function () {
      fnError();
    }).toThrow(ERROR_CODE.token_required);
  });
});
