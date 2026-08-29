import { Secret, TOTP } from 'otpauth';
import supertest from 'supertest';
import { describe, expect, test } from 'vitest';

import { HEADERS, HEADER_TYPE, HTTP_STATUS, SUPPORT_ERRORS, TOKEN_BEARER } from '@verdaccio/core';

import { buildToken, getNewToken, initializeServer } from './_helper';

const PROFILE = '/-/npm/v1/user';
const password = 'secretPass';

async function buildApp(config = 'tfa.yaml', name = 'jota_tfa') {
  const app = await initializeServer(config);
  const token = await getNewToken(app, { name, password });
  return { app, token, name };
}

function post(app: any, token: string, body: unknown) {
  return supertest(app)
    .post(PROFILE)
    .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
    .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, token))
    .send(JSON.stringify(body));
}

function get(app: any, token: string) {
  return supertest(app).get(PROFILE).set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, token));
}

/** Generate the code an authenticator app would show right now. */
function codeFor(otpauthUrl: string): string {
  const secret = new URL(otpauthUrl).searchParams.get('secret') as string;
  return new TOTP({
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret: Secret.fromBase32(secret),
  }).generate();
}

/** Walk the whole `npm profile enable-2fa` exchange. */
async function enable(app: any, token: string, mode = 'auth-and-writes') {
  const started = await post(app, token, { tfa: { mode, password } }).expect(HTTP_STATUS.OK);
  const otpauthUrl = started.body.tfa;
  const finished = await post(app, token, { tfa: [codeFor(otpauthUrl)] }).expect(HTTP_STATUS.OK);
  return { otpauthUrl, recoveryCodes: finished.body.tfa as string[] };
}

describe('two-factor authentication', () => {
  describe('flag disabled', () => {
    test('should keep answering that two-factor is not supported', async () => {
      const { app, token } = await buildApp('profile.yaml', 'jota_notfa');

      const response = await post(app, token, {
        tfa: { mode: 'auth-and-writes', password },
      }).expect(HTTP_STATUS.SERVICE_UNAVAILABLE);

      expect(response.body.error).toEqual(SUPPORT_ERRORS.TFA_DISABLED);
    });

    test('should report tfa false on the profile', async () => {
      const { app, token } = await buildApp('profile.yaml', 'jota_notfa2');

      const response = await get(app, token).expect(HTTP_STATUS.OK);

      expect(response.body.tfa).toBe(false);
    });
  });

  describe('status', () => {
    test('should report false before anything is enabled', async () => {
      const { app, token } = await buildApp();

      const response = await get(app, token).expect(HTTP_STATUS.OK);

      expect(response.body.tfa).toBe(false);
    });

    test('should report pending while enrolment is half finished', async () => {
      const { app, token } = await buildApp();
      await post(app, token, { tfa: { mode: 'auth-only', password } }).expect(HTTP_STATUS.OK);

      const response = await get(app, token).expect(HTTP_STATUS.OK);

      expect(response.body.tfa).toEqual({ mode: 'auth-only', pending: true });
    });

    test('should report the mode once enrolled', async () => {
      const { app, token } = await buildApp();
      await enable(app, token, 'auth-only');

      const response = await get(app, token).expect(HTTP_STATUS.OK);

      expect(response.body.tfa).toEqual({ mode: 'auth-only', pending: false });
    });
  });

  describe('enable', () => {
    test('should answer step two with an otpauth url string', async () => {
      const { app, token } = await buildApp();

      const response = await post(app, token, {
        tfa: { mode: 'auth-and-writes', password },
      }).expect(HTTP_STATUS.OK);

      // the CLI checks `typeof tfa === 'string'` and /^otpauth:[/][/]/, and
      // aborts with "Expected otpauth URL" otherwise
      expect(typeof response.body.tfa).toBe('string');
      expect(response.body.tfa).toMatch(/^otpauth:\/\//);
      expect(new URL(response.body.tfa).searchParams.get('secret')).toEqual(expect.any(String));
    });

    test('should answer step three with an array of recovery codes', async () => {
      const { app, token } = await buildApp();

      const { recoveryCodes } = await enable(app, token);

      expect(Array.isArray(recoveryCodes)).toBe(true);
      expect(recoveryCodes).toHaveLength(10);
    });

    test('should refuse a wrong one-time password on step three', async () => {
      const { app, token } = await buildApp();
      await post(app, token, { tfa: { mode: 'auth-and-writes', password } });

      await post(app, token, { tfa: ['000000'] }).expect(HTTP_STATUS.UNAUTHORIZED);
    });

    test('should refuse a wrong account password', async () => {
      const { app, token } = await buildApp();

      await post(app, token, {
        tfa: { mode: 'auth-and-writes', password: 'not-my-password' },
      }).expect(HTTP_STATUS.UNAUTHORIZED);
    });

    test('should refuse a missing account password', async () => {
      const { app, token } = await buildApp();

      await post(app, token, { tfa: { mode: 'auth-and-writes' } }).expect(HTTP_STATUS.UNAUTHORIZED);
    });

    test('should refuse an unknown mode', async () => {
      const { app, token } = await buildApp();

      await post(app, token, { tfa: { mode: 'whatever', password } }).expect(
        HTTP_STATUS.BAD_REQUEST
      );
    });

    test('should let a pending enrolment be restarted', async () => {
      const { app, token } = await buildApp();
      await post(app, token, { tfa: { mode: 'auth-only', password } }).expect(HTTP_STATUS.OK);

      // this is what the CLI does when it finds a pending record
      await post(app, token, { tfa: { mode: 'disable', password } }).expect(HTTP_STATUS.OK);
      const restarted = await post(app, token, {
        tfa: { mode: 'auth-and-writes', password },
      }).expect(HTTP_STATUS.OK);

      expect(restarted.body.tfa).toMatch(/^otpauth:\/\//);
    });
  });

  describe('disable', () => {
    test('should turn two-factor off', async () => {
      const { app, token } = await buildApp();
      await enable(app, token);

      await post(app, token, { tfa: { mode: 'disable', password } }).expect(HTTP_STATUS.OK);

      const response = await get(app, token).expect(HTTP_STATUS.OK);
      expect(response.body.tfa).toBe(false);
    });

    test('should refuse to turn it off with a wrong password', async () => {
      const { app, token } = await buildApp();
      await enable(app, token);

      await post(app, token, { tfa: { mode: 'disable', password: 'wrong' } }).expect(
        HTTP_STATUS.UNAUTHORIZED
      );

      const response = await get(app, token).expect(HTTP_STATUS.OK);
      expect(response.body.tfa).toMatchObject({ pending: false });
    });
  });

  describe('anonymous', () => {
    test('should refuse to read or change the profile', async () => {
      const app = await initializeServer('tfa.yaml');

      await supertest(app).get(PROFILE).expect(HTTP_STATUS.UNAUTHORIZED);
      await supertest(app)
        .post(PROFILE)
        .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
        .send(JSON.stringify({ tfa: { mode: 'auth-and-writes', password } }))
        .expect(HTTP_STATUS.UNAUTHORIZED);
    });
  });

  describe('change password still works', () => {
    test('should not be broken by the tfa branch', async () => {
      const { app, token } = await buildApp();

      const response = await post(app, token, {
        password: { old: password, new: 'brandNewPass' },
      }).expect(HTTP_STATUS.OK);

      expect(response.body.tfa).toBe(false);
    });
  });
});
