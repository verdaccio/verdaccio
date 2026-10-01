import nock from 'nock';
import supertest from 'supertest';
import { afterEach, describe, expect, test, vi } from 'vitest';

import { HEADERS, HTTP_STATUS } from '@verdaccio/core';

import { initializeServer, initializeServerWithContext } from './_helper';

afterEach(() => {
  vi.restoreAllMocks();
  nock.cleanAll();
  nock.abortPendingRequests();
});

describe.each(['search.yaml', 'search-abort.yaml'])('search text validation (%s)', (config) => {
  test.each([
    '',
    '?size=0',
    '?text',
    '?text=',
    '?text=&size=0',
    '?text=%20%20',
    '?text=+++',
    '?text=%09%0A%0D',
    '?text=%C2%A0',
    '?text=foo&text=bar',
    '?text=foo&text=foo',
    '?text=&text=foo',
    '?text=foo&text=',
    '?text%5B%5D=foo',
    '?text%5B0%5D=foo',
    '?text%5Bquery%5D=foo',
    '?Text=foo',
  ])('rejects missing or invalid text before searching (%s)', async (query) => {
    const { app, storage } = await initializeServerWithContext(config);
    const searchPages = vi.spyOn(storage, 'searchPages');

    const response = await supertest(app)
      .get(`/-/v1/search${query}`)
      .expect(HEADERS.CONTENT_TYPE, HEADERS.JSON_CHARSET)
      .expect(HTTP_STATUS.BAD_REQUEST);

    expect(response.body).toEqual({
      error: "'text' query parameter is required",
      code: 'ERR_TEXT_MISSING',
    });
    expect(searchPages).not.toHaveBeenCalled();
  });
});

describe('valid search text', () => {
  test.each(['a', 'a'.repeat(65), '0', 'false', 'null', 'undefined', 'café', '😀'])(
    'returns an empty successful result when nothing matches (%s)',
    async (text) => {
      const app = await initializeServer('search.yaml');
      const response = await supertest(app)
        .get('/-/v1/search')
        .query({ text })
        .expect(HTTP_STATUS.OK);

      expect(response.body).toEqual({ objects: [], total: 0, time: expect.any(String) });
    }
  );

  test.each([' foo ', 'foo bar', '@scope/foo', 'café+foo&bar'])(
    'preserves valid text when forwarding the search (%s)',
    async (text) => {
      const uplink = nock('https://registry.npmjs.org')
        .get('/-/v1/search')
        .query((query) => query.text === text)
        .reply(HTTP_STATUS.OK, { objects: [], total: 0 });
      const app = await initializeServer('search-abort.yaml');

      const response = await supertest(app)
        .get('/-/v1/search')
        .query({ text })
        .expect(HTTP_STATUS.OK);

      expect(response.body.objects).toEqual([]);
      expect(uplink.isDone()).toBe(true);
    }
  );
});
