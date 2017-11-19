'use strict';

// require('./lib/startup');
//import _ from 'lodash';

import {VerdaccioServer, VerdaccioConfig}  from './lib/verdaccio-server';

const assert = require('assert');

describe('functional test verdaccio', function() {

  const config1 = new VerdaccioConfig('./store/test-storage', '/store/config-1.yaml', 'http://localhost:55551/');
  const config2 = new VerdaccioConfig('./store/test-storage2', '/store/config-2.yaml', 'http://localhost:55552/');
  const config3 = new VerdaccioConfig('./store/test-storage3', '/store/config-3.yaml', 'http://localhost:55553/');
  const server1 = new VerdaccioServer(config1);
  const server2 = new VerdaccioServer(config2);
  const server3 = new VerdaccioServer(config3);

  before(function(done) {
    Promise.all([
      server1.start(),
      server2.start(),
      server3.start(),
    ]).then(() => {
      done();
    }).catch(function(error) {
        console.error("error on start servers", error);
    });

  });

  it('authenticate', function() {
    /* test for before() */
  });

  require('./package/access')();
  // require('./basic')();
  // require('./gh29')();
  // require('./tags/tags')();
  // require('./package/gzip.spec')();
  // require('./sanity/incomplete')();
  // require('./sanity/mirror')();
  // require('./tags/preserve_tags.spec')();
  // require('./readme/readme.spec')();
  // require('./sanity/nullstorage')();
  // require('./performance/race')();
  // require('./sanity/racycrash')();
  // require('./package/scoped.spec')();
  // require('./sanity/security')();
  // require('./adduser/adduser')();
  // require('./adduser/logout')();
  // require('./tags/addtag.spec')();
  // require('./plugins/auth.spec')();
  // require('./notifications/notify')();
  // // // requires packages published to server1/server2
  // require('./uplink.cache.spec')();
  // require('./uplink.auth.spec')();

  after(function(done) {
    const check = (server) => {
      return server.stop();
    };

    Promise.all([check(server1), check(server2), check(server3)]).then(function() {
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
