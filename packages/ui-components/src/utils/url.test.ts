import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { downloadFile, extractFileName, isEmail, isURL } from './url';

describe('utils', () => {
  describe('url', () => {
    test('isURL() - should return true for localhost', () => {
      expect(isURL('http://localhost:8080/bootstrap/-/bootstrap-4.3.1.tgz')).toBeTruthy();
    });

    test('isURL() - should return false when protocol is missing', () => {
      expect(isURL('localhost:8080/bootstrap/-/bootstrap-4.3.1.tgz')).toBeFalsy();
    });

    test('isEmail() - should return true if valid', () => {
      expect(isEmail('email@domain.com')).toBeTruthy();
    });
    test('isEmail() - should return false if invalid', () => {
      expect(isEmail('')).toBeFalsy();
    });

    test('git repo is valid', () => {
      expect(isURL('git://github.com/verdaccio/ui.git')).toBeTruthy();
    });

    test('isURL() - should not throw on non-string values (npm does not validate on publish)', () => {
      // @ts-expect-error deliberately wrong type coming from a real manifest
      expect(isURL(123)).toBeFalsy();
      // @ts-expect-error deliberately wrong type coming from a real manifest
      expect(isURL({ url: 'https://verdaccio.org' })).toBeFalsy();
      expect(isURL(undefined as unknown as string)).toBeFalsy();
    });
  });

  describe('extractFileName', () => {
    test('should return the file name', () => {
      expect(extractFileName('http://localhost:4872/juan_test_webpack1/-/test-10.0.0.tgz')).toBe(
        'test-10.0.0.tgz'
      );
    });
  });

  describe('downloadFile', () => {
    beforeEach(() => {
      // jsdom does not implement object URLs
      URL.createObjectURL = vi.fn().mockReturnValue('blob:mock-url');
      URL.revokeObjectURL = vi.fn();
    });

    afterEach(() => {
      vi.restoreAllMocks();
      vi.useRealTimers();
      delete (navigator as unknown as Record<string, unknown>).msSaveBlob;
    });

    test('should create and revoke an object url for the blob', () => {
      vi.useFakeTimers();
      downloadFile(new Blob(['archive-data']), 'pkg-1.0.0.tgz');

      expect(URL.createObjectURL).toHaveBeenCalledTimes(1);
      const file = (URL.createObjectURL as ReturnType<typeof vi.fn>).mock.calls[0][0] as File;
      expect(file.name).toBe('pkg-1.0.0.tgz');
      expect(file.type).toBe('application/octet-stream');

      vi.advanceTimersByTime(200);
      expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
    });

    test('should use the blob fallback on legacy Edge (no File constructor)', () => {
      vi.useFakeTimers();
      (navigator as any).msSaveBlob = vi.fn();

      downloadFile(new Blob(['archive-data']), 'pkg-1.0.0.tgz');

      expect(URL.createObjectURL).toHaveBeenCalledTimes(1);
      const file = (URL.createObjectURL as ReturnType<typeof vi.fn>).mock.calls[0][0] as File;
      expect(file.name).toBe('pkg-1.0.0.tgz');

      vi.advanceTimersByTime(200);
      expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
    });
  });
});
