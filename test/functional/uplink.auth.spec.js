import assert from 'assert';
import ProxyStorage from '../../src/lib/up-storage';

function createUplink(config) {
  const defaultConfig = {
    url: 'https://registry.npmjs.org/'
  };
  let mergeConfig = Object.assign({}, defaultConfig, config);
  return new ProxyStorage(mergeConfig, {});
}

function setHeaders(config, headers) {
  config = config || {};
  headers = headers || {};
  const uplink = createUplink(config);
  return uplink._setHeaders({
    headers
  });
}

export default function () {

  describe('uplink auth test', () => {

    test('if set headers empty should return default headers', () => {
      const headers = setHeaders();
      const keys = Object.keys(headers);
      const keysExpected = ['Accept', 'Accept-Encoding', 'User-Agent'];

      assert.deepEqual(keys, keysExpected);
      assert.equal(keys.length, 3);
    });

    test('if assigns value invalid to attribute auth', () => {
      const fnError = function () {
        setHeaders({
          auth: ''
        });
      };

      assert.throws(fnError, 'Auth invalid');
    });

    test('if assigns the header authorization', () => {
      const headers = setHeaders({}, {
        'authorization': 'basic Zm9vX2Jhcg=='
      });

      assert.equal(Object.keys(headers).length, 4);
      assert.equal(headers['authorization'], 'basic Zm9vX2Jhcg==');
    });

    test(
      'if assigns headers authorization and token the header precedes',
      () => {
        const headers = setHeaders({
          auth: {
            type: 'bearer',
            token: 'tokenBearer'
          }
        }, {
          'authorization': 'basic tokenBasic'
        });

        assert.equal(headers['authorization'], 'basic tokenBasic');
      }
    );

    test('set type auth basic', () => {
      const headers = setHeaders({
        auth: {
          type: 'basic',
          token: 'Zm9vX2Jhcg=='
        }
      });

      assert.equal(Object.keys(headers).length, 4);
      assert.equal(headers['authorization'], 'Basic Zm9vX2Jhcg==');
    });

    test('set type auth bearer', () => {
      const headers = setHeaders({
        auth: {
          type: 'bearer',
          token: 'Zm9vX2Jhcf==='
        }
      });

      assert.equal(Object.keys(headers).length, 4);
      assert.equal(headers['authorization'], 'Bearer Zm9vX2Jhcf===');
    });

    test('set auth type invalid', () => {
      const fnError = function() {
        setHeaders({
          auth: {
            type: 'null',
            token: 'Zm9vX2Jhcf==='
          }
        })
      };

      assert.throws(fnError, `Auth type 'null' not allowed`);
    });

    test('set auth with NPM_TOKEN', () => {
      process.env.NPM_TOKEN = 'myToken';
      const headers = setHeaders({
        auth: {
          type: 'bearer'
        }
      });

      assert.equal(headers['authorization'], 'Bearer myToken');
      delete process.env.NPM_TOKEN;
    });

    test('set auth with token name and assigns in env', () => {
      process.env.NPM_TOKEN_TEST = 'myTokenTest';
      const headers = setHeaders({
        auth: {
          type: 'basic',
          token_env: 'NPM_TOKEN_TEST'
        }
      });

      assert.equal(headers['authorization'], 'Basic myTokenTest');
      delete process.env.NPM_TOKEN_TEST;
    });


    test('if token not set', () => {
      const fnError = function() {
        setHeaders({
          auth: {
            type: 'basic'
          }
        });
      };

      assert.throws(fnError, 'Token is required');
    });
  });
}
