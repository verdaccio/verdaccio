import supertest from 'supertest';
import { describe, expect, test } from 'vitest';

import {
  API_ERROR,
  HEADERS,
  HEADER_TYPE,
  HTTP_STATUS,
  SUPPORT_ERRORS,
  TOKEN_BEARER,
} from '@verdaccio/core';

import {
  buildToken,
  deleteTokenCLI,
  generateTokenCLI,
  getNewToken,
  initializeServer,
  publishVersionWithToken,
} from './_helper';

describe('token', () => {
  describe('basics', () => {
    test.each([['token.yaml'], ['token.jwt.yaml']])('should list empty tokens', async (conf) => {
      const app = await initializeServer(conf);
      const token = await getNewToken(app, { name: 'jota_token', password: 'secretPass' });
      const response = await supertest(app)
        .get('/-/npm/v1/tokens')
        .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, token))
        .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
        .expect(HTTP_STATUS.OK);
      expect(response.body.objects).toHaveLength(0);
    });

    test.each([['token.yaml'], ['token.jwt.yaml']])('should generate one token', async (conf) => {
      const app = await initializeServer(conf);
      const credentials = { name: 'jota_token', password: 'secretPass' };
      const token = await getNewToken(app, credentials);
      await generateTokenCLI(app, token, {
        password: credentials.password,
        readonly: false,
        cidr_whitelist: [],
      });
      const response = await supertest(app)
        .get('/-/npm/v1/tokens')
        .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, token))
        .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
        .expect(HTTP_STATUS.OK);
      const { objects, urls } = response.body;

      expect(objects).toHaveLength(1);
      const [tokenGenerated] = objects;
      expect(tokenGenerated.user).toEqual(credentials.name);
      expect(tokenGenerated.readonly).toBeFalsy();
      expect(tokenGenerated.token).toMatch(/.../);
      expect(typeof tokenGenerated.created === 'string').toBeTruthy();

      // we don't support pagination yet
      expect(urls.next).toEqual('');
    });

    test.each([['token.yaml'], ['token.jwt.yaml']])('should delete a token', async (conf) => {
      const app = await initializeServer(conf);
      const credentials = { name: 'jota_token', password: 'secretPass' };
      const token = await getNewToken(app, credentials);
      const response = await generateTokenCLI(app, token, {
        password: credentials.password,
        readonly: false,
        cidr_whitelist: [],
      });

      const key = response.body.key;
      await deleteTokenCLI(app, token, key);
      const response2 = await supertest(app)
        .get('/-/npm/v1/tokens')
        .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, token))
        .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
        .expect(HTTP_STATUS.OK);
      const { objects } = response2.body;
      expect(objects).toHaveLength(0);
    });
  });

  describe('handle errors', () => {
    test.each([['token.yaml'], ['token.jwt.yaml']])('should delete a token', async (conf) => {
      const app = await initializeServer(conf);
      const credentials = { name: 'jota_token', password: 'secretPass' };
      const token = await getNewToken(app, credentials);
      const resp = await generateTokenCLI(app, token, {
        password: 'wrongPassword',
        readonly: false,
        cidr_whitelist: [],
      });
      expect(resp.body.error).toEqual(API_ERROR.BAD_USERNAME_PASSWORD);
    });

    test.each([['token.yaml'], ['token.jwt.yaml']])(
      'should reject readonly when it has the wrong type',
      async (conf) => {
        const app = await initializeServer(conf);
        const credentials = { name: 'jota_token', password: 'secretPass' };
        const token = await getNewToken(app, credentials);
        const resp = await generateTokenCLI(app, token, {
          password: credentials.password,
          readonly: 'nope',
          cidr_whitelist: [],
        });
        expect(resp.body.error).toEqual(SUPPORT_ERRORS.PARAMETERS_NOT_VALID);
      }
    );

    test.each([['token.yaml'], ['token.jwt.yaml']])(
      'should reject cidr_whitelist when it has the wrong type',
      async (conf) => {
        const app = await initializeServer(conf);
        const credentials = { name: 'jota_token', password: 'secretPass' };
        const token = await getNewToken(app, credentials);
        const resp = await generateTokenCLI(app, token, {
          password: credentials.password,
          readonly: false,
          cidr_whitelist: 'not-an-array',
        });
        expect(resp.body.error).toEqual(SUPPORT_ERRORS.PARAMETERS_NOT_VALID);
      }
    );
  });

  // npm >= 11 rewrote `npm token create` to omit `readonly` and to send
  // `cidr_whitelist` only with `--cidr`; the endpoint must default them.
  test.each([['token.yaml'], ['token.jwt.yaml']])(
    'should default readonly to false when omitted',
    async (conf) => {
      const app = await initializeServer(conf);
      const credentials = { name: 'jota_token', password: 'secretPass' };
      const token = await getNewToken(app, credentials);
      const resp = await generateTokenCLI(app, token, {
        password: credentials.password,
        cidr_whitelist: [],
      });
      expect(resp.body.token).toBeDefined();
      expect(resp.body.readonly).toBe(false);
    }
  );

  test.each([['token.yaml'], ['token.jwt.yaml']])(
    'should default cidr_whitelist to empty when omitted',
    async (conf) => {
      const app = await initializeServer(conf);
      const credentials = { name: 'jota_token', password: 'secretPass' };
      const token = await getNewToken(app, credentials);
      const resp = await generateTokenCLI(app, token, {
        password: credentials.password,
        readonly: false,
      });
      expect(resp.body.token).toBeDefined();
      expect(resp.body.cidr).toEqual([]);
    }
  );

  test.each([['token.yaml'], ['token.jwt.yaml']])(
    'should create a token from a body with only a password',
    async (conf) => {
      const app = await initializeServer(conf);
      const credentials = { name: 'jota_token', password: 'secretPass' };
      const token = await getNewToken(app, credentials);
      const resp = await generateTokenCLI(app, token, {
        password: credentials.password,
      });
      expect(resp.body.token).toBeDefined();
      expect(resp.body.readonly).toBe(false);
      expect(resp.body.cidr).toEqual([]);
    }
  );

  describe('generated token authorization', () => {
    test.each([['token.yaml'], ['token.jwt.yaml']])(
      'should allow writes with a writable generated token within its constraints',
      async (conf) => {
        const app = await initializeServer(conf);
        const credentials = { name: 'jota_token', password: 'secretPass' };
        const token = await getNewToken(app, credentials);
        const response = await generateTokenCLI(app, token, {
          password: credentials.password,
          readonly: false,
          cidr_whitelist: [],
        });

        await publishVersionWithToken(
          app,
          '@token/writable-generated-token',
          '1.0.0',
          response.body.token
        ).expect(HTTP_STATUS.CREATED);
      }
    );

    test.each([['token.yaml'], ['token.jwt.yaml']])(
      'should reject writes with a readonly generated token',
      async (conf) => {
        const app = await initializeServer(conf);
        const credentials = { name: 'jota_token', password: 'secretPass' };
        const token = await getNewToken(app, credentials);
        const response = await generateTokenCLI(app, token, {
          password: credentials.password,
          readonly: true,
          cidr_whitelist: [],
        });
        const generatedToken = response.body.token;
        const pkgName = '@token/readonly-generated-token';

        await publishVersionWithToken(app, pkgName, '1.0.0', generatedToken)
          .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
          .expect(HTTP_STATUS.FORBIDDEN);

        await publishVersionWithToken(app, pkgName, '1.0.0', token).expect(HTTP_STATUS.CREATED);

        await supertest(app)
          .put(`/-/package/${encodeURIComponent(pkgName)}/dist-tags/beta`)
          .set(HEADERS.ACCEPT, HEADERS.GZIP)
          .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
          .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, generatedToken))
          .send(JSON.stringify('1.0.0'))
          .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
          .expect(HTTP_STATUS.FORBIDDEN);
      }
    );

    test.each([['token.yaml'], ['token.jwt.yaml']])(
      'should reject writes outside a generated token CIDR whitelist',
      async (conf) => {
        const app = await initializeServer(conf);
        const credentials = { name: 'jota_token', password: 'secretPass' };
        const token = await getNewToken(app, credentials);
        const response = await generateTokenCLI(app, token, {
          password: credentials.password,
          readonly: false,
          cidr_whitelist: ['203.0.113.0/24'],
        });

        await publishVersionWithToken(
          app,
          '@token/cidr-generated-token',
          '1.0.0',
          response.body.token
        )
          .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
          .expect(HTTP_STATUS.FORBIDDEN);
      }
    );

    test.each([['token.yaml'], ['token.jwt.yaml']])(
      'should reject writes when the forwarded address is outside the CIDR whitelist',
      async (conf) => {
        const app = await initializeServer(conf);
        const credentials = { name: 'jota_token', password: 'secretPass' };
        const token = await getNewToken(app, credentials);
        const response = await generateTokenCLI(app, token, {
          password: credentials.password,
          readonly: false,
          cidr_whitelist: ['203.0.113.0/24'],
        });

        await publishVersionWithToken(
          app,
          '@token/cidr-forwarded-outside-token',
          '1.0.0',
          response.body.token
        )
          .set('x-forwarded-for', '198.51.100.5')
          .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
          .expect(HTTP_STATUS.FORBIDDEN);
      }
    );

    test.each([['token.yaml'], ['token.jwt.yaml']])(
      'should allow writes when the forwarded address is inside the CIDR whitelist',
      async (conf) => {
        const app = await initializeServer(conf);
        const credentials = { name: 'jota_token', password: 'secretPass' };
        const token = await getNewToken(app, credentials);
        const response = await generateTokenCLI(app, token, {
          password: credentials.password,
          readonly: false,
          cidr_whitelist: ['203.0.113.0/24'],
        });

        await publishVersionWithToken(
          app,
          '@token/cidr-forwarded-inside-token',
          '1.0.0',
          response.body.token
        )
          .set('x-forwarded-for', '203.0.113.5')
          .expect(HTTP_STATUS.CREATED);
      }
    );

    test.each([['token.yaml'], ['token.jwt.yaml']])(
      'should match the CIDR whitelist against the first forwarded address',
      async (conf) => {
        const app = await initializeServer(conf);
        const credentials = { name: 'jota_token', password: 'secretPass' };
        const token = await getNewToken(app, credentials);
        const response = await generateTokenCLI(app, token, {
          password: credentials.password,
          readonly: false,
          cidr_whitelist: ['203.0.113.0/24'],
        });

        await publishVersionWithToken(
          app,
          '@token/cidr-forwarded-chain-token',
          '1.0.0',
          response.body.token
        )
          .set('x-forwarded-for', '203.0.113.5, 70.41.3.18')
          .expect(HTTP_STATUS.CREATED);
      }
    );

    test.each([['token.yaml'], ['token.jwt.yaml']])(
      'should reject writes with a deleted generated token',
      async (conf) => {
        const app = await initializeServer(conf);
        const credentials = { name: 'jota_token', password: 'secretPass' };
        const token = await getNewToken(app, credentials);
        const response = await generateTokenCLI(app, token, {
          password: credentials.password,
          readonly: false,
          cidr_whitelist: [],
        });

        await deleteTokenCLI(app, token, response.body.key);

        await publishVersionWithToken(
          app,
          '@token/deleted-generated-token',
          '1.0.0',
          response.body.token
        )
          .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
          .expect(HTTP_STATUS.FORBIDDEN);
      }
    );

    test.each([['token.yaml'], ['token.jwt.yaml']])(
      'should reject reads with a deleted generated token',
      async (conf) => {
        const app = await initializeServer(conf);
        const credentials = { name: 'jota_token', password: 'secretPass' };
        const token = await getNewToken(app, credentials);
        const response = await generateTokenCLI(app, token, {
          password: credentials.password,
          readonly: false,
          cidr_whitelist: [],
        });

        await deleteTokenCLI(app, token, response.body.key);

        // revocation must apply to reads, not only writes
        await supertest(app)
          .get('/-/whoami')
          .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, response.body.token))
          .expect(HTTP_STATUS.FORBIDDEN);
      }
    );

    test.each([['token.yaml'], ['token.jwt.yaml']])(
      'should reject reads outside a generated token CIDR whitelist',
      async (conf) => {
        const app = await initializeServer(conf);
        const credentials = { name: 'jota_token', password: 'secretPass' };
        const token = await getNewToken(app, credentials);
        const response = await generateTokenCLI(app, token, {
          password: credentials.password,
          readonly: false,
          cidr_whitelist: ['203.0.113.0/24'],
        });

        // a CIDR-locked token must not be usable for reads from outside the range
        await supertest(app)
          .get('/-/whoami')
          .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, response.body.token))
          .set('x-forwarded-for', '198.51.100.5')
          .expect(HTTP_STATUS.FORBIDDEN);
      }
    );

    test.each([['token.yaml'], ['token.jwt.yaml']])(
      'should reject deletes with a readonly generated token',
      async (conf) => {
        const app = await initializeServer(conf);
        const credentials = { name: 'jota_token', password: 'secretPass' };
        const token = await getNewToken(app, credentials);
        const response = await generateTokenCLI(app, token, {
          password: credentials.password,
          readonly: true,
          cidr_whitelist: [],
        });
        const generatedToken = response.body.token;
        const pkgName = '@token/readonly-delete-token';

        // DELETE is a write method (unpublish / dist-tag removal) and must be blocked
        await supertest(app)
          .delete(`/-/package/${encodeURIComponent(pkgName)}/dist-tags/beta`)
          .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, generatedToken))
          .expect(HTTP_STATUS.FORBIDDEN);
      }
    );

    test.each([['token.yaml'], ['token.jwt.yaml']])(
      'should allow reads with a readonly generated token',
      async (conf) => {
        const app = await initializeServer(conf);
        const credentials = { name: 'jota_token', password: 'secretPass' };
        const token = await getNewToken(app, credentials);
        const response = await generateTokenCLI(app, token, {
          password: credentials.password,
          readonly: true,
          cidr_whitelist: [],
        });

        // readonly restricts writes only; reads must still succeed (no over-blocking)
        await supertest(app)
          .get('/-/whoami')
          .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, response.body.token))
          .expect(HTTP_STATUS.OK);
      }
    );
  });

  test.todo('handle failure if delete token');
  test.todo('handle failure if getApiToken fails');
  test.todo('handle failure if token creating fails');
  test.todo('handle failure if token list fails');
});
