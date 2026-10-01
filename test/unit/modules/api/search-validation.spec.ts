import nock from 'nock';
import supertest from 'supertest';
import { afterEach, describe, expect, test, vi } from 'vitest';

import { HEADERS, HTTP_STATUS } from '@verdaccio/core';

import Storage from '../../../../src/lib/storage';
import { initializeServer } from './_helper';

afterEach(() => {
  vi.restoreAllMocks();
  nock.cleanAll();
  nock.abortPendingRequests();
});

describe.each(['search.yaml', 'search-uplink.yaml'])('search text validation (%s)', (config) => {
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
    '?text=foo&text%5Bquery%5D=bar',
    '?Text=foo',
  ])('rejects invalid text before searching (%s)', async (query) => {
    const app = await initializeServer(config);
    const search = vi.spyOn(Storage.prototype, 'search');

    const response = await supertest(app)
      .get(`/-/v1/search${query}`)
      .timeout(2000)
      .expect(HEADERS.CONTENT_TYPE, HEADERS.JSON_CHARSET)
      .expect(HTTP_STATUS.BAD_REQUEST);

    expect(response.body).toEqual({
      error: "'text' query parameter is required",
      code: 'ERR_TEXT_MISSING',
    });
    expect(search).not.toHaveBeenCalled();
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
      const app = await initializeServer('search-uplink.yaml');

      const response = await supertest(app)
        .get('/-/v1/search')
        .query({ text })
        .expect(HTTP_STATUS.OK);

      expect(response.body.objects).toEqual([]);
      expect(uplink.isDone()).toBe(true);
    }
  );

  test('keeps serving searches after rejecting invalid text', async () => {
    const app = await initializeServer('search.yaml');

    await supertest(app)
      .get('/-/v1/search?text=foo&text=bar')
      .timeout(2000)
      .expect(HTTP_STATUS.BAD_REQUEST);

    const response = await supertest(app).get('/-/v1/search?text=foo').expect(HTTP_STATUS.OK);

    expect(response.body).toEqual({ objects: [], total: 0, time: expect.any(String) });
  });
});
