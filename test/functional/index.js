'use strict';

require('./lib/startup');

const _ = require('lodash');
const assert = require('assert');
const exec = require('child_process').exec;

describe('Create registry servers', function() {
  const server = process.server;
  const server2 = process.server2;
  const server3 = process.server3;

  before(function(done) {
    Promise.all([
      require('./lib/startup').start('./store/test-storage', '/store/config-1.yaml'),
      require('./lib/startup').start('./store/test-storage2', '/store/config-2.yaml'),
      require('./lib/startup').start('./store/test-storage3', '/store/config-3.yaml'),
    ]).then(() => {
      done();
    });

  });

  before(function() {
    return Promise.all([server, server2, server3].map(function(server) {
      return server.debug().status(200).then(function(body) {
        server.pid = body.pid;

        return new Promise(function(resolve, reject) {
          exec('lsof -p ' + Number(server.pid), function(err, result) {
            if (_.isNil(err) === false) {
              reject(err);
            }

            assert.equal(err, null);
            server.fdlist = result.replace(/ +/g, ' ');
            resolve();
          });
        });
      });
    }));
  });

  before(function testBasicAuthentication() {
    return Promise.all([server, server2, server3].map(function(server) {
      // log in on server1
      return server.auth('test', 'test')
        .status(201)
        .body_ok(/'test'/);

    }));
  });

  it('authenticate', function() {
    /* test for before() */
  });

  require('./access')();
  require('./basic')();
  require('./gh29')();
  require('./tags')();
  require('./gzip')();
  require('./incomplete')();
  require('./mirror')();
  require('./tags/preserve_tags')();
  require('./readme/readme.spec')();
  require('./nullstorage')();
  require('./race')();
  require('./racycrash')();
  require('./package/scoped.spec')();
  require('./security')();
  require('./adduser')();
  require('./auth/logout')();
  require('./addtag')();
  require('./plugins')();
  require('./notify')();
  // requires packages published to server1/server2
  require('./uplink.cache')();

  after(function(done) {
    const check = (server) => {
      return new Promise(function(resolve, reject) {
        exec(`lsof -p ${parseInt(server.pid, 10)}`, function(err, result) {
          if (err) {
            reject();
          } else {
            result = result.split('\n').filter(function(query) {
              if (query.match(/TCP .*->.* \(ESTABLISHED\)/)) {
                return false;
              }
              if (query.match(/\/libcrypt-[^\/]+\.so/)) {
                return false;
              }
              if (query.match(/\/node_modules\/crypt3\/build\/Release/)) {
                return false;
              }
              return true;
            }).join('\n').replace(/ +/g, ' ');
            assert.equal(server.fdlist, result);
            resolve();
          }
        });
      });
    };

    Promise.all([check(server), check(server2), check(server3)]).then(function() {
      done();
    }, (reason) => {
      assert.equal(reason, null);
      done();
    });

  });
});

process.on('unhandledRejection', function(err) {
  process.nextTick(function() {
    throw err;
  });
});
