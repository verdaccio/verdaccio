import buildDebug from 'debug';
import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import { Secret, TOTP } from 'otpauth';

import { errorUtils } from '@verdaccio/core';
import { aesDecrypt, aesEncrypt } from '@verdaccio/signature';
import type { Logger, Token } from '@verdaccio/types';

const debug = buildDebug('verdaccio:auth:tfa');

/**
 * Reserved token-store key holding a user's two-factor configuration.
 *
 * The token store doubles as a per-user key-value store — `packages/api/src/v1/login.ts`
 * already uses it for web login sessions. Rows under this key are NOT tokens and
 * must never be served by `GET /-/npm/v1/tokens`; see {@link isReservedTokenKey}.
 */
export const TFA_TOKEN_KEY = 'tfa:config';

/** Number of single-use recovery codes handed out when 2FA is enabled. */
const RECOVERY_CODE_COUNT = 10;
/** Steps of tolerance either side of the current one, i.e. ±30s of clock skew. */
const TOTP_WINDOW = 1;
const TOTP_DIGITS = 6;
const TOTP_PERIOD = 30;
/** Failed verifications before the account is locked out. */
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MS = 5 * 60 * 1000;

export type TfaMode = 'auth-only' | 'auth-and-writes';

/** A user's two-factor configuration, as persisted (encrypted) in the token store. */
export interface TfaRecord {
  mode: TfaMode;
  /** True between "enable requested" and "first valid code accepted". */
  pending: boolean;
  /** Base32 TOTP shared secret. */
  secret: string;
  /**
   * Hashed single-use recovery codes. Empty while {@link TfaRecord.pending} is
   * true — codes are only issued once enrolment completes.
   */
  recoveryCodes: string[];
  createdAt: string;
  failedAttempts: number;
  /** ISO timestamp; while in the future, verification is refused outright. */
  lockedUntil?: string;
  /**
   * Highest TOTP time step already accepted.
   *
   * RFC 6238 §5.2 requires a code to be usable only once: a code stays valid for
   * up to 90 seconds with the tolerance window, and without this a code observed
   * in a CI log or over someone's shoulder could be replayed for the rest of
   * that window.
   */
  lastUsedStep?: number;
}

/** What `GET /-/npm/v1/user` reports under `tfa`. */
export type TfaStatus = false | { mode: TfaMode; pending: boolean };

/**
 * Whether a token-store key is reserved for internal use and must be hidden
 * from the npm token APIs.
 *
 * Without this, `npm token ls` would list the 2FA row and expose its encrypted
 * payload as if it were an access token.
 */
export function isReservedTokenKey(key: string): boolean {
  return key === TFA_TOKEN_KEY;
}

/** The subset of `Storage` this module needs, typed structurally to avoid a cycle. */
export interface TfaTokenStorage {
  saveToken(token: Token): Promise<any>;
  deleteToken(user: string, tokenKey: string): Promise<any>;
  readTokens(filter: { user: string }): Promise<Token[]>;
}

function generateRecoveryCode(): string {
  return randomBytes(8).toString('hex');
}

/**
 * Hash a recovery code for storage.
 *
 * SHA-256 rather than a password hash on purpose: these are 64 random bits, not
 * a human-chosen secret, so there is nothing for a slow hash to protect against.
 * The record is encrypted at rest anyway; this is defence in depth for the case
 * where a decrypted record leaks.
 */
function hashRecoveryCode(plain: string): string {
  return createHash('sha256').update(plain).digest('hex');
}

/**
 * Compare two strings without leaking their contents through timing.
 *
 * Length is compared first and non-constant-time on purpose: recovery code and
 * OTP lengths are fixed and public.
 */
function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) {
    return false;
  }
  return timingSafeEqual(left, right);
}

/**
 * Two-factor (TOTP) configuration storage.
 *
 * Records live in the storage plugin's token store, encrypted at rest with the
 * server secret, so any storage plugin implementing the token interface works
 * without changes.
 *
 * Note the operational consequence: rotating `config.secret` makes every record
 * undecryptable and locks every 2FA user out. That surfaces as an explicit
 * error rather than an empty record — see {@link TfaStore.get}.
 */
export class TfaStore {
  private readonly storage: TfaTokenStorage;
  private readonly secretKey: string;
  private readonly logger: Logger;
  private readonly userQueues = new Map<string, Promise<unknown>>();

