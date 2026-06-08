import { describe, expect, test } from 'vitest';

import { parseBasicPayload } from '../src';

describe('parseBasicPayload', () => {
  describe('legacy "user:password" format', () => {
    test('parses user and password', () => {
      expect(parseBasicPayload('juan:password')).toEqual({
        user: 'juan',
        password: 'password',
      });
    });

    test('keeps colons that belong to the password', () => {
      expect(parseBasicPayload('juan:pass:word')).toEqual({
        user: 'juan',
        password: 'pass:word',
      });
    });

    test('returns undefined when there is no colon separator', () => {
      expect(parseBasicPayload('juan')).toBeUndefined();
    });
  });

  describe('JSON payload format', () => {
    test('parses user, password and tokenKey', () => {
      const payload = JSON.stringify({
        user: 'juan',
        password: 'password',
        tokenKey: 'abc123',
      });

      expect(parseBasicPayload(payload)).toEqual({
        user: 'juan',
        password: 'password',
        tokenKey: 'abc123',
      });
    });

    test('leaves tokenKey undefined when it is absent', () => {
      const payload = JSON.stringify({ user: 'juan', password: 'password' });

      expect(parseBasicPayload(payload)).toEqual({
        user: 'juan',
        password: 'password',
        tokenKey: undefined,
      });
    });

    test('leaves tokenKey undefined when it is not a string', () => {
      const payload = JSON.stringify({ user: 'juan', password: 'password', tokenKey: 42 });

      expect(parseBasicPayload(payload)).toEqual({
        user: 'juan',
        password: 'password',
        tokenKey: undefined,
      });
    });
  });

  describe('ambiguous "{"-prefixed input', () => {
    test('falls back to legacy parsing when the JSON lacks user/password', () => {
      // valid JSON, but not a credentials object: should not short-circuit
      expect(parseBasicPayload('{}:password')).toEqual({
        user: '{}',
        password: 'password',
      });
    });

    test('falls back to legacy parsing when the JSON is malformed', () => {
      // starts with "{" but is not valid JSON; must still honor the colon format
      expect(parseBasicPayload('{user:password')).toEqual({
        user: '{user',
        password: 'password',
      });
    });

    test('returns undefined for malformed JSON with no colon separator', () => {
      expect(parseBasicPayload('{user')).toBeUndefined();
    });
  });
});
