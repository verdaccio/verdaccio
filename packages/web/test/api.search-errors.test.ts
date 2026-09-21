import nock from 'nock';
import path from 'node:path';
import supertest from 'supertest';
import { afterEach, beforeAll, describe, expect, test, vi } from 'vitest';

import { HEADERS, HTTP_STATUS } from '@verdaccio/core';
import { logger, setup } from '@verdaccio/logger';
import { publishVersion } from '@verdaccio/test-helper';

import { initializeServer } from './helper';

const mockManifest = vi.hoisted(() => vi.fn());
vi.mock('@verdaccio/ui-theme', () => ({ default: (...args: any[]) => mockManifest()(...args) }));

beforeAll(async () => {
  await setup({});
  mockManifest.mockReturnValue(() => ({
    staticPath: path.join(import.meta.dirname, 'static'),
    manifestFiles: { js: ['runtime.js', 'vendors.js', 'main.js'] },
    manifest: require('./partials/manifest/manifest.json'),
  }));
});

afterEach(() => {
  nock.abortPendingRequests();
  nock.cleanAll();
  vi.restoreAllMocks();
});

describe('web search with an unavailable uplink', () => {
  test.each([
    { text: 'match', names: ['local-match'] },
    { text: 'no-matching-results', names: [] },
  ])('returns local matches for "$text" when every uplink fails', async ({ text, names }) => {
    const app = await initializeServer('search-errors.yaml');
    await publishVersion(app, 'local-match', '1.0.0');
    await publishVersion(app, 'blocked-match', '1.0.0');
    const log = vi.spyOn(logger, 'error').mockImplementation(() => {});
    const upstreams = ['failing', 'healthy'].map((name) =>
      nock(`https://${name}.registry.test`)
        .get('/-/v1/search')
        .query(true)
        .replyWithError({ code: 'ECONNREFUSED', message: `${name} uplink is unavailable` })
    );

    const response = await supertest(app)
      .get(`/-/verdaccio/data/search/${text}`)
      .set('Accept', HEADERS.JSON_CHARSET)
      .expect(HTTP_STATUS.OK);

    expect(response.body.map((item) => item.package.name)).toEqual(names);
    expect(log).toHaveBeenCalledTimes(2);
    for (const name of ['failing', 'healthy']) {
      expect(log).toHaveBeenCalledWith(
        { name, errorMessage: `${name} uplink is unavailable` },
        'proxy uplink @{name} search error: @{errorMessage}'
      );
    }
    expect(upstreams.every((upstream) => upstream.isDone())).toBe(true);
  });

  test.each([
    {
      failure: 'DNS failure',
      reply: (scope: nock.Interceptor) =>
        scope.replyWithError({ code: 'ENOTFOUND', message: 'failed uplink DNS lookup' }),
      errorMessage: 'failed uplink DNS lookup',
    },
    {
      failure: 'invalid JSON',
      reply: (scope: nock.Interceptor) => scope.reply(200, '<html>not JSON</html>'),
      errorMessage: expect.stringContaining('JSON'),
    },
    {
      failure: 'HTTP 503',
      reply: (scope: nock.Interceptor) => scope.reply(503),
      errorMessage: expect.stringContaining('503'),
    },
  ])('retains allowed local and remote results after $failure', async ({ reply, errorMessage }) => {
    const app = await initializeServer('search-errors.yaml');
    await publishVersion(app, 'local-match', '1.0.0');
    const log = vi.spyOn(logger, 'error').mockImplementation(() => {});
    const failing = reply(nock('https://failing.registry.test').get('/-/v1/search').query(true));
    const healthy = nock('https://healthy.registry.test')
      .get('/-/v1/search')
      .query(true)
      .reply(200, {
        objects: [
          { package: { name: 'remote-match', version: '1.0.0' } },
          { package: { name: 'blocked-match', version: '1.0.0' } },
        ],
        total: 2,
      });

    const response = await supertest(app)
      .get('/-/verdaccio/data/search/match')
      .set('Accept', HEADERS.JSON_CHARSET)
      .expect(HTTP_STATUS.OK);

    expect(response.body.map((item) => item.package.name)).toEqual(['local-match', 'remote-match']);
    expect(log).toHaveBeenCalledWith(
      { name: 'failing', errorMessage },
      'proxy uplink @{name} search error: @{errorMessage}'
    );
    expect(failing.isDone()).toBe(true);
    expect(healthy.isDone()).toBe(true);
  });
});
