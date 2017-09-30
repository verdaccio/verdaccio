'use strict';

const uplinkStorage = require('../../src/lib/storage/up-storage');
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

    it('if set headers empty', function () {
      const headers = setHeaders();

      assert.equal(Object.keys(headers).length, 3);
    });

    it('invalid auth', function () {
      const fnError = function () {
        setHeaders({
          auth: ''
        });
      };

      assert.throws(fnError, 'Auth invalid');
    });

    it('if set headers authorization', function () {
      const headers = setHeaders({}, {
        'authorization': 'basic Zm9vX2Jhcg=='
      });
      assert.equal(Object.keys(headers).length, 4);
      assert.equal(headers['authorization'], 'basic Zm9vX2Jhcg==');
    });

    it('if set headers authorization precendence token', function () {
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

    it('basic auth test', function () {
      const headers = setHeaders({
        auth: {
          type: 'basic',
          token: 'Zm9vX2Jhcg=='
        }
      });
      assert.equal(Object.keys(headers).length, 4);
      assert.equal(headers['authorization'], 'Basic Zm9vX2Jhcg==');
    });

    it('basic auth test', function () {
      const headers = setHeaders({
        auth: {
          type: 'bearer',
          token: 'Zm9vX2Jhcf==='
        }
      });
      assert.equal(Object.keys(headers).length, 4);
      assert.equal(headers['authorization'], 'Bearer Zm9vX2Jhcf===');
    });

    it('invalid auth type test', function () {
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

    it('get NPM_TOKEN process test', function () {
      process.env.NPM_TOKEN = 'myToken';
      const headers = setHeaders({
        auth: {
          type: 'bearer'
        }
      });
      assert.equal(headers['authorization'], 'Bearer myToken');
      delete process.env.NPM_TOKEN;
    });

    it('get name variable assigns process.env test', function () {
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


    it('token is required', function () {
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

