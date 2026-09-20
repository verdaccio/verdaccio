import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';

import useLocalStorage from './useLocalStorage';

describe('useLocalStorage', () => {
  afterEach(() => {
    window.localStorage.removeItem('test-key');
    vi.restoreAllMocks();
  });

  test('should return the initial value when nothing is stored', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'fallback'));
    expect(result.current[0]).toBe('fallback');
  });

  test('should read an existing stored value', () => {
    window.localStorage.setItem('test-key', JSON.stringify({ a: 1 }));
    const { result } = renderHook(() => useLocalStorage('test-key', {}));
    expect(result.current[0]).toEqual({ a: 1 });
  });

  test('should persist values set through the setter', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    act(() => {
      result.current[1]('updated');
    });
    expect(result.current[0]).toBe('updated');
    expect(window.localStorage.getItem('test-key')).toBe(JSON.stringify('updated'));
  });

  test('should support a functional setter like useState', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 1));
    act(() => {
      result.current[1]((prev: number) => prev + 1);
    });
    expect(result.current[0]).toBe(2);
  });

  test('should fall back to the initial value when the stored json is corrupt', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    window.localStorage.setItem('test-key', '{not-json');
    const { result } = renderHook(() => useLocalStorage('test-key', 'fallback'));
    expect(result.current[0]).toBe('fallback');
    expect(consoleError).toHaveBeenCalled();
  });

  test('should keep working when localStorage write fails (e.g. quota exceeded)', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    act(() => {
      result.current[1]('updated');
    });
    expect(consoleError).toHaveBeenCalled();
  });
});
