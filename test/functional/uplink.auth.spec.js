'use strict';

const uplinkStorage = require('../../src/lib/up-storage');
const assert = require('assert');

function createUplink(config) {
  const defaultConfig = {
    url: 'https://registry.npmjs.org/'
  };
  let mergeConfig = Object.assign({}, defaultConfig, config);
  return new uplinkStorage(mergeConfig, {});
}

function setHeaders(config, headers) {
  config = config || {};
  headers = headers || {};
  const uplink = createUplink(config);
  return uplink._setHeaders({
    headers
  });
}

module.exports = function () {

  describe('uplink auth test', function () {

    it('if set headers empty should return default headers', function () {
      const headers = setHeaders();
      const keys = Object.keys(headers);
      const keysExpected = ['Accept', 'Accept-Encoding', 'User-Agent'];

      assert.deepEqual(keys, keysExpected);
      assert.equal(keys.length, 3);
    });

    it('if assigns value invalid to attribute auth', function () {
      const fnError = function () {
        setHeaders({
          auth: ''
        });
      };

      assert.throws(fnError, 'Auth invalid');
    });

    it('if assigns the header authorization', function () {
      const headers = setHeaders({}, {
        'authorization': 'basic Zm9vX2Jhcg=='
      });

      assert.equal(Object.keys(headers).length, 4);
      assert.equal(headers['authorization'], 'basic Zm9vX2Jhcg==');
    });

    it('if assigns headers authorization and token the header precedes', function () {
      const headers = setHeaders({
        auth: {
          type: 'bearer',
          token: 'tokenBearer'
        }
      }, {
        'authorization': 'basic tokenBasic'
      });

      assert.equal(headers['authorization'], 'basic tokenBasic');
    });

    it('set type auth basic', function () {
      const headers = setHeaders({
        auth: {
          type: 'basic',
          token: 'Zm9vX2Jhcg=='
        }
      });

      assert.equal(Object.keys(headers).length, 4);
      assert.equal(headers['authorization'], 'Basic Zm9vX2Jhcg==');
    });

    it('set type auth bearer', function () {
      const headers = setHeaders({
        auth: {
          type: 'bearer',
          token: 'Zm9vX2Jhcf==='
        }
      });

      assert.equal(Object.keys(headers).length, 4);
      assert.equal(headers['authorization'], 'Bearer Zm9vX2Jhcf===');
    });

    it('set auth type invalid', function () {
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

    it('set auth with NPM_TOKEN', function () {
      process.env.NPM_TOKEN = 'myToken';
      const headers = setHeaders({
        auth: {
          type: 'bearer'
        }
      });

      assert.equal(headers['authorization'], 'Bearer myToken');
      delete process.env.NPM_TOKEN;
    });

    it('set auth with token name and assigns in env', function () {
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


    it('if token not set', function () {
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
};

