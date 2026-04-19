import { describe, expect, test } from 'vitest';

import { normalizeSearchOption } from './utils';

describe('normalizeSearchOption', () => {
  describe('wrapped (npm search-objects) shape', () => {
    test('extracts name, version and description from the package envelope', () => {
      const result = normalizeSearchOption({
        package: {
          name: '@starbase/auth',
          scope: '@starbase',
          version: '3.0.0',
          description: 'Authentication module with JWT, OAuth2, API keys, and session support.',
          keywords: ['auth', 'jwt'],
          date: '2026-04-06T16:51:06.944Z',
          publisher: {},
          links: { npm: '' },
        },
        score: {
          final: 1,
          detail: { maintenance: 0, popularity: 1, quality: 1 },
        },
        searchScore: 1,
        verdaccioPkgCached: false,
        verdaccioPrivate: true,
      });

      expect(result).toEqual({
        name: '@starbase/auth',
        version: '3.0.0',
        description: 'Authentication module with JWT, OAuth2, API keys, and session support.',
        isPrivate: true,
        isCached: false,
        isRemote: false,
      });
    });

    test('marks the option as cached when verdaccioPkgCached is true', () => {
      const result = normalizeSearchOption({
        package: { name: '@eslint/config-array', version: '0.23.3' },
        verdaccioPkgCached: true,
        verdaccioPrivate: false,
      });

      expect(result.isCached).toBe(true);
      expect(result.isPrivate).toBe(false);
      expect(result.isRemote).toBe(false);
    });

    test('marks the option as private when verdaccioPrivate is true', () => {
      const result = normalizeSearchOption({
        package: { name: '@starbase/admin-api', version: '2.0.0' },
        verdaccioPkgCached: false,
        verdaccioPrivate: true,
      });

      expect(result.isPrivate).toBe(true);
      expect(result.isCached).toBe(false);
      expect(result.isRemote).toBe(false);
    });

    test('infers remote when neither cached nor private', () => {
      const result = normalizeSearchOption({
        package: { name: '@angular/cli', version: '21.2.2' },
        verdaccioPkgCached: false,
        verdaccioPrivate: false,
      });

      expect(result.isRemote).toBe(true);
      expect(result.isCached).toBe(false);
      expect(result.isPrivate).toBe(false);
    });

    test('private takes precedence: a private package is never flagged as remote', () => {
      const result = normalizeSearchOption({
        package: { name: '@starbase/cache', version: '2.5.0' },
        verdaccioPkgCached: false,
        verdaccioPrivate: true,
      });

      expect(result.isRemote).toBe(false);
    });

    test('treats missing verdaccio metadata as falsy (not undefined)', () => {
      const result = normalizeSearchOption({
        package: { name: '@nodelib/fs.stat', version: '4.0.0' },
      });

      expect(result.isPrivate).toBe(false);
      expect(result.isCached).toBe(false);
      // With both flags absent, the UI should treat it as a remote suggestion.
      expect(result.isRemote).toBe(true);
    });

    test('returns undefined fields when the package envelope is empty', () => {
      const result = normalizeSearchOption({ package: {} });

      expect(result.name).toBeUndefined();
      expect(result.version).toBeUndefined();
      expect(result.description).toBeUndefined();
    });
  });

  describe('flat (packument-style) shape', () => {
    test('extracts name, version and description from top-level fields', () => {
      const result = normalizeSearchOption({
        name: 'aurora-logger',
        version: '1.2.0',
        description:
          'A lightweight, colorful logging library for Node.js applications. Supports multiple transports, log levels, and structured JSON output.',
        main: 'index.js',
        readmeFilename: 'README.md',
        dist: {
          shasum: '3150795ba15a52399fd68b262cb5dca9d6a1bb48',
          tarball: 'http://localhost:4873/aurora-logger/-/aurora-logger-1.2.0.tgz',
        },
        contributors: [],
      });

      expect(result).toEqual({
        name: 'aurora-logger',
        version: '1.2.0',
        description:
          'A lightweight, colorful logging library for Node.js applications. Supports multiple transports, log levels, and structured JSON output.',
        isPrivate: false,
        isCached: false,
        isRemote: false,
      });
    });

    test('handles a scoped flat entry', () => {
      const result = normalizeSearchOption({
        name: '@starbase/assert',
        version: '0.5.0',
        description: 'Lightweight assertion library with descriptive failure messages.',
        main: 'index.js',
        dist: { tarball: 'http://localhost:4873/@starbase/assert/-/@starbase/assert-0.5.0.tgz' },
      });

      expect(result.name).toBe('@starbase/assert');
      expect(result.version).toBe('0.5.0');
    });

    test('leaves all metadata flags false because the flat shape carries no uplink info', () => {
      const result = normalizeSearchOption({
        name: 'api-doc-gen',
        version: '2.0.0',
        description: 'Generate OpenAPI 3.1 specs from route definitions and TypeScript types.',
      });

      expect(result.isPrivate).toBe(false);
      expect(result.isCached).toBe(false);
      expect(result.isRemote).toBe(false);
    });

    test('preserves missing description as undefined', () => {
      const result = normalizeSearchOption({
        name: 'k8s-manifest-gen',
        version: '1.2.0',
      });

      expect(result.description).toBeUndefined();
    });
  });

  describe('nullish and malformed input', () => {
    test('returns a safe default when given undefined', () => {
      expect(normalizeSearchOption(undefined as any)).toEqual({
        name: undefined,
        version: undefined,
        description: undefined,
        isPrivate: false,
        isCached: false,
        isRemote: false,
      });
    });

    test('returns a safe default when given null', () => {
      expect(normalizeSearchOption(null as any)).toEqual({
        name: undefined,
        version: undefined,
        description: undefined,
        isPrivate: false,
        isCached: false,
        isRemote: false,
      });
    });

    test('returns a safe default for an empty object', () => {
      expect(normalizeSearchOption({} as any)).toEqual({
        name: undefined,
        version: undefined,
        description: undefined,
        isPrivate: false,
        isCached: false,
        isRemote: false,
      });
    });

    test('a `package: null` envelope falls back to the flat branch', () => {
      // Not strictly one of the documented shapes, but we want the helper
      // to be defensive rather than throw.
      const result = normalizeSearchOption({ package: null, name: 'fallback', version: '0.0.1' });

      expect(result.name).toBe('fallback');
      expect(result.version).toBe('0.0.1');
      expect(result.isRemote).toBe(false);
    });
  });
});
