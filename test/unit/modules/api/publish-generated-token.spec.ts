import supertest from 'supertest';
import { beforeAll, describe, expect, test, vi } from 'vitest';

import {
  HEADERS,
  HEADER_TYPE,
  HTTP_STATUS,
  TOKEN_BEARER,
  authUtils,
  fileUtils,
} from '@verdaccio/core';
import { generatePackageMetadata } from '@verdaccio/test-helper';

import endPointAPI from '../../../../src/api/index';
import { setup } from '../../../../src/lib/logger';
import { addUser } from '../../__helper/api';
import configDefault from '../../partials/config';

const { buildToken } = authUtils;

setup({});

const credentials = { name: 'jwtPublisher', password: 'secretPass123' };

/**
 * Tokens minted through `POST /-/npm/v1/tokens` (what `npm token create`
 * issues) carry a server-issued key, which makes enforceGeneratedTokenMetadata
 * await a storage lookup before the API router parses the body. The body
 * parser has to be registered ahead of that, otherwise the buffered request
 * data is lost and the publish is rejected with
 * "request size did not match content length".
 */
describe('publish with a token from the npm token API', () => {
  vi.setConfig({ testTimeout: 30000 });
  let app;
  let generatedToken;

  beforeAll(async () => {
    const storage = await fileUtils.createTempStorageFolder('publish-generated-token');
    app = await endPointAPI(
      configDefault(
        {
          storage,
          self_path: storage,
          auth: { htpasswd: { file: './htpasswd-publish-generated-token' } },
          packages: { '**': { access: '$all', publish: '$authenticated', proxy: [] } },
        },
        'api-jwt/jwt.yaml'
      )
    );

    const [, loginResponse] = await addUser(supertest(app), credentials.name, credentials);

    const tokenResponse = await supertest(app)
      .post('/-/npm/v1/tokens')
      .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
      .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, loginResponse.body.token))
      .send(
        JSON.stringify({
          password: credentials.password,
          readonly: false,
          cidr_whitelist: [],
        })
      )
      .expect(HTTP_STATUS.OK);

    generatedToken = tokenResponse.body.token;
  });

  test('receives the whole request body', async () => {
    const pkgName = 'generated-token-publish';

    expect(typeof generatedToken).toBe('string');

    await supertest(app)
      .put(`/${encodeURIComponent(pkgName)}`)
      .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
      .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, generatedToken))
      .send(JSON.stringify(generatePackageMetadata(pkgName, '1.0.0')))
      .expect(HTTP_STATUS.CREATED);

    const manifest = await supertest(app)
      .get(`/${encodeURIComponent(pkgName)}`)
      .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, generatedToken))
      .expect(HTTP_STATUS.OK);

    expect(manifest.body.name).toEqual(pkgName);
    expect(manifest.body.versions['1.0.0']).toBeDefined();
  });
});
