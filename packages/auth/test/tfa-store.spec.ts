import { Secret, TOTP } from 'otpauth';
import { beforeAll, describe, expect, test } from 'vitest';

import { setup } from '@verdaccio/logger';
import type { Logger, Token } from '@verdaccio/types';

import { TFA_TOKEN_KEY, TfaStore, isReservedTokenKey } from '../src/tfa-store';

let logger: Logger;
beforeAll(async () => {
  logger = await setup({ type: 'stdout', format: 'pretty', level: 'fatal' });
});

/** 32 chars, the length aesEncrypt enforces. */
const SECRET_KEY = '12345678901234567890123456789012';

/** In-memory stand-in for the storage plugin's token store. */
class FakeTokenStorage {
  public rows: Token[] = [];

  public async saveToken(token: Token) {
    this.rows.push(token);
  }

  public async deleteToken(user: string, tokenKey: string) {
    this.rows = this.rows.filter((row) => !(row.user === user && row.key === tokenKey));
  }

  public async readTokens({ user }: { user: string }) {
    return this.rows.filter((row) => row.user === user);
  }
}

/** Hashers stubbed with a marker so tests do not pay for bcrypt. */
const hashCode = async (plain: string) => `hashed:${plain}`;
const compareCode = async (plain: string, hashed: string) => hashed === `hashed:${plain}`;

function currentCode(secretBase32: string): string {
  return new TOTP({
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret: Secret.fromBase32(secretBase32),
  }).generate();
}

function buildStore(storage = new FakeTokenStorage()) {
  return { store: new TfaStore(storage, SECRET_KEY, logger), storage };
}

async function enrol(mode: 'auth-only' | 'auth-and-writes' = 'auth-and-writes') {
  const { store, storage } = buildStore();
  const { record } = await store.beginEnrolment('jota', mode, 'Verdaccio');
  const codes = await store.completeEnrolment('jota', currentCode(record.secret), hashCode);
  return { store, storage, secret: record.secret, codes: codes as string[] };
}

describe('isReservedTokenKey', () => {
  test('should hide the two-factor row from the token APIs', () => {
    // otherwise `npm token ls` would list it and leak the encrypted payload
    expect(isReservedTokenKey(TFA_TOKEN_KEY)).toBe(true);
    expect(isReservedTokenKey('some-real-token-key')).toBe(false);
  });
});

