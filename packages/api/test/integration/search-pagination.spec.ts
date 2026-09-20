import nock from 'nock';
import supertest from 'supertest';
import { afterEach, describe, expect, test, vi } from 'vitest';

import {
  createUser,
  initializeServer,
  initializeServerWithContext,
  publishVersionWithToken,
} from './_helper';

const domain = 'https://registry.npmjs.org';
const item = (name: string, version = '1.0.0') => ({ package: { name, version } });
const catalog = (count: number) => Array.from({ length: count }, (_, i) => item(`remote-${i}`));

function paginatedUplink(objects: ReturnType<typeof item>[], cap = 250, reportTotal = true) {
  const requests: URLSearchParams[] = [];
  nock(domain)
    .persist()
    .get('/-/v1/search')
    .query(true)
    .reply(200, (uri) => {
      const query = new URL(uri, domain).searchParams;
      requests.push(query);
      const from = Number(query.get('from'));
      const size = Math.min(Number(query.get('size')), cap);
      return {
        objects: objects.slice(from, from + size),
        ...(reportTotal ? { total: objects.length } : {}),
      };
    });
  return requests;
}

const names = (response) => response.body.objects.map((entry) => entry.package.name);

afterEach(() => {
  nock.cleanAll();
  nock.abortPendingRequests();
  vi.restoreAllMocks();
});

