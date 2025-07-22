import { describe, expect, test } from 'vitest';

import { DEFAULT_REGISTRY } from '@verdaccio/config';
import { HEADERS, TOKEN_BASIC, TOKEN_BEARER, authUtils, constants } from '@verdaccio/core';
import { logger, setup } from '@verdaccio/logger';

import { ProxyStorage } from '../src';

setup({});

const buildToken = authUtils.buildToken;

function createUplink(config) {
  const defaultConfig = {
    url: DEFAULT_REGISTRY,
  };
  const mergeConfig = Object.assign({}, defaultConfig, config);
  // @ts-ignore
  return new ProxyStorage('npmjs', mergeConfig, {}, logger);
}

function setHeadersNext(config: unknown = {}, headers: any = {}) {
  const uplink = createUplink(config);
  return uplink.getHeaders({ ...headers });
}

describe('setHeadersNext', () => {
  test('if set headers empty should return default headers', () => {
    const headers = setHeadersNext();
    const keys = Object.keys(headers);
    const keysExpected = [HEADERS.ACCEPT, HEADERS.ACCEPT_ENCODING, HEADERS.USER_AGENT];

    expect(keys).toEqual(keysExpected);
    expect(keys).toHaveLength(3);
  });

  test('if assigns value invalid to attribute auth', () => {
    const fnError = function () {
      setHeadersNext({
        auth: '',
      });
    };

    expect(function () {
      fnError();
    }).toThrow(Error('Auth invalid'));
  });

  test('if assigns the header authorization', () => {
    const headers = setHeadersNext(
      {},
      {
        [HEADERS.AUTHORIZATION]: buildToken(TOKEN_BASIC, 'Zm9vX2Jhcg=='),
      }
    );

    expect(Object.keys(headers)).toHaveLength(4);
    expect(headers[HEADERS.AUTHORIZATION]).toEqual(buildToken(TOKEN_BASIC, 'Zm9vX2Jhcg=='));
  });

  test('if assigns headers authorization and token the header precedes', () => {
    const headers = setHeadersNext(
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
    const headers = setHeadersNext({
      auth: {
        type: TOKEN_BASIC,
        token: 'Zm9vX2Jhcg==',
      },
    });

    expect(Object.keys(headers)).toHaveLength(4);
    expect(headers[HEADERS.AUTHORIZATION]).toEqual(buildToken(TOKEN_BASIC, 'Zm9vX2Jhcg=='));
  });

  test('set type lower case', () => {
    const headers = setHeadersNext({
      auth: {
        type: 'basic', // lower case type
        token: 'test',
      },
    });

    expect(Object.keys(headers)).toHaveLength(4);
    expect(headers[HEADERS.AUTHORIZATION]).toEqual(buildToken(TOKEN_BASIC, 'test')); // capital case type
  });

  test('set type auth bearer', () => {
    const headers = setHeadersNext({
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
      setHeadersNext({
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
    const headers = setHeadersNext({
      auth: {
        type: TOKEN_BEARER,
      },
    });

    expect(headers[HEADERS.AUTHORIZATION]).toBe(buildToken(TOKEN_BEARER, 'myToken'));
    delete process.env.NPM_TOKEN;
  });

  test('set auth with token name and assigns in env', () => {
    process.env.NPM_TOKEN_TEST = 'myTokenTest';
    const headers = setHeadersNext({
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
      setHeadersNext({
        auth: {
          type: TOKEN_BASIC,
        },
      });
    };

    expect(function () {
      fnError();
    }).toThrow(constants.ERROR_CODE.token_required);
  });
});