describe('TfaStore', () => {
  describe('status', () => {
    test('should report false when the user has no two-factor', async () => {
      const { store } = buildStore();

      await expect(store.status('jota')).resolves.toBe(false);
      await expect(store.isEnabled('jota')).resolves.toBe(false);
    });

    test('should report pending between starting and finishing enrolment', async () => {
      const { store } = buildStore();

      await store.beginEnrolment('jota', 'auth-only', 'Verdaccio');

      await expect(store.status('jota')).resolves.toEqual({
        mode: 'auth-only',
        pending: true,
      });
      // a half-finished enrolment must not count as protection
      await expect(store.isEnabled('jota')).resolves.toBe(false);
    });

    test('should report the mode once enrolled', async () => {
      const { store } = await enrol('auth-only');

      await expect(store.status('jota')).resolves.toEqual({
        mode: 'auth-only',
        pending: false,
      });
      await expect(store.isEnabled('jota')).resolves.toBe(true);
    });
  });

  describe('beginEnrolment', () => {
    test('should return an otpauth url the npm CLI accepts', async () => {
      const { store } = buildStore();

      const { otpauthUrl } = await store.beginEnrolment('jota', 'auth-and-writes', 'My Registry');

      // the CLI checks /^otpauth:[/][/]/ and aborts otherwise
      expect(otpauthUrl).toMatch(/^otpauth:\/\//);
      const url = new URL(otpauthUrl);
      expect(url.searchParams.get('secret')).toEqual(expect.any(String));
      expect(url.searchParams.get('issuer')).toBe('My Registry');
    });

    test('should store the record encrypted, not in the clear', async () => {
      const { store, storage } = buildStore();

      const { record } = await store.beginEnrolment('jota', 'auth-and-writes', 'Verdaccio');

      const row = storage.rows.find((r) => r.key === TFA_TOKEN_KEY);
      expect(row).toBeDefined();
      expect(row!.token).not.toContain(record.secret);
      expect(row!.token).not.toContain('auth-and-writes');
    });

    test('should replace a previous enrolment instead of piling rows up', async () => {
      const { store, storage } = buildStore();

      await store.beginEnrolment('jota', 'auth-only', 'Verdaccio');
      await store.beginEnrolment('jota', 'auth-and-writes', 'Verdaccio');

      expect(storage.rows.filter((r) => r.key === TFA_TOKEN_KEY)).toHaveLength(1);
      await expect(store.status('jota')).resolves.toMatchObject({ mode: 'auth-and-writes' });
    });
  });

  describe('completeEnrolment', () => {
    test('should hand out recovery codes for a valid first code', async () => {
      const { store } = buildStore();
      const { record } = await store.beginEnrolment('jota', 'auth-and-writes', 'Verdaccio');

      const codes = await store.completeEnrolment('jota', currentCode(record.secret), hashCode);

      expect(codes).toHaveLength(10);
      expect(new Set(codes).size).toBe(10);
    });

    test('should refuse a wrong code and stay pending', async () => {
      const { store } = buildStore();
      await store.beginEnrolment('jota', 'auth-and-writes', 'Verdaccio');

      await expect(store.completeEnrolment('jota', '000000', hashCode)).resolves.toBeUndefined();
      await expect(store.status('jota')).resolves.toMatchObject({ pending: true });
    });

    test('should not store the recovery codes in the clear', async () => {
      const { storage, codes } = await enrol();

      const row = storage.rows.find((r) => r.key === TFA_TOKEN_KEY);
      for (const code of codes) {
        expect(row!.token).not.toContain(code);
      }
    });
  });

  describe('verify', () => {
    test('should accept the current one-time password', async () => {
      const { store, secret } = await enrol();

      await expect(store.verify('jota', currentCode(secret), compareCode)).resolves.toBe(true);
    });

    test('should reject a wrong one-time password', async () => {
      const { store } = await enrol();

      await expect(store.verify('jota', '000000', compareCode)).resolves.toBe(false);
    });

    test('should reject anything that is not six digits', async () => {
      const { store } = await enrol();

      for (const bad of ['', '12345', '1234567', 'abcdef', '12 34 56']) {
        await expect(store.verify('jota', bad, compareCode)).resolves.toBe(false);
      }
    });

    test('should reject while enrolment is still pending', async () => {
      const { store } = buildStore();
      const { record } = await store.beginEnrolment('jota', 'auth-and-writes', 'Verdaccio');

      await expect(store.verify('jota', currentCode(record.secret), compareCode)).resolves.toBe(
        false
      );
    });

    test('should accept a recovery code exactly once', async () => {
      const { store, codes } = await enrol();

      await expect(store.verify('jota', codes[0], compareCode)).resolves.toBe(true);
      // single use: the same code must not work twice
      await expect(store.verify('jota', codes[0], compareCode)).resolves.toBe(false);
      await expect(store.verify('jota', codes[1], compareCode)).resolves.toBe(true);
    });

    test('should lock out after repeated failures even with the right code', async () => {
      const { store, secret } = await enrol();

      for (let attempt = 0; attempt < 5; attempt++) {
        await expect(store.verify('jota', '000000', compareCode)).resolves.toBe(false);
      }

      // six digits are brute-forceable without this
      await expect(store.verify('jota', currentCode(secret), compareCode)).resolves.toBe(false);
    });

    test('should clear the failure count on a success', async () => {
      const { store, secret } = await enrol();

      await store.verify('jota', '000000', compareCode);
      await store.verify('jota', '000000', compareCode);
      await expect(store.verify('jota', currentCode(secret), compareCode)).resolves.toBe(true);

      // the earlier failures must not carry over
      for (let attempt = 0; attempt < 4; attempt++) {
        await store.verify('jota', '000000', compareCode);
      }
      await expect(store.verify('jota', currentCode(secret), compareCode)).resolves.toBe(true);
    });

    test('should reject for a user without two-factor', async () => {
      const { store } = buildStore();

      await expect(store.verify('nobody', '123456', compareCode)).resolves.toBe(false);
    });
  });

  describe('disable', () => {
    test('should remove the record', async () => {
      const { store, storage } = await enrol();

      await store.disable('jota');

      await expect(store.status('jota')).resolves.toBe(false);
      expect(storage.rows.filter((r) => r.key === TFA_TOKEN_KEY)).toHaveLength(0);
    });
  });

  describe('unreadable records', () => {
    test('should fail loudly when the server secret changed', async () => {
      const { storage } = await enrol();
      const otherKey = new TfaStore(storage, 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', logger);

      // reporting "no two-factor" here would silently drop the second factor
      await expect(otherKey.get('jota')).rejects.toMatchObject({ code: 500 });
      await expect(otherKey.status('jota')).rejects.toThrow();
    });

    test('should fail loudly when the record is corrupted', async () => {
      const { store, storage } = await enrol();
      const row = storage.rows.find((r) => r.key === TFA_TOKEN_KEY)!;
      row.token = 'not-encrypted-at-all';

      await expect(store.get('jota')).rejects.toMatchObject({ code: 500 });
    });
  });

  describe('isolation between users', () => {
    test('should not read another user record', async () => {
      const { store } = await enrol();

      await expect(store.status('someone-else')).resolves.toBe(false);
    });
  });
});
