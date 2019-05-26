// @flow

// we need this for notifications
import {setup} from '../../src/lib/logger';
setup();

import {IServerBridge} from '../types';

import basic from './basic/basic';
import packageAccess from './package/access';
import packageGzip from './package/gzip';
import packageScoped from './package/scoped';
import tags from './tags/tags';
import distTagsMerge from './tags/dist-tags-merge';
import addtag from './tags/addtag';
import adduser from './adduser/adduser';
import logout from './adduser/logout';
import notify from './notifications/notify';
import incomplete from './sanity/incomplete';
import mirror from './sanity/mirror';
import readme from './readme/readme';
import gh29 from './scenarios/gh29';
import nullstorage from './sanity/nullstorage';
import simpleSearch from './search/simple.search';
import racycrash from './sanity/racycrash';
import security from './sanity/security';
import race from './performance/race';
import pluginsAuth from './plugins/auth';
import middleware from './plugins/middleware';
import upLinkCache from './uplinks/cache';

describe('functional test verdaccio', function() {
  jest.setTimeout(10000);
  const server1: IServerBridge = global.__SERVERS__[0];
  const server2: IServerBridge = global.__SERVERS__[1];
  const server3: IServerBridge = global.__SERVERS__[2];
  const app = global.__WEB_SERVER__.app;

  // list of test
  // note: order of the following calls is important
  packageAccess(server1);
  gh29(server1, server2);
  tags(server1, app);
  packageGzip(server1, app);
  incomplete(server1, app);
  mirror(server1, server2);
  distTagsMerge(server1, server2, server3);
  readme(server1, server2);
  nullstorage(server1, server2);
  middleware(server2);
  race(server1);
  racycrash(server1, app);
  packageScoped(server1, server2);
  security(server1);
  addtag(server1);
  pluginsAuth(server2);
  notify(app);
  // requires packages published to server1/server2
  upLinkCache(server1, server2, server3);
  adduser(server1);
  logout(server1);
  basic(server1, server2);
  simpleSearch(server1, server2, app)

});

process.on('unhandledRejection', function(err) {
  console.error("unhandledRejection", err);
  process.nextTick(function() {
    throw err;
  });
});
