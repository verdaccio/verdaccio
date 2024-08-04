import supertest from 'supertest';
import { describe, test } from 'vitest';

import { HEADERS, HEADER_TYPE, HTTP_STATUS, TOKEN_BEARER } from '@verdaccio/core';
import { buildToken } from '@verdaccio/utils';

import { createUser, initializeServer } from './_helper';

describe('profile ', () => {
  describe('get profile ', () => {
    test('should return Unauthorized if header token is missing', async () => {
      const app = await initializeServer('profile.yaml');
      return supertest(app)
        .get('/-/npm/v1/user')
        .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
        .expect(HTTP_STATUS.UNAUTHORIZED);
    });

    test('should return user details', async () => {
      const app = await initializeServer('profile.yaml');
      const credentials = { name: 'test', password: 'test' };
      const response = await createUser(app, credentials.name, credentials.password);
      return supertest(app)
        .get('/-/npm/v1/user')
        .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, response.body.token))
        .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
        .expect(HTTP_STATUS.OK);
    });
  });
  describe('post profile ', () => {
    test('should return Unauthorized if header token is missing', async () => {
      const app = await initializeServer('profile.yaml');
      return supertest(app)
        .post('/-/npm/v1/user')
        .send({})
        .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
        .expect(HTTP_STATUS.UNAUTHORIZED);
    });

    test('should return handle to short new password', async () => {
      const app = await initializeServer('profile.yaml');
      const credentials = { name: 'test', password: 'test' };
      const response = await createUser(app, credentials.name, credentials.password);
      return supertest(app)
        .post('/-/npm/v1/user')
        .send({ password: { new: '_' } })
        .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, response.body.token))
        .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
        .expect(HTTP_STATUS.UNAUTHORIZED);
    });

    test('should return handle to missing old password', async () => {
      const app = await initializeServer('profile.yaml');
      const credentials = { name: 'test', password: 'test' };
      const response = await createUser(app, credentials.name, credentials.password);
      return supertest(app)
        .post('/-/npm/v1/user')
        .send({ password: { new: 'fooooo', old: undefined } })
        .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, response.body.token))
        .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
        .expect(HTTP_STATUS.BAD_REQUEST);
    });

    test('should return handle to missing password', async () => {
      const app = await initializeServer('profile.yaml');
      const credentials = { name: 'test', password: 'test' };
      const response = await createUser(app, credentials.name, credentials.password);
      return supertest(app)
        .post('/-/npm/v1/user')
        .send({ another: '_' })
        .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, response.body.token))
        .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
        .expect(HTTP_STATUS.INTERNAL_ERROR);
    });

    test('should return handle change password', async () => {
      const app = await initializeServer('profile.yaml');
      const credentials = { name: 'test', password: 'test' };
      const response = await createUser(app, credentials.name, credentials.password);
      return supertest(app)
        .post('/-/npm/v1/user')
        .send({ password: { new: 'good password_.%#@$@#$@#', old: 'test' } })
        .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, response.body.token))
        .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
        .expect(HTTP_STATUS.OK);
    });

    test('should return handle change password failure', async () => {
      const app = await initializeServer('profile.yaml');
      const credentials = { name: 'test', password: 'test' };
      const response = await createUser(app, credentials.name, credentials.password);
      return supertest(app)
        .post('/-/npm/v1/user')
        .send({ password: { new: 'good password_.%#@$@#$@#', old: 'test_do_not_match' } })
        .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, response.body.token))
        .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
        .expect(HTTP_STATUS.FORBIDDEN);
    });

    test('should handle tfa ( two factor auth) disabled', async () => {
      const app = await initializeServer('profile.yaml');
      const credentials = { name: 'test', password: 'test' };
      const response = await createUser(app, credentials.name, credentials.password);
      return supertest(app)
        .post('/-/npm/v1/user')
        .send({ tfa: '_' })
        .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, response.body.token))
        .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
        .expect(HTTP_STATUS.SERVICE_UNAVAILABLE);
    });
  });
});
