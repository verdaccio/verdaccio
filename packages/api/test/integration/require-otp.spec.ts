import { Secret, TOTP } from 'otpauth';
import supertest from 'supertest';
import { describe, expect, test } from 'vitest';

import { HEADERS, HEADER_TYPE, HTTP_STATUS, TOKEN_BEARER } from '@verdaccio/core';
import { generatePackageMetadata } from '@verdaccio/test-helper';

import { buildToken, getNewToken, initializeServer, publishVersionWithToken } from './_helper';

const PROFILE = '/-/npm/v1/user';
const password = 'secretPass';

/**
 * Code for the current 30s step, or a neighbouring one.
 *
 * Codes are single use, so a test that enrols and then publishes needs the next
 * step: the code that confirmed enrolment is already spent. Step +1 is still
 * inside the tolerance window.
 */
function codeFor(otpauthUrl: string, stepOffset = 0): string {
  const secret = new URL(otpauthUrl).searchParams.get('secret') as string;
  return new TOTP({
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret: Secret.fromBase32(secret),
  }).generate({ timestamp: Date.now() + stepOffset * 30_000 });
}

async function buildApp(name: string, config = 'tfa-publish.yaml') {
  const app = await initializeServer(config);
  const token = await getNewToken(app, { name, password });
  return { app, token };
}

/** Turn two-factor on for the logged in user and keep the shared secret. */
async function enable(app: any, token: string, mode = 'auth-and-writes') {
  const started = await supertest(app)
    .post(PROFILE)
    .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
    .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, token))
    .send(JSON.stringify({ tfa: { mode, password } }))
    .expect(HTTP_STATUS.OK);

  const otpauthUrl = started.body.tfa;
  await supertest(app)
    .post(PROFILE)
    .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
    .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, token))
    .send(JSON.stringify({ tfa: [codeFor(otpauthUrl)] }))
    .expect(HTTP_STATUS.OK);

  return otpauthUrl;
}

function publish(app: any, pkg: string, token: string, otp?: string) {
  const request = supertest(app)
    .put(`/${encodeURIComponent(pkg)}`)
    .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
    .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, token))
    .send(JSON.stringify(generatePackageMetadata(pkg, '1.0.0')));

  if (otp) {
    request.set('npm-otp', otp);
  }
  return request;
}

