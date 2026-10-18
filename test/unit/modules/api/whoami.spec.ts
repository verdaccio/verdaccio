import supertest from 'supertest';
import { describe, expect, test } from 'vitest';

import { HEADERS, HTTP_STATUS, TOKEN_BEARER } from '@verdaccio/core';
import { authUtils } from '@verdaccio/core';

const { buildToken } = authUtils;

import { createUser, initializeServer } from './_helper';

describe('whoami', () => {
  test('should return the logged username', async () => {
    const app = await initializeServer('whoami.yaml');
    // @ts-expect-error internal property
    const { _body } = await createUser(app, 'test', 'test');
    return supertest(app)
      .get('/-/whoami')
      .set('Accept', HEADERS.JSON)
      .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, _body.token))
      .expect('Content-Type', HEADERS.JSON_CHARSET)
      .expect(HTTP_STATUS.OK)
      .then((response) => {
        expect(response.body.username).toEqual('test');
      });
  });

  test('should fail with 401 without credentials', async () => {
    const app = await initializeServer('whoami.yaml');
    return supertest(app)
      .get('/-/whoami')
      .set('Accept', HEADERS.JSON)
      .expect('Content-Type', HEADERS.JSON_CHARSET)
      .expect(HTTP_STATUS.UNAUTHORIZED);
  });

  test('should fail with 401 with an unknown bearer token', async () => {
    const app = await initializeServer('whoami.yaml');
    return supertest(app)
      .get('/-/whoami')
      .set('Accept', HEADERS.JSON)
      .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, 'unknown-token'))
      .expect('Content-Type', HEADERS.JSON_CHARSET)
      .expect(HTTP_STATUS.UNAUTHORIZED);
  });

  test('should fails with 401 if is not logged in', async () => {
    const app = await initializeServer('whoami.yaml');
    // @ts-expect-error internal property
    const { _body } = await createUser(app, 'test', 'test');
    return supertest(app)
      .get('/-/whoami')
      .set('Accept', HEADERS.JSON)
      .set(HEADERS.AUTHORIZATION, buildToken('invalid-token', _body.token))
      .expect('Content-Type', HEADERS.JSON_CHARSET)
      .expect(HTTP_STATUS.UNAUTHORIZED);
  });
});
