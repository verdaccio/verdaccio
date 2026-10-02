import supertest from 'supertest';
import { describe, expect, test } from 'vitest';

import { API_ERROR, HEADERS, HTTP_STATUS, TOKEN_BEARER } from '@verdaccio/core';

import { buildToken, createUser, initializeServer } from './_helper';

const prototypeNames = ['constructor', 'toString', '__proto__'];

describe('htpasswd registration', () => {
  test.each(['ordinary-user', ...prototypeNames])(
    'registers and authenticates %s',
    async (name) => {
      const app = await initializeServer('htpasswd-registration.yaml');
      const response = await createUser(app, name, 'test-password');

      expect(response.body.ok).toBe(`user '${name}' created`);
      expect(response.body.token).toEqual(expect.any(String));

      const identity = await supertest(app)
        .get('/-/whoami')
        .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, response.body.token))
        .expect(HTTP_STATUS.OK);
      expect(identity.body.username).toBe(name);
      await supertest(app).get('/-/ping').expect(HTTP_STATUS.OK);
    }
  );

  test.each([
    'firstname lastname',
    'user\tname',
    'user\nname',
    'user/name',
    'user\\name',
    'user@name',
    'user?name',
    'user#name',
    'user%name',
    'usuário',
  ])('rejects non-URI-safe username %j and allows a subsequent registration', async (name) => {
    const app = await initializeServer('htpasswd-registration.yaml');
    const response = await supertest(app)
      .put(`/-/user/org.couchdb.user:${encodeURIComponent(name)}`)
      .send({ name, password: 'test-password' })
      .expect(HTTP_STATUS.CONFLICT);

    expect(response.body.error).toBe('username should not contain non-uri-safe characters');
    expect(response.body.token).toBeUndefined();
    await createUser(app, 'valid-user', 'test-password');
  });

  test('rejects a colon in the username at the API name validation', async () => {
    const app = await initializeServer('htpasswd-registration.yaml');
    const name = 'user:name';
    const response = await supertest(app)
      .put(`/-/user/org.couchdb.user:${encodeURIComponent(name)}`)
      .send({ name, password: 'test-password' })
      .expect(HTTP_STATUS.BAD_REQUEST);

    expect(response.body.error).toBe(API_ERROR.USERNAME_MISMATCH);
    expect(response.body.token).toBeUndefined();
    await createUser(app, 'valid-user', 'test-password');
  });

  test.each(['user%20name', 'user%2Fname', 'user%3Aname', 'user%25name', 'user%252Fname'])(
    'rejects literal percent-encoded username %s without decoding it twice',
    async (name) => {
      const app = await initializeServer('htpasswd-registration.yaml');
      const response = await supertest(app)
        .put(`/-/user/org.couchdb.user:${encodeURIComponent(name)}`)
        .send({ name, password: 'test-password' })
        .expect(HTTP_STATUS.CONFLICT);

      expect(response.body.error).toBe('username should not contain non-uri-safe characters');
      expect(response.body.token).toBeUndefined();
      await createUser(app, 'valid-user', 'test-password');
    }
  );

  test.each([
    ['user%00name', 'user\0name'],
    ['user%0D%0Aname', 'user\r\nname'],
    ['user%2fname', 'user/name'],
  ])('rejects URL-encoded invalid characters in %s', async (encodedName, name) => {
    const app = await initializeServer('htpasswd-registration.yaml');
    const response = await supertest(app)
      .put(`/-/user/org.couchdb.user:${encodedName}`)
      .send({ name, password: 'test-password' })
      .expect(HTTP_STATUS.CONFLICT);

    expect(response.body.error).toBe('username should not contain non-uri-safe characters');
    expect(response.body.token).toBeUndefined();
    await createUser(app, 'valid-user', 'test-password');
  });

  test.each([
    ['%63onstructor', 'constructor'],
    ['%74oString', 'toString'],
    ['%5F%5Fproto%5F%5F', '__proto__'],
  ])('registers a valid URL-encoded username %s', async (encodedName, name) => {
    const app = await initializeServer('htpasswd-registration.yaml');
    const response = await supertest(app)
      .put(`/-/user/org.couchdb.user:${encodedName}`)
      .send({ name, password: 'test-password' })
      .expect(HTTP_STATUS.CREATED);

    expect(response.body.ok).toBe(`user '${name}' created`);
    const identity = await supertest(app)
      .get('/-/whoami')
      .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, response.body.token))
      .expect(HTTP_STATUS.OK);
    expect(identity.body.username).toBe(name);
  });

  test.each(prototypeNames)('rejects %s when registration is disabled', async (name) => {
    const app = await initializeServer('htpasswd-registration-disabled.yaml');
    const response = await supertest(app)
      .put(`/-/user/org.couchdb.user:${name}`)
      .send({ name, password: 'test-password' })
      .expect(HTTP_STATUS.CONFLICT);

    expect(response.body.error).toBe(API_ERROR.REGISTRATION_DISABLED);
    await supertest(app).get('/-/ping').expect(HTTP_STATUS.OK);
  });
});
