import supertest from 'supertest';
import { describe, expect, test } from 'vitest';

import { HEADERS, HTTP_STATUS, TOKEN_BEARER } from '@verdaccio/core';

import { buildToken, createUser, initializeServer } from './_helper';

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
