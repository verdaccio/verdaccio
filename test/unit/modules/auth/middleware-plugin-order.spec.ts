import path from 'node:path';
import request from 'supertest';
import { beforeAll, describe, expect, test, vi } from 'vitest';

import { HEADERS, HEADER_TYPE, HTTP_STATUS, TOKEN_BEARER, fileUtils } from '@verdaccio/core';
import { ROLES, buildToken } from '@verdaccio/utils';

import endPointAPI from '../../../../src/api';
import { setup } from '../../../../src/lib/logger';
import { getNewToken } from '../../__helper/api';
import configDefault from '../../partials/config';

setup({});

// configPath (== self_path) must point at the yaml so that `plugins: ./plugins`
// resolves to the sibling plugins folder that holds verdaccio-remote-user-probe.js
const configFile = path.join(
  __dirname,
  '../../partials/config/yaml/middleware-plugin/middleware-plugin.yaml'
);

const credentials = { name: 'mwUser', password: 'secretPass' };

describe('middleware plugins jwt order', () => {
  vi.setConfig({ testTimeout: 20000 });
  let app;

  beforeAll(async function () {
    const store = await fileUtils.createTempStorageFolder('middleware-plugin-storage');
    const config = configDefault(
      {
        storage: store,
        self_path: configFile,
        // keep the htpasswd file inside the (unique) temp store, not the repo tree
        auth: { htpasswd: { file: path.join(store, 'htpasswd') } },
      },
      'middleware-plugin/middleware-plugin.yaml'
    );
    app = await endPointAPI(config);
  });

  test('should expose anonymous remote_user to middleware plugins', async () => {
    const response = await request(app)
      .get('/-/remote-user-probe')
      .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
      .expect(HTTP_STATUS.OK);
    expect(response.body.hasRemoteUser).toBe(true);
    // anonymous request: no username but the default anonymous groups are present
    expect(response.body.name).toBeNull();
    expect(response.body.groups).toContain(ROLES.$ALL);
    expect(response.body.groups).toContain(ROLES.$ANONYMOUS);
  });

  test('should expose the authenticated remote_user to middleware plugins', async () => {
    const token = await getNewToken(request(app), credentials);
    const response = await request(app)
      .get('/-/remote-user-probe')
      .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, token))
      .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
      .expect(HTTP_STATUS.OK);
    expect(response.body.hasRemoteUser).toBe(true);
    // authenticated request: the plugin sees the resolved username and its groups
    expect(response.body.name).toBe(credentials.name);
    expect(response.body.groups).toContain(credentials.name);
    expect(response.body.groups).toContain(ROLES.$AUTH);
  });
});
