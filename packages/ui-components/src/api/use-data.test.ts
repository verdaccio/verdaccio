import { describe, expect, test } from 'vitest';

import { APIRoute } from '../utils/routes';
import { buildUrl } from './use-data';

const BASE = 'http://localhost:9000';

describe('buildUrl', () => {
  test('should keep @ and / literal in scoped package names (registry wire format)', () => {
    expect(buildUrl(BASE, APIRoute.SIDEBAR, '@verdaccio/ui-components')).toBe(
      'http://localhost:9000/-/verdaccio/data/sidebar/@verdaccio/ui-components'
    );
  });

  test('should encode the version query (build metadata like + must survive)', () => {
    expect(buildUrl(BASE, APIRoute.SIDEBAR, 'jquery', '1.0.0+build.5')).toBe(
      'http://localhost:9000/-/verdaccio/data/sidebar/jquery?v=1.0.0%2Bbuild.5'
    );
  });

  test('should encode unsafe characters inside name segments', () => {
    expect(buildUrl(BASE, APIRoute.README, 'weird name')).toBe(
      'http://localhost:9000/-/verdaccio/data/package/readme/weird%20name'
    );
  });

  test('should build plain urls without name or version', () => {
    expect(buildUrl(BASE, APIRoute.PACKAGES)).toBe(
      'http://localhost:9000/-/verdaccio/data/packages'
    );
  });
});