describe('one-time password enforcement', () => {
  describe('the challenge header', () => {
    // npm raises EOTP only for a 401 whose `www-authenticate` includes `otp`
    // (npm-registry-fetch/lib/check-response.js), and Yarn's isOtpError does the
    // same. `final` puts `Bearer` on every other 401, which both clients read as
    // a plain auth failure and never retry. This is the whole feature.
    test('should answer the challenge with WWW-Authenticate: otp', async () => {
      const { app, token } = await buildApp('otp_header');
      const otpauthUrl = await enable(app, token);

      const response = await publish(app, 'otp-header-pkg', token).expect(HTTP_STATUS.UNAUTHORIZED);

      const header = response.headers['www-authenticate'];
      expect(header).toBeDefined();
      expect(header.toLowerCase().split(/,\s*/)).toContain('otp');
      expect(header.toLowerCase()).not.toContain('bearer');
      // publishing with the code then works, proving the challenge was real
      await publish(app, 'otp-header-pkg', token, codeFor(otpauthUrl, 1)).expect(
        HTTP_STATUS.CREATED
      );
    });

    test('should keep a body npm can fall back on', async () => {
      const { app, token } = await buildApp('otp_body');
      await enable(app, token);

      const response = await publish(app, 'otp-body-pkg', token).expect(HTTP_STATUS.UNAUTHORIZED);

      // npm matches /one-time pass/ against the body when the header is lost
      expect(response.body.error).toMatch(/one-time pass/);
    });

    test('should still answer Bearer on an ordinary 401', async () => {
      const app = await initializeServer('tfa-publish.yaml');

      const response = await supertest(app)
        .put('/anon-pkg')
        .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
        .send(JSON.stringify(generatePackageMetadata('anon-pkg', '1.0.0')))
        .expect(HTTP_STATUS.UNAUTHORIZED);

      expect(response.headers['www-authenticate']).toContain(TOKEN_BEARER);
    });
  });

  describe('publish', () => {
    test('should not ask anything of a user without two-factor', async () => {
      const { app, token } = await buildApp('otp_none');

      await publish(app, 'no-otp-pkg', token).expect(HTTP_STATUS.CREATED);
    });

    test('should refuse a wrong one-time password', async () => {
      const { app, token } = await buildApp('otp_wrong');
      await enable(app, token);

      await publish(app, 'wrong-otp-pkg', token, '000000').expect(HTTP_STATUS.UNAUTHORIZED);
    });

    test('should not ask for an OTP in auth-only mode', async () => {
      const { app, token } = await buildApp('otp_authonly');
      await enable(app, token, 'auth-only');

      // auth-only covers logging in and minting tokens, not writes
      await publish(app, 'auth-only-pkg', token).expect(HTTP_STATUS.CREATED);
    });

    test('should stop asking once two-factor is disabled', async () => {
      const { app, token } = await buildApp('otp_disabled');
      const otpauthUrl = await enable(app, token);

      await supertest(app)
        .post(PROFILE)
        .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
        .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, token))
        .set('npm-otp', codeFor(otpauthUrl, 1))
        .send(JSON.stringify({ tfa: { mode: 'disable', password } }))
        .expect(HTTP_STATUS.OK);

      await publish(app, 'disabled-otp-pkg', token).expect(HTTP_STATUS.CREATED);
    });
  });

  describe('unpublish', () => {
    test('should challenge before removing a package', async () => {
      const { app, token } = await buildApp('otp_unpublish');
      await publishVersionWithToken(app, 'unpub-pkg', '1.0.0', token).expect(HTTP_STATUS.CREATED);
      await enable(app, token);

      const response = await supertest(app)
        .delete('/unpub-pkg/-rev/whatever')
        .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, token))
        .expect(HTTP_STATUS.UNAUTHORIZED);

      expect(response.headers['www-authenticate'].toLowerCase()).toContain('otp');
    });
  });

  describe('token creation', () => {
    test('should challenge even in auth-only mode', async () => {
      const { app, token } = await buildApp('otp_token');
      await enable(app, token, 'auth-only');

      const response = await supertest(app)
        .post('/-/npm/v1/tokens')
        .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
        .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, token))
        .send(JSON.stringify({ password, readonly: false, cidr_whitelist: [] }))
        .expect(HTTP_STATUS.UNAUTHORIZED);

      expect(response.headers['www-authenticate'].toLowerCase()).toContain('otp');
    });
  });

  describe('recovery codes', () => {
    test('should let a recovery code stand in for the one-time password', async () => {
      const app = await initializeServer('tfa-publish.yaml');
      const token = await getNewToken(app, { name: 'otp_recovery', password });

      const started = await supertest(app)
        .post(PROFILE)
        .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
        .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, token))
        .send(JSON.stringify({ tfa: { mode: 'auth-and-writes', password } }));
      const finished = await supertest(app)
        .post(PROFILE)
        .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
        .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, token))
        .send(JSON.stringify({ tfa: [codeFor(started.body.tfa)] }));
      const [recoveryCode] = finished.body.tfa as string[];

      await publish(app, 'recovery-pkg', token, recoveryCode).expect(HTTP_STATUS.CREATED);
      // single use
      await publish(app, 'recovery-pkg-2', token, recoveryCode).expect(HTTP_STATUS.UNAUTHORIZED);
    });
  });

  describe('flag disabled', () => {
    test('should never challenge', async () => {
      // same package rules, only the flag differs
      const app = await initializeServer('tfa-disabled.yaml');
      const token = await getNewToken(app, { name: 'otp_flagoff', password });

      await publish(app, 'flag-off-pkg', token).expect(HTTP_STATUS.CREATED);
    });
  });
});