  public constructor(storage: TfaTokenStorage, secretKey: string, logger: Logger) {
    this.storage = storage;
    this.secretKey = secretKey;
    this.logger = logger;
  }

  /**
   * Read a user's 2FA configuration.
   *
   * @returns the record, or `undefined` when the user has no 2FA configured
   * @throws when a record exists but cannot be decrypted, which almost always
   *   means `config.secret` changed
   */
  public async get(username: string): Promise<TfaRecord | undefined> {
    const tokens = await this.storage.readTokens({ user: username });
    const row = tokens.find((token) => token.key === TFA_TOKEN_KEY);
    if (!row) {
      return undefined;
    }

    const decrypted = aesDecrypt(row.token, this.secretKey);
    if (!decrypted) {
      // aesDecrypt swallows every failure and returns undefined, so this is the
      // only signal we get. Failing loudly beats reporting "2FA is off" and
      // silently dropping the user's second factor.
      this.logger.error(
        { username },
        'the two-factor record of @{username} could not be decrypted, has the server secret changed?'
      );
      throw errorUtils.getInternalError('two-factor configuration could not be read');
    }

    try {
      return JSON.parse(decrypted) as TfaRecord;
    } catch {
      this.logger.error({ username }, 'the two-factor record of @{username} is corrupted');
      throw errorUtils.getInternalError('two-factor configuration could not be read');
    }
  }

  /** Whether 2FA is fully enabled (enrolled, not merely started). */
  public async isEnabled(username: string): Promise<boolean> {
    const record = await this.get(username);
    return record !== undefined && record.pending === false;
  }

  /** The `tfa` value `GET /-/npm/v1/user` reports for this user. */
  public async status(username: string): Promise<TfaStatus> {
    const record = await this.get(username);
    if (!record) {
      return false;
    }
    return { mode: record.mode, pending: record.pending };
  }

  /**
   * Start enrolment: generate a secret and persist it as pending.
   *
   * @returns the `otpauth://` URI the client turns into a QR code. The npm CLI
   *   validates that this is a string starting with `otpauth://` and aborts
   *   otherwise, so the shape matters.
   */
  public async beginEnrolment(
    username: string,
    mode: TfaMode,
    issuer: string
  ): Promise<{ record: TfaRecord; otpauthUrl: string }> {
    return this.enqueueUserMutation(username, async () => {
      const secret = new Secret({ size: 20 });
      const record: TfaRecord = {
        mode,
        pending: true,
        secret: secret.base32,
        recoveryCodes: [],
        createdAt: new Date().toISOString(),
        failedAttempts: 0,
      };
      await this.save(username, record);
      debug('enrolment started for %o in mode %o', username, mode);

      const totp = this.buildTotp(record.secret, username, issuer);
      return { record, otpauthUrl: totp.toString() };
    });
  }

  /**
   * Finish enrolment by checking the first code.
   *
   * @returns the plain recovery codes, shown to the user exactly once, or
   *   `undefined` when the code is wrong
   */
  public async completeEnrolment(username: string, code: string): Promise<string[] | undefined> {
    return this.enqueueUserMutation(username, async () => {
      const record = await this.get(username);
      if (!record || record.pending === false) {
        return undefined;
      }
      const step = this.verifyTotp(record, code);
      if (step === undefined) {
        return undefined;
      }

      const plainCodes = Array.from({ length: RECOVERY_CODE_COUNT }, generateRecoveryCode);

      await this.save(username, {
        ...record,
        pending: false,
        recoveryCodes: plainCodes.map(hashRecoveryCode),
        failedAttempts: 0,
        // the confirming code is spent, it must not also work for a publish
        lastUsedStep: step,
      });
      debug('enrolment completed for %o', username);
      return plainCodes;
    });
  }

  /** Drop a user's 2FA configuration entirely. */
  public async disable(username: string): Promise<void> {
    await this.enqueueUserMutation(username, async () => {
      await this.storage.deleteToken(username, TFA_TOKEN_KEY);
      debug('two-factor disabled for %o', username);
    });
  }

