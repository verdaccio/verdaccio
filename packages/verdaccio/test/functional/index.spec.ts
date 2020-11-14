// we need this for notifications
import { setup } from '@verdaccio/logger';

setup({});

import basic from './basic/basic';
import packageAccess from './package/access';
import packageGzip from './package/gzip';
import packageScoped from './package/scoped';
import tags from './tags/tags';
import distTagsMerge from './tags/dist-tags-merge';
import addtag from './tags/addtag';
import adduser from './adduser/adduser';
import logout from './adduser/logout';
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
import uplinkTimeout from './uplinks/timeout';
import { IServerBridge } from '@verdaccio/mock';

describe('functional test verdaccio', function () {
  jest.setTimeout(20000);
  // @ts-ignore
  const server1: IServerBridge = global.__SERVERS__[0];
  // @ts-ignore
  const server2 = global.__SERVERS__[1];
  // @ts-ignore
  const server3 = global.__SERVERS__[2];
  // @ts-ignore
  const app = global.__WEB_SERVER__.app;

  // list of test
  // note: order of the following calls is important, the reason is legacy code.
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
  uplinkTimeout(server1, server2, server3);
  // requires packages published to server1/server2
  upLinkCache(server1, server2, server3);
  adduser(server1);
  logout(server1);
  basic(server1, server2);
  simpleSearch(server1, server2, app);
});

process.on('unhandledRejection', function (err) {
  console.error('unhandledRejection', err);
  process.nextTick(function () {
    throw err;
  });
});
