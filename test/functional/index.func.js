// @flow
import _ from 'lodash';

// we need this for notifications
import {setup} from '../../src/lib/logger';
setup();

import {VerdaccioConfig} from './lib/verdaccio-server';
import VerdaccioProcess  from './lib/server_process';
import ExpressServer  from './lib/simple_server';
import Server from './lib/server';
import type {IServerProcess, IServerBridge} from './lib/types';

import basic from './basic/basic.spec';
import packageAccess from './package/access.spec';
import packageGzip from './package/gzip.spec';
import packageScoped from './package/scoped.spec';
import tags from './tags/tags.spec';
import preserveTags from './tags/preserve_tags.spec';
import addtag from './tags/addtag.spec';
import adduser from './adduser/adduser';
import logout from './adduser/logout';
import notify from './notifications/notify';
import incomplete from './sanity/incomplete';
import mirror from './sanity/mirror';
import readme from './readme/readme.spec';
import gh29 from './gh29';
import nullstorage from './sanity/nullstorage';
import racycrash from './sanity/racycrash';
import security from './sanity/security';
import race from './performance/race';
import pluginsAuth from './plugins/auth.spec';
import upLinkCache from './uplink.cache.spec';
import upLinkAuth from './uplink.auth.spec';

describe('functional test verdaccio', function() {
  const EXPRESS_PORT = 55550;
  const SILENCE_LOG = !process.env.VERDACCIO_DEBUG;
  const processRunning = [];
  const config1 = new VerdaccioConfig(
    './store/test-storage',
    './store/config-1.yaml',
    'http://localhost:55551/');
  const config2 = new VerdaccioConfig(
      './store/test-storage2',
      './store/config-2.yaml',
      'http://localhost:55552/');
  const config3 = new VerdaccioConfig(
        './store/test-storage3',
        './store/config-3.yaml',
        'http://localhost:55553/');
  const server1: IServerBridge = new Server(config1.domainPath);
  const server2: IServerBridge = new Server(config2.domainPath);
  const server3: IServerBridge = new Server(config3.domainPath);
  const process1: IServerProcess = new VerdaccioProcess(config1, server1, SILENCE_LOG);
  const process2: IServerProcess = new VerdaccioProcess(config2, server2, SILENCE_LOG);
  const process3: IServerProcess = new VerdaccioProcess(config3, server3, SILENCE_LOG);
  const express: any = new ExpressServer();

  beforeAll((done) => {
    Promise.all([
      process1.init(),
      process2.init(),
      process3.init()]).then((forks) => {
        _.map(forks, (fork) => {
          processRunning.push(fork[0]);
        });
        express.start(EXPRESS_PORT).then((app) =>{
          done();
        }, (err) => {
          done(err);
        });
    }).catch((error) => {
      done(error);
    });
  });

  afterAll(() => {
    _.map(processRunning, (fork) => {
      fork.stop();
    });
    express.server.close();
  });

  // list of test
  // note: order of the following calls is important
  packageAccess(server1);
  basic(server1, server2);
  gh29(server1, server2);
  tags(server1, express.app);
  packageGzip(server1, express.app);
  incomplete(server1, express.app);
  mirror(server1, server2);
  preserveTags(server1, server2, express.app);
  readme(server1, server2);
  nullstorage(server1, server2);
  race(server1);
  racycrash(server1, express.app);
  packageScoped(server1, server2);
  security(server1);
  addtag(server1);
  pluginsAuth(server2);
  notify(express.app);
  // requires packages published to server1/server2
  upLinkCache(server1, server2, server3);
  upLinkAuth();
  adduser(server1);
  logout(server1);
});

process.on('unhandledRejection', function(err) {
  console.error("unhandledRejection", err);
  process.nextTick(function() {
    throw err;
  });
});
