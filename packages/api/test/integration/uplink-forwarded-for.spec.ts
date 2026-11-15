import nock from 'nock';
import supertest from 'supertest';
import type { Application } from 'express';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';

import { HEADERS, HTTP_STATUS } from '@verdaccio/core';
import { generateRemotePackageMetadata } from '@verdaccio/test-helper';

import { initializeServer } from './_helper';

const UPLINK = 'https://registry.forwarded.test';
const PINNED = 'https://pinned.forwarded.test';
const ELSEWHERE = 'https://cdn.forwarded.test';
// nock exposes the request headers in lower case
const FORWARDED_FOR = 'x-forwarded-for';
const CHAIN = '203.0.113.7, 10.0.0.1';
// supertest connects over loopback, so that is the address verdaccio sees
const LOOPBACK = '(?:::ffff:127\\.0\\.0\\.1|127\\.0\\.0\\.1|::1)';

/** The header as the uplink received it: `undefined` when the request did not carry it. */
type Seen = { metadata: (string | undefined)[]; tarball: (string | undefined)[] };

function mockUplink(name: string, host = UPLINK, tarballHost = host): Seen {
  const seen: Seen = { metadata: [], tarball: [] };
  const remote = generateRemotePackageMetadata(name, '1.0.0', tarballHost);
  nock(host)
    .persist()
    .get(`/${name}`)
    .reply(function () {
      seen.metadata.push(this.req.headers[FORWARDED_FOR] as string | undefined);
      return [HTTP_STATUS.OK, remote];
    });
  nock(tarballHost)
    .persist()
    .get(`/${name}/-/${name}-1.0.0.tgz`)
    .reply(function () {
      seen.tarball.push(this.req.headers[FORWARDED_FOR] as string | undefined);
      return [HTTP_STATUS.OK, 'tarball'];
    });
  return seen;
}

const getManifest = (app: Application, name: string, forwardedFor?: string) => {
  const request = supertest(app).get(`/${name}`).set(HEADERS.ACCEPT, HEADERS.JSON);
  return (forwardedFor ? request.set(HEADERS.FORWARDED_FOR, forwardedFor) : request).expect(
    HTTP_STATUS.OK
  );
};

const getTarball = (app: Application, name: string, forwardedFor?: string) => {
  const request = supertest(app).get(`/${name}/-/${name}-1.0.0.tgz`);
  return (forwardedFor ? request.set(HEADERS.FORWARDED_FOR, forwardedFor) : request).expect(
    HTTP_STATUS.OK
  );
};

describe('x-forwarded-for sent to uplinks', () => {
  let app: Application;

  beforeEach(async () => {
    nock.cleanAll();
    app = await initializeServer('uplink-forwarded-for.yaml');
  });

  afterEach(() => {
    nock.cleanAll();
  });

  test('manifest request forwards the incoming chain plus the client address', async () => {
    const seen = mockUplink('remote-manifest-chain');
    await getManifest(app, 'remote-manifest-chain', CHAIN);
    expect(seen.metadata).toHaveLength(1);
    expect(seen.metadata[0]).toMatch(
      new RegExp(`^203\\.0\\.113\\.7, 10\\.0\\.0\\.1, ${LOOPBACK}$`)
    );
  });

  test('manifest request without a chain forwards only the client address', async () => {
    const seen = mockUplink('remote-manifest-direct');
    await getManifest(app, 'remote-manifest-direct');
    expect(seen.metadata).toHaveLength(1);
    expect(seen.metadata[0]).toMatch(new RegExp(`^${LOOPBACK}$`));
  });

  test('tarball request forwards the incoming chain plus the client address', async () => {
    const seen = mockUplink('remote-tarball-chain');
    await getTarball(app, 'remote-tarball-chain', CHAIN);
    const expected = new RegExp(`^203\\.0\\.113\\.7, 10\\.0\\.0\\.1, ${LOOPBACK}$`);
    expect(seen.tarball).toHaveLength(1);
    expect(seen.tarball[0]).toMatch(expected);
    // the manifest lookup done to resolve the tarball carries it too
    expect(seen.metadata.length).toBeGreaterThan(0);
    for (const value of seen.metadata) {
      expect(value).toMatch(expected);
    }
  });

  test('tarball request without a chain forwards only the client address', async () => {
    const seen = mockUplink('remote-tarball-direct');
    await getTarball(app, 'remote-tarball-direct');
    expect(seen.tarball).toHaveLength(1);
    expect(seen.tarball[0]).toMatch(new RegExp(`^${LOOPBACK}$`));
    expect([...seen.metadata, ...seen.tarball]).not.toContain('undefined');
  });

  test('tarball request after the manifest is cached still forwards the chain', async () => {
    const seen = mockUplink('remote-tarball-cached');
    await getManifest(app, 'remote-tarball-cached');
    await getTarball(app, 'remote-tarball-cached', CHAIN);
    expect(seen.tarball).toHaveLength(1);
    expect(seen.tarball[0]).toMatch(new RegExp(`^203\\.0\\.113\\.7, 10\\.0\\.0\\.1, ${LOOPBACK}$`));
  });

  test('tarball hosted outside the uplink is requested without the client origin', async () => {
    const seen = mockUplink('remote-tarball-elsewhere', UPLINK, ELSEWHERE);
    await getTarball(app, 'remote-tarball-elsewhere', CHAIN);
    expect(seen.tarball).toEqual([undefined]);
  });

  test('x-forwarded-for set in the uplink headers wins over the client origin', async () => {
    const seen = mockUplink('pinned-package', PINNED);
    await getManifest(app, 'pinned-package', CHAIN);
    await getTarball(app, 'pinned-package', CHAIN);
    expect(seen.metadata.length).toBeGreaterThan(0);
    expect(seen.tarball).toHaveLength(1);
    expect(new Set([...seen.metadata, ...seen.tarball])).toEqual(new Set(['192.0.2.99']));
  });
});
