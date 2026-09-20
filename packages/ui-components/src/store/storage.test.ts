import { afterEach, describe, expect, test } from 'vitest';

import { clearAuth, getAuth, saveAuth } from './storage';

describe('auth storage', () => {
  afterEach(() => {
    clearAuth();
  });

  test('should round-trip username and token', () => {
    saveAuth('jdoe', 'the-token');
    expect(getAuth()).toEqual({ username: 'jdoe', token: 'the-token' });
    expect(window.localStorage.getItem('username')).toBe('jdoe');
    expect(window.localStorage.getItem('token')).toBe('the-token');
  });

  test('should round-trip unicode usernames', () => {
    saveAuth('josé-日本-💙', 'the-token');
    expect(getAuth().username).toBe('josé-日本-💙');
  });

  test('should return nulls when nothing is stored', () => {
    expect(getAuth()).toEqual({ username: null, token: null });
  });

  test('clearAuth should remove both keys', () => {
    saveAuth('jdoe', 'the-token');
    clearAuth();
    expect(getAuth()).toEqual({ username: null, token: null });
    expect(window.localStorage.getItem('token')).toBeNull();
  });

  test('overwriting a session replaces both values', () => {
    saveAuth('first-user', 'first-token');
    saveAuth('second-user', 'second-token');
    expect(getAuth()).toEqual({ username: 'second-user', token: 'second-token' });
  });
});
