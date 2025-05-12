import { describe, expect, test } from 'vitest';

import { createRemoteUser } from '@verdaccio/config';

import { signPayload, verifyPayload } from '../src';

describe('signPayload and verifyPayload', () => {
  test('should sign a payload and return a valid JWT', async () => {
    const remoteUser = createRemoteUser('bar', ['group1', 'group2']);
    const token = await signPayload(remoteUser, 'mysecret');
    expect(typeof token).toBe('string');
    const verified = verifyPayload(token, 'mysecret');
    expect(verified.name).toBe(remoteUser.name);
    expect(verified.groups).toEqual(remoteUser.groups);
  });

  test('should verify the token and return a remote user', async () => {
    const remoteUser = createRemoteUser('foo', []);
    const token = await signPayload(remoteUser, '12345');
    const verifiedToken = verifyPayload(token, '12345');
    expect(verifiedToken.groups).toEqual(remoteUser.groups);
    expect(verifiedToken.name).toEqual(remoteUser.name);
  });

  test('should throw if token is invalid', () => {
    expect(() => verifyPayload('invalid.token.value', 'mysecret')).toThrow(
      /jwt malformed|invalid token/
    );
  });

  test('should throw if secret is wrong', async () => {
    const remoteUser = createRemoteUser('baz', ['group3']);
    const token = await signPayload(remoteUser, 'rightsecret');
    expect(() => verifyPayload(token, 'wrongsecret')).toThrow(/invalid signature/);
  });

  test('should throw if token is expired', async () => {
    const remoteUser = createRemoteUser('exp', ['group4']);
    // Token expires in 1ms
    const token = await signPayload(remoteUser, 'expiresecret', { expiresIn: '1ms' });
    // Wait to ensure token is expired
    await new Promise((r) => setTimeout(r, 10));
    expect(() => verifyPayload(token, 'expiresecret')).toThrow(/jwt expired/);
  });

  test('should throw if token is not active yet (nbf in future)', async () => {
    const remoteUser = createRemoteUser('nbf', ['group5']);
    // Token not active for 1 minute
    const token = await signPayload(remoteUser, 'nbfsecret', { notBefore: '1m' });
    expect(() => verifyPayload(token, 'nbfsecret')).toThrow(/jwt not active/);
  });

  test('should sign and verify with correct issuer', async () => {
    const remoteUser = createRemoteUser('issuerUser', ['group6']);
    const token = await signPayload(remoteUser, 'issuersecret', { issuer: 'verdaccio' });
    // Should verify with correct issuer
    const verified = verifyPayload(token, 'issuersecret', { issuer: 'verdaccio' });
    expect(verified.name).toBe(remoteUser.name);
    // Should throw with wrong issuer
    expect(() => verifyPayload(token, 'issuersecret', { issuer: 'wrong' })).toThrow(
      /jwt issuer invalid/
    );
  });
});