  /**
   * Verify a one-time password, or a single-use recovery code.
   *
   * Six digits are trivially brute-forceable, so failures are counted and the
   * account is locked out for a while once they pile up. A success resets the
   * counter.
   *
   */
  public async verify(username: string, code: string): Promise<boolean> {
    return this.enqueueUserMutation(username, async () => {
      const record = await this.get(username);
      if (!record || record.pending) {
        return false;
      }

      if (record.lockedUntil && new Date(record.lockedUntil) > new Date()) {
        this.logger.warn(
          { username },
          'rejected a two-factor attempt for @{username}: the account is locked out'
        );
        return false;
      }

      const step = this.verifyTotp(record, code);
      if (step !== undefined) {
        if (record.lastUsedStep !== undefined && step <= record.lastUsedStep) {
          this.logger.warn({ username }, 'rejected a replayed one-time password for @{username}');
          await this.registerFailure(username, record);
          return false;
        }
        await this.save(username, {
          ...record,
          failedAttempts: 0,
          lockedUntil: undefined,
          lastUsedStep: step,
        });
        return true;
      }

      const recoveryIndex = this.findRecoveryCode(record, code);
      if (recoveryIndex >= 0) {
        // recovery codes are single use
        const remaining = record.recoveryCodes.filter((_code, index) => index !== recoveryIndex);
        await this.save(username, {
          ...record,
          recoveryCodes: remaining,
          failedAttempts: 0,
          lockedUntil: undefined,
        });
        this.logger.warn(
          { username, remaining: remaining.length },
          'a recovery code was used by @{username}, @{remaining} left'
        );
        return true;
      }

      await this.registerFailure(username, record);
      return false;
    });
  }

  private findRecoveryCode(record: TfaRecord, code: string): number {
    const candidate = hashRecoveryCode(code.trim());
    return record.recoveryCodes.findIndex((hashed) => safeEqual(candidate, hashed));
  }

  private async registerFailure(username: string, record: TfaRecord): Promise<void> {
    const failedAttempts = record.failedAttempts + 1;
    const locked = failedAttempts >= MAX_FAILED_ATTEMPTS;
    await this.save(username, {
      ...record,
      failedAttempts: locked ? 0 : failedAttempts,
      lockedUntil: locked ? new Date(Date.now() + LOCKOUT_MS).toISOString() : record.lockedUntil,
    });
    if (locked) {
      this.logger.warn(
        { username },
        'locked out two-factor verification for @{username} after too many failures'
      );
    }
  }

  /**
   * @returns the absolute time step the code belongs to, or `undefined` when it
   *   does not match. The step is what makes replay detectable.
   */
  private verifyTotp(record: TfaRecord, code: string): number | undefined {
    if (typeof code !== 'string' || /^\d{6}$/.test(code.trim()) === false) {
      return undefined;
    }
    const totp = this.buildTotp(record.secret);
    // `validate` returns the matching time-step delta, or null
    const delta = totp.validate({ token: code.trim(), window: TOTP_WINDOW });
    if (delta === null) {
      return undefined;
    }
    return Math.floor(Date.now() / 1000 / TOTP_PERIOD) + delta;
  }

  private buildTotp(secret: string, label?: string, issuer?: string): TOTP {
    return new TOTP({
      issuer: issuer ?? 'Verdaccio',
      label: label ?? 'verdaccio',
      algorithm: 'SHA1',
      digits: TOTP_DIGITS,
      period: TOTP_PERIOD,
      secret: Secret.fromBase32(secret),
    });
  }

  private async enqueueUserMutation<T>(username: string, run: () => Promise<T>): Promise<T> {
    const previous = this.userQueues.get(username) ?? Promise.resolve();
    const queued = previous.then(run, run);
    const cleanup = queued
      .catch(() => undefined)
      .finally(() => {
        if (this.userQueues.get(username) === cleanup) {
          this.userQueues.delete(username);
        }
      });
    this.userQueues.set(username, cleanup);
    return queued;
  }

  private async save(username: string, record: TfaRecord): Promise<void> {
    const encrypted = aesEncrypt(JSON.stringify(record), this.secretKey);
    if (!encrypted) {
      throw errorUtils.getInternalError('two-factor configuration could not be stored');
    }
    // saveToken upserts on (user, key) in the bundled plugins
    await this.storage.deleteToken(username, TFA_TOKEN_KEY).catch(() => undefined);
    await this.storage.saveToken({
      user: username,
      key: TFA_TOKEN_KEY,
      token: encrypted,
      readonly: false,
      created: Date.now(),
    });
  }
}

export { safeEqual as tfaSafeEqual };