describe('Search v1 progressive pagination', () => {
  test.each([401, 404, 429, 500, 'connection', 'timeout', 'json'])(
    'preserves local pagination when the first uplink request fails (%s)',
    async (failure) => {
      const upstream = nock(domain).persist().get('/-/v1/search').query(true);
      if (failure === 'connection' || failure === 'timeout') {
        upstream.replyWithError({
          code: failure === 'connection' ? 'ECONNREFUSED' : 'ETIMEDOUT',
          message: String(failure),
        });
      } else if (failure === 'json') {
        upstream.reply(200, 'invalid JSON');
      } else {
        upstream.reply(failure);
      }
      const app = await initializeServer('search-abort.yaml');
      const user = await createUser(app, 'test', 'test');
      for (const name of ['foo-a', 'foo-b', 'foo-c']) {
        await publishVersionWithToken(app, name, '1.0.0', user.body.token);
      }
      const first = await supertest(app).get('/-/v1/search?text=foo&from=0&size=2').expect(200);
      const second = await supertest(app).get('/-/v1/search?text=foo&from=2&size=2').expect(200);
      expect(names(first)).toEqual(['foo-a', 'foo-b']);
      expect(names(second)).toEqual(['foo-c']);
    }
  );

  test('returns an empty successful page when all sources are unavailable and no locals match', async () => {
    nock(domain)
      .get('/-/v1/search')
      .query(true)
      .replyWithError({ code: 'ECONNREFUSED', message: 'offline' });
    const app = await initializeServer('search-abort.yaml');
    const response = await supertest(app)
      .get('/-/v1/search?text=missing&from=20&size=20')
      .expect(200);
    expect(names(response)).toEqual([]);
  });

  test.each(['first', 'second'])(
    'continues paging the healthy source when %s is unavailable',
    async (failed) => {
      let failures = 0;
      const offsets: number[] = [];
      for (const name of ['first', 'second']) {
        const host = `https://${name}.registry.test`;
        if (name === failed) {
          nock(host)
            .get('/-/v1/search')
            .query(true)
            .reply(503, () => {
              failures++;
              return {};
            });
        } else {
          nock(host)
            .persist()
            .get('/-/v1/search')
            .query(true)
            .reply(200, (uri) => {
              const from = Number(new URL(uri, host).searchParams.get('from'));
              offsets.push(from);
              return { objects: catalog(6).slice(from, from + 2), total: 6 };
            });
        }
      }
      const app = await initializeServer('search-pagination.yaml');
      const response = await supertest(app)
        .get('/-/v1/search?text=remote&from=3&size=2')
        .expect(200);
      expect(names(response)).toEqual(['remote-3', 'remote-4']);
      expect(offsets).toEqual([0, 2, 4]);
      expect(failures).toBe(1);
    }
  );

  test.each([
    ['first', 15, 0],
    ['second', 0, 15],
  ])(
    'keeps round and duplicate ordering when %s is slower',
    async (_name, firstDelay, secondDelay) => {
      const mock = (host: string, delay: number, entries: ReturnType<typeof item>[]) => {
        const offsets: number[] = [];
        nock(host)
          .persist()
          .get('/-/v1/search')
          .query(true)
          .delay(delay)
          .reply(200, (uri) => {
            const offset = Number(new URL(uri, host).searchParams.get('from'));
            offsets.push(offset);
            return { objects: entries.slice(offset, offset + 2), total: entries.length };
          });
        return offsets;
      };
      const first = mock('https://first.registry.test', firstDelay, [
        item('a'),
        item('b'),
        item('d'),
        item('e'),
      ]);
      const second = mock('https://second.registry.test', secondDelay, [
        item('a', '2.0.0'),
        item('c'),
        item('f'),
        item('g'),
      ]);
      const app = await initializeServer('search-pagination.yaml');
      const response = await supertest(app).get('/-/v1/search?text=any&from=1&size=5').expect(200);
      expect(names(response)).toEqual(['b', 'c', 'd', 'e', 'f']);
      const pageOne = await supertest(app).get('/-/v1/search?text=any&from=0&size=1').expect(200);
      expect(pageOne.body.objects[0].package).toEqual({ name: 'a', version: '2.0.0' });
      expect(first).toEqual([0, 2, 0]);
      expect(second).toEqual([0, 2, 0]);
    }
  );

  test('fills a deep page using bounded requests and preserves search parameters', async () => {
    const requests = paginatedUplink(catalog(600));
    const app = await initializeServer('search-abort.yaml');
    const response = await supertest(app)
      .get(
        '/-/v1/search?text=remote%20test&from=300&size=20&quality=0.1&popularity=0.2&maintenance=0.3'
      )
      .expect(200);
    expect(names(response)).toEqual(
      catalog(600)
        .slice(300, 320)
        .map((entry) => entry.package.name)
    );
    expect(requests.map((query) => query.get('from'))).toEqual(['0', '250']);
    for (const query of requests) {
      expect(Object.fromEntries(query)).toMatchObject({
        size: '250',
        text: 'remote test',
        quality: '0.1',
        popularity: '0.2',
        maintenance: '0.3',
      });
    }
  });

  test('continues after short pages when an uplink has a smaller cap and no total', async () => {
    const requests = paginatedUplink(catalog(8), 2, false);
    const app = await initializeServer('search-abort.yaml');
    const response = await supertest(app).get('/-/v1/search?text=remote&from=5&size=2').expect(200);
    expect(names(response)).toEqual(['remote-5', 'remote-6']);
    expect(requests.map((query) => query.get('from'))).toEqual(['0', '2', '4', '6']);
  });

  test.each([0, 6, 8, 100])('handles empty and exhausted pages at offset %i', async (from) => {
    const requests = paginatedUplink(catalog(7), 2, false);
    const app = await initializeServer('search-abort.yaml');
    const response = await supertest(app)
      .get(`/-/v1/search?text=remote&from=${from}&size=2`)
      .expect(200);
    expect(names(response)).toEqual(
      catalog(7)
        .slice(from, from + 2)
        .map((entry) => entry.package.name)
    );
    expect(requests.length).toBeLessThanOrEqual(5);
  });

  test('combines local and remote packages and retains the newer duplicate in its original position', async () => {
    const app = await initializeServer('search-abort.yaml');
    const user = await createUser(app, 'test', 'test');
    await publishVersionWithToken(app, 'foo-a', '1.0.0', user.body.token);
    await publishVersionWithToken(app, 'foo-b', '1.0.0', user.body.token);
    const requests = paginatedUplink(
      [item('foo-a', '2.0.0'), item('foo-c'), item('foo-d'), item('foo-e')],
      2
    );
    const first = await supertest(app).get('/-/v1/search?text=foo&from=0&size=2').expect(200);
    const second = await supertest(app).get('/-/v1/search?text=foo&from=2&size=2').expect(200);
    expect(names(first)).toEqual(['foo-a', 'foo-b']);
    expect(first.body.objects[0].package.version).toBe('2.0.0');
    expect(names(second)).toEqual(['foo-c', 'foo-d']);
    expect(requests.map((query) => query.get('from'))).toEqual(['0', '0', '2']);
  });

  test('fetches more candidates after denied permissions and checks each name once', async () => {
    const requests = paginatedUplink(catalog(10), 2);
    const { app, auth } = await initializeServerWithContext('search-abort.yaml');
    const access = vi.spyOn(auth, 'allow_access').mockImplementation((pkg, _user, callback) => {
      callback(null, Number(pkg.packageName.split('-')[1]) % 2 === 0);
    });
    const response = await supertest(app).get('/-/v1/search?text=remote&from=2&size=2').expect(200);
    expect(names(response)).toEqual(['remote-4', 'remote-6']);
    expect(requests).toHaveLength(4);
    expect(access).toHaveBeenCalledTimes(8);
  });

  test('does no upstream work for size zero', async () => {
    const requests = paginatedUplink(catalog(10));
    const app = await initializeServer('search-abort.yaml');
    const response = await supertest(app).get('/-/v1/search?text=remote&from=5&size=0').expect(200);
    expect(names(response)).toEqual([]);
    expect(requests).toHaveLength(0);
  });

  test('aborts an in-flight second HTTP page when the client disconnects', async () => {
    nock(domain)
      .get('/-/v1/search')
      .query(true)
      .reply(200, { objects: catalog(2), total: 10 });
    let started: () => void;
    const secondStarted = new Promise<void>((resolve) => {
      started = resolve;
    });
    nock(domain)
      .get('/-/v1/search')
      .query(true)
      .delay(5_000)
      .reply(200, { objects: [item('remote-2'), item('remote-3')], total: 10 })
      .on('request', () => started!());
    const third = nock(domain)
      .get('/-/v1/search')
      .query({ text: 'remote', from: '4', size: '250' })
      .reply(200, { objects: [], total: 10 });
    const { app, storage } = await initializeServerWithContext('search-abort.yaml');
    const search = vi.spyOn(storage, 'searchPages');
    const request = supertest(app).get('/-/v1/search?text=remote&from=4&size=2');
    request.end(() => {});
    await secondStarted;
    const signal = search.mock.calls[0][0].abort.signal;
    const cancelled = new Promise<void>((resolve) =>
      signal.addEventListener('abort', () => resolve(), { once: true })
    );
    request.abort();
    await cancelled;
    expect(signal.aborted).toBe(true);
    expect(third.isDone()).toBe(false);
  });

  test('rejects an uplink that repeats pages instead of silently truncating results', async () => {
    let requests = 0;
    nock(domain)
      .persist()
      .get('/-/v1/search')
      .query(true)
      .reply(200, () => {
        requests++;
        return { objects: catalog(2), total: 100 };
      });
    const app = await initializeServer('search-abort.yaml');
    const response = await supertest(app).get('/-/v1/search?text=remote&from=2&size=2').expect(503);
    expect(response.body.error).toContain('did not advance');
    expect(requests).toBe(2);
  });

  test('rejects requests that exhaust the shared uplink request budget', async () => {
    const requests = paginatedUplink(catalog(200), 1);
    const app = await initializeServer('search-abort.yaml');
    const response = await supertest(app)
      .get('/-/v1/search?text=remote&from=100&size=2')
      .expect(503);
    expect(response.body.error).toContain('budget exhausted');
    expect(requests).toHaveLength(100);
  });

  test('reports an upstream failure after a successful page without returning partial success', async () => {
    nock(domain)
      .get('/-/v1/search')
      .query(true)
      .reply(200, { objects: catalog(2), total: 10 });
    const failed = nock(domain).get('/-/v1/search').query(true).reply(500);
    const app = await initializeServer('search-abort.yaml');
    await supertest(app).get('/-/v1/search?text=remote&from=2&size=2').expect(503);
    expect(failed.isDone()).toBe(true);
  });
});
