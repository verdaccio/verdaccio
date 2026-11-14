import type { Application } from 'express';
import crypto from 'node:crypto';
import fs from 'node:fs';
import http from 'node:http';
import type { AddressInfo } from 'node:net';
import path from 'node:path';
import supertest from 'supertest';
import { afterEach, describe, expect, test, vi } from 'vitest';

import { HEADER_TYPE, HTTP_STATUS } from '@verdaccio/core';
import { generateRemotePackageMetadata } from '@verdaccio/test-helper';

import Storage from '../../../../src/lib/storage';
import { initializeServer, publishVersion } from './_helper';

// larger than every buffer between the file and the socket, so a download is still in flight
const TARBALL_SIZE = 16 * 1024 * 1024;
const TARBALL = crypto.randomBytes(TARBALL_SIZE);
const FIRST_CHUNK = 64 * 1024;

const cleanups: Array<() => void | Promise<void>> = [];

afterEach(async () => {
  for (const cleanup of cleanups.splice(0).reverse()) {
    await cleanup();
  }
  vi.restoreAllMocks();
});

async function waitFor(condition: () => boolean, what: string, timeout = 4000): Promise<void> {
  const deadline = Date.now() + timeout;
  while (!condition()) {
    if (Date.now() > deadline) {
      throw new Error(`timed out waiting for ${what}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
}

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

async function listen(
  handler: http.RequestListener
): Promise<{ server: http.Server; port: number }> {
  const server = http.createServer(handler);
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  cleanups.push(
    () =>
      new Promise<void>((resolve) => {
        server.closeAllConnections();
        server.close(() => resolve());
      })
  );
  return { server, port: (server.address() as AddressInfo).port };
}

type Download = { status: number; headers: http.IncomingHttpHeaders; body: Buffer };

function download(port: number, url: string): Promise<Download> {
  return new Promise((resolve, reject) => {
    http
      .get({ host: '127.0.0.1', port, path: url, agent: false }, (res) => {
        const chunks: Buffer[] = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('error', reject);
        res.on('end', () =>
          resolve({
            status: res.statusCode as number,
            headers: res.headers,
            body: Buffer.concat(chunks),
          })
        );
      })
      .on('error', reject);
  });
}

/** Start a download and drop the connection as soon as the first body bytes arrive. */
function downloadAndDisconnect(port: number, url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const req = http.get({ host: '127.0.0.1', port, path: url, agent: false }, (res) => {
      res.once('data', () => {
        req.destroy();
        resolve();
      });
    });
    req.on('error', (err) => {
      if (!req.destroyed) {
        reject(err);
      }
    });
  });
}

/** Send a request and drop the connection once `ready` settles, before any response. */
async function requestAndDisconnect(
  port: number,
  url: string,
  ready: Promise<void>
): Promise<void> {
  const req = http.get({ host: '127.0.0.1', port, path: url, agent: false });
  req.on('error', () => {});
  await ready;
  req.destroy();
  await sleep(50);
}

type TarballReads = { streams: fs.ReadStream[] };

function trackTarballReads(): TarballReads {
  const reads: TarballReads = { streams: [] };
  const createReadStream = fs.createReadStream;
  vi.spyOn(fs, 'createReadStream').mockImplementation(((file: fs.PathLike, ...rest: any[]) => {
    const stream = (createReadStream as any)(file, ...rest);
    if (String(file).endsWith('.tgz')) {
      reads.streams.push(stream);
    }
    return stream;
  }) as typeof fs.createReadStream);
  return reads;
}

function trackTarballWrites(): string[] {
  const files: string[] = [];
  const createWriteStream = fs.createWriteStream;
  vi.spyOn(fs, 'createWriteStream').mockImplementation(((file: fs.PathLike, ...rest: any[]) => {
    if (String(file).includes('.tgz')) {
      files.push(String(file));
    }
    return (createWriteStream as any)(file, ...rest);
  }) as typeof fs.createWriteStream);
  return files;
}

const tarballUrl = (pkg: string, name = pkg.split('/').pop()): string =>
  `/${pkg}/-/${name}-1.0.0.tgz`;

/** Publish a package and swap its stored tarball for a large one. */
async function publishLargeTarball(app: Application, pkg: string, reads: TarballReads) {
  await publishVersion(app, pkg, '1.0.0').expect(HTTP_STATUS.CREATED);
  await supertest(app).get(tarballUrl(pkg)).expect(HTTP_STATUS.OK);
  const file = String(reads.streams[reads.streams.length - 1].path);
  fs.writeFileSync(file, TARBALL);
  reads.streams.length = 0;
}

async function localRegistry(packages: string[]) {
  const reads = trackTarballReads();
  const app = await initializeServer('package.yaml');
  for (const pkg of packages) {
    await publishLargeTarball(app, pkg, reads);
  }
  const { port } = await listen(app);
  return { app, port, reads };
}

type Upstream = {
  url: string;
  tarballRequests: number;
  packumentRequests: number;
  /** responses of tarball requests that closed before they were complete */
  abortedTarballs: number;
  /** when set, the tarball response stops after the first chunk and stays open */
  stall: boolean;
  sendContentLength: boolean;
  /** when set, the packument is only answered once this settles */
  packumentGate?: Promise<void>;
  onPackumentRequest?: () => void;
};

async function startUpstream(): Promise<Upstream> {
  const upstream: Upstream = {
    url: '',
    tarballRequests: 0,
    packumentRequests: 0,
    abortedTarballs: 0,
    stall: false,
    sendContentLength: true,
  };
  const { port } = await listen((req, res) => {
    const url = decodeURIComponent(req.url as string);
    if (url.endsWith('.tgz')) {
      upstream.tarballRequests++;
      res.on('close', () => {
        if (!res.writableFinished) {
          upstream.abortedTarballs++;
        }
      });
      const headers: http.OutgoingHttpHeaders = { 'content-type': 'application/octet-stream' };
      if (upstream.sendContentLength) {
        headers['content-length'] = TARBALL_SIZE;
      }
      res.writeHead(200, headers);
      if (upstream.stall) {
        res.write(TARBALL.subarray(0, FIRST_CHUNK));
      } else {
        res.end(TARBALL);
      }
      return;
    }
    upstream.packumentRequests++;
    upstream.onPackumentRequest?.();
    const pkg = url.slice(1);
    const body = JSON.stringify(generateRemotePackageMetadata(pkg, '1.0.0', upstream.url));
    const reply = (): void => {
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(body);
    };
    if (upstream.packumentGate) {
      void upstream.packumentGate.then(reply);
    } else {
      reply();
    }
  });
  upstream.url = `http://127.0.0.1:${port}`;
  return upstream;
}

async function proxyRegistry(uplinkConfig: Record<string, unknown> = {}, experiments?: unknown) {
  const upstream = await startUpstream();
  const app = await initializeServer('package.yaml', (config) => {
    config.uplinks = { upstream: { url: upstream.url, ...uplinkConfig } };
    config.packages = {
      '**': { access: '$anonymous', publish: '$anonymous', proxy: 'upstream' },
    } as any;
    if (experiments) {
      (config as any).experiments = experiments;
    }
  });
  const { port } = await listen(app);
  return { app, port, upstream };
}

function deferred(): { promise: Promise<void>; resolve: () => void } {
  let resolve!: () => void;
  const promise = new Promise<void>((done) => (resolve = done));
  return { promise, resolve };
}

describe('tarball download when the client disconnects', () => {
  describe('local tarball', () => {
    test.each(['foo', '@scope/foo'])(
      'should release the file of %s when the client disconnects mid-download',
      async (pkg) => {
        const { port, reads } = await localRegistry([pkg]);

        await downloadAndDisconnect(port, tarballUrl(pkg));

        await waitFor(() => reads.streams.length === 1, 'the tarball to be opened');
        const [file] = reads.streams;
        await waitFor(() => file.destroyed, 'the tarball file to be released');
        expect(file.bytesRead).toBeLessThan(TARBALL_SIZE);
      }
    );

    test('should release every file when many clients disconnect', async () => {
      const clients = 12;
      const { port, reads } = await localRegistry(['foo']);

      await Promise.all(
        Array.from({ length: clients }, () => downloadAndDisconnect(port, tarballUrl('foo')))
      );

      await waitFor(() => reads.streams.length === clients, 'every tarball to be opened');
      await waitFor(
        () => reads.streams.every((stream) => stream.destroyed),
        'every tarball file to be released'
      );
    });

    test('should still serve the complete tarball to a client that stays', async () => {
      const { port, reads } = await localRegistry(['foo']);

      const response = await download(port, tarballUrl('foo'));

      expect(response.status).toBe(HTTP_STATUS.OK);
      expect(response.headers[HEADER_TYPE.CONTENT_LENGTH]).toBe(String(TARBALL_SIZE));
      expect(response.body.equals(TARBALL)).toBe(true);
      await waitFor(() => reads.streams[0].destroyed, 'the tarball file to be closed');
      expect(reads.streams[0].bytesRead).toBe(TARBALL_SIZE);
    });

    test('should not disturb a concurrent download of the same tarball', async () => {
      const { port, reads } = await localRegistry(['foo']);

      const staying = download(port, tarballUrl('foo'));
      await downloadAndDisconnect(port, tarballUrl('foo'));
      const response = await staying;

      expect(response.status).toBe(HTTP_STATUS.OK);
      expect(response.body.equals(TARBALL)).toBe(true);
      await waitFor(
        () => reads.streams.length === 2 && reads.streams.every((stream) => stream.destroyed),
        'both tarball files to be released'
      );
    });

    test('should serve the tarball again after an interrupted download', async () => {
      const { port, reads } = await localRegistry(['foo']);

      await downloadAndDisconnect(port, tarballUrl('foo'));
      await waitFor(() => reads.streams[0]?.destroyed === true, 'the tarball file to be released');
      const response = await download(port, tarballUrl('foo'));

      expect(response.status).toBe(HTTP_STATUS.OK);
      expect(response.body.equals(TARBALL)).toBe(true);
    });

    test('should not open the tarball when the client leaves before the read starts', async () => {
      const { port, reads } = await localRegistry(['foo']);
      const gate = deferred();
      const requested = deferred();
      vi.spyOn(Storage.prototype as any, '_isTarballAllowedByFilters').mockImplementation(
        async () => {
          requested.resolve();
          await gate.promise;
          return true;
        }
      );

      await requestAndDisconnect(port, tarballUrl('foo'), requested.promise);
      gate.resolve();
      await sleep(200);

      expect(reads.streams).toHaveLength(0);
    });

    test('should answer 404 for a missing tarball as before', async () => {
      const { port } = await localRegistry(['foo']);

      const response = await download(port, '/foo/-/foo-9.9.9.tgz');

      expect(response.status).toBe(HTTP_STATUS.NOT_FOUND);
    });
  });

  describe('tarball served by an uplink', () => {
    test.each([
      ['with the cache enabled', {}],
      ['with the cache disabled', { cache: false }],
    ])(
      'should abort the uplink request when the client disconnects mid-download (%s)',
      async (_title, uplinkConfig) => {
        const { port, upstream } = await proxyRegistry(uplinkConfig);
        upstream.stall = true;

        await downloadAndDisconnect(port, tarballUrl('foo'));

        await waitFor(() => upstream.abortedTarballs === 1, 'the uplink request to be aborted');
        expect(upstream.tarballRequests).toBe(1);
      }
    );

    test('should abort every uplink request when many clients disconnect', async () => {
      const clients = 6;
      const { port, upstream } = await proxyRegistry({ cache: false });
      upstream.stall = true;

      await Promise.all(
        Array.from({ length: clients }, (_, index) =>
          downloadAndDisconnect(port, tarballUrl(`foo-${index}`))
        )
      );

      await waitFor(
        () => upstream.abortedTarballs === clients,
        'every uplink request to be aborted'
      );
    });

    test.each([
      ['a content-length', true],
      ['no content-length', false],
    ])(
      'should not cache a truncated tarball when the uplink sends %s',
      async (_title, sendContentLength) => {
        const writes = trackTarballWrites();
        const { port, upstream } = await proxyRegistry();
        upstream.stall = true;
        upstream.sendContentLength = sendContentLength;

        await downloadAndDisconnect(port, tarballUrl('foo'));
        await waitFor(() => upstream.abortedTarballs === 1, 'the uplink request to be aborted');

        expect(writes).toHaveLength(1);
        const [temporary] = writes;
        await waitFor(() => !fs.existsSync(temporary), 'the partial cache file to be removed');
        expect(fs.existsSync(path.join(path.dirname(temporary), 'foo-1.0.0.tgz'))).toBe(false);

        upstream.stall = false;
        const response = await download(port, tarballUrl('foo'));
        expect(response.status).toBe(HTTP_STATUS.OK);
        expect(response.body.equals(TARBALL)).toBe(true);
        expect(upstream.tarballRequests).toBe(2);
      }
    );

    test('should still cache a tarball that was downloaded completely', async () => {
      const { port, upstream } = await proxyRegistry();

      const first = await download(port, tarballUrl('foo'));
      expect(first.body.equals(TARBALL)).toBe(true);
      // the cache is committed after the response ends
      await sleep(300);
      const second = await download(port, tarballUrl('foo'));

      expect(second.status).toBe(HTTP_STATUS.OK);
      expect(second.body.equals(TARBALL)).toBe(true);
      expect(upstream.tarballRequests).toBe(1);
    });

    test('should keep the uplink usable after several interrupted downloads', async () => {
      const { port, upstream } = await proxyRegistry({ max_fails: 1, fail_timeout: '10m' });
      upstream.stall = true;
      for (const name of ['one', 'two', 'three']) {
        await downloadAndDisconnect(port, tarballUrl(name));
      }
      await waitFor(() => upstream.abortedTarballs === 3, 'the uplink requests to be aborted');

      upstream.stall = false;
      const response = await download(port, tarballUrl('four'));

      expect(response.status).toBe(HTTP_STATUS.OK);
      expect(response.body.equals(TARBALL)).toBe(true);
    });

    test('should not request the tarball when the client leaves during the metadata lookup', async () => {
      const { port, upstream } = await proxyRegistry();
      const gate = deferred();
      const requested = deferred();
      upstream.packumentGate = gate.promise;
      upstream.onPackumentRequest = requested.resolve;

      await requestAndDisconnect(port, tarballUrl('foo'), requested.promise);
      gate.resolve();
      await sleep(300);

      expect(upstream.packumentRequests).toBeGreaterThan(0);
      expect(upstream.tarballRequests).toBe(0);
    });

    test('should not request the tarball when the client leaves before a redirect is decided', async () => {
      const { port, upstream } = await proxyRegistry(
        {},
        { tarball_url_redirect: 'https://cdn.example.test/${packageName}/${filename}' }
      );
      const gate = deferred();
      const requested = deferred();
      vi.spyOn(Storage.prototype, 'hasLocalTarball').mockImplementation(async () => {
        requested.resolve();
        await gate.promise;
        return false;
      });

      await requestAndDisconnect(port, tarballUrl('foo'), requested.promise);
      gate.resolve();
      await sleep(300);

      expect(upstream.tarballRequests).toBe(0);
    });

    test('should still proxy the complete tarball to a client that stays', async () => {
      const { port, upstream } = await proxyRegistry({ cache: false });

      const response = await download(port, tarballUrl('foo'));

      expect(response.status).toBe(HTTP_STATUS.OK);
      expect(response.headers[HEADER_TYPE.CONTENT_LENGTH]).toBe(String(TARBALL_SIZE));
      expect(response.body.equals(TARBALL)).toBe(true);
      expect(upstream.abortedTarballs).toBe(0);
    });
  });
});
