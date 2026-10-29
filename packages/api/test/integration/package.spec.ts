import fs from 'node:fs';
import { PassThrough } from 'node:stream';
import { finished } from 'node:stream/promises';
import supertest from 'supertest';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { createRemoteUser } from '@verdaccio/config';
import { DIST_TAGS, HEADERS, HEADER_TYPE, HTTP_STATUS, TOKEN_BEARER } from '@verdaccio/core';
import { Storage } from '@verdaccio/store';

import {
  buildToken,
  initializeServer,
  initializeServerWithContext,
  publishVersion,
} from './_helper';

// Keep the complete tarball path on the current sources, including failure handling.
vi.mock('@verdaccio/store', () => import('../../../store/src'));
vi.mock('@verdaccio/local-storage', () => import('../../../plugins/local-storage/src'));

describe('package', () => {
  describe('get tarball', () => {
    let app;
    beforeEach(async () => {
      app = await initializeServer('package.yaml');
    });

    test.each([
      ['foo', 'foo', 'foo-1.0.0.tgz'],
      ['@scope/foo', '@scope/foo', 'foo-1.0.0.tgz'],
      ['@scope/foo', encodeURIComponent('@scope/foo'), 'foo-1.0.0.tgz'],
    ])('should return a file tarball', async (pkg, path, fileName) => {
      await publishVersion(app, pkg, '1.0.0');
      const response = await supertest(app)
        .get(`/${path}/-/${fileName}`)
        .set(HEADERS.ACCEPT, HEADERS.JSON)
        .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.OCTET_STREAM)
        .expect(HTTP_STATUS.OK);
      expect(Buffer.from(response.body).toString('utf8')).toBeDefined();
    });

    test.each([
      ['foo2', 'foo2', 'foo2-1.0.0.tgz'],
      ['@scope/foo2', '@scope/foo2', 'foo2-1.0.0.tgz'],
      ['@scope/foo2', encodeURIComponent('@scope/foo2'), 'foo2-1.0.0.tgz'],
    ])('should fails if tarball does not exist', async (pkg, path, fileName) => {
      await publishVersion(app, pkg, '1.0.1');
      // the error body is JSON, matching registry.npmjs.org
      await supertest(app)
        .get(`/${path}/-/${fileName}`)
        .set(HEADERS.ACCEPT, HEADERS.JSON)
        .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
        .expect(HTTP_STATUS.NOT_FOUND);
    });

    test('should return a content-length header for the tarball', async () => {
      await publishVersion(app, 'foo-length', '1.0.0');
      const response = await supertest(app)
        .get('/foo-length/-/foo-length-1.0.0.tgz')
        .set(HEADERS.ACCEPT, HEADERS.JSON)
        .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.OCTET_STREAM)
        .expect(HTTP_STATUS.OK);
      const contentLength = parseInt(response.headers[HEADER_TYPE.CONTENT_LENGTH], 10);
      expect(Number.isNaN(contentLength)).toBe(false);
      expect(contentLength).toBeGreaterThan(0);
      expect(contentLength).toEqual(Buffer.from(response.body).length);
    });
    test.todo('fails on file was aborted');

    test('should terminate the connection when the stream fails mid-download', async () => {
      // simulates an uplink dropping the connection halfway through a tarball:
      // headers (200) are already sent, so the only correct signal left is
      // closing the connection — the client must not be left hanging.
      const stream = new PassThrough();
      const spy = vi.spyOn(Storage.prototype, 'getTarball').mockResolvedValue(stream as any);
      try {
        stream.push(Buffer.alloc(1024));
        // Fail only once the client has received body data, proving that the
        // response headers have already been sent.
        const request = supertest(app)
          .get('/foo/-/foo-1.0.0.tgz')
          .timeout({ deadline: 3000 })
          .buffer(true)
          .parse((response, callback) => {
            response.once('data', () => stream.destroy(new Error('uplink connection dropped')));
            response.once('error', callback);
            response.once('end', () => callback(null, Buffer.alloc(0)));
          });
        await expect(request).rejects.toThrow(/aborted|socket hang up|ECONNRESET/i);
      } finally {
        stream.destroy();
        spy.mockRestore();
      }
    });

    test('should ignore a content-length event arriving after headers are sent', async () => {
      // the size comes from an async fstat racing the first data chunk; when
      // it loses, setting the header must be skipped instead of crashing
      const stream = new PassThrough();
      const spy = vi.spyOn(Storage.prototype, 'getTarball').mockResolvedValue(stream as any);
      try {
        stream.push(Buffer.alloc(1024));
        const response = await supertest(app)
          .get('/foo/-/foo-1.0.0.tgz')
          .timeout({ deadline: 3000 })
          .buffer(true)
          .parse((response, callback) => {
            const chunks: Buffer[] = [];
            response.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
            // Receiving the first body chunk guarantees that setting another
            // header is too late, regardless of machine or filesystem speed.
            response.once('data', () => {
              stream.emit('content-length', 2048);
              stream.end(Buffer.alloc(1024));
            });
            response.once('error', callback);
            response.once('end', () => callback(null, Buffer.concat(chunks)));
          })
          .expect(HTTP_STATUS.OK);
        expect(Buffer.from(response.body).length).toEqual(2048);
        expect(response.headers[HEADER_TYPE.CONTENT_LENGTH]).toBeUndefined();
      } finally {
        stream.destroy();
        spy.mockRestore();
      }
    });

    test.each(['before-data', 'during-read', 'premature-close'] as const)(
      'propagates a local filesystem read failure (%s) without leaving HTTP hanging',
      async (failure) => {
        await publishVersion(app, 'read-failure', '1.0.0');
        const url = '/read-failure/-/read-failure-1.0.0.tgz';
        const readError = Object.assign(new Error('tarball disk read failed'), { code: 'EIO' });
        const createReadStream = fs.createReadStream;
        const received = Promise.withResolvers<Buffer>();
        const reading = Promise.withResolvers<void>();
        let source: fs.ReadStream | undefined;
        let sourceDone: Promise<unknown> | undefined;
        let releaseRead = () => {};
        let firstRead = true;
        let responseStatus: number | undefined;

        // Exercise the real API -> Store pipeline -> LocalFS stream. Inject
        // the fault only at the filesystem boundary, retaining a real descriptor.
        const spy = vi.spyOn(fs, 'createReadStream').mockImplementationOnce((filename, options) => {
          source = createReadStream(filename, {
            ...(typeof options === 'object' ? options : {}),
            highWaterMark: 64,
            fs: {
              open: fs.open,
              close: fs.close,
              read(fd, buffer, offset, length, position, callback) {
                if (failure === 'before-data') {
                  callback(readError, 0, buffer);
                  return;
                }
                if (firstRead) {
                  firstRead = false;
                  fs.read(fd, buffer, offset, length, position, callback);
                  return;
                }
                releaseRead = () => {
                  releaseRead = () => {};
                  if (failure === 'premature-close') {
                    source!.destroy();
                    callback(null, 0, buffer);
                  } else {
                    callback(readError, 0, buffer);
                  }
                };
                reading.resolve();
              },
            },
          });
          sourceDone = finished(source, { cleanup: true }).catch((error) => error);
          return source;
        });

        const request = supertest(app).get(url).timeout({ deadline: 3000 });
        if (failure !== 'before-data') {
          request.buffer(true).parse((response, callback) => {
            responseStatus = response.statusCode;
            response.once('data', (chunk) => received.resolve(Buffer.from(chunk)));
            response.once('error', callback);
            response.once('end', () => callback(null, Buffer.alloc(0)));
          });
        }
        const outcome = request.then(
          (response) => ({ response, error: undefined }),
          (error: Error) => ({ response: undefined, error })
        );
        try {
          if (failure === 'before-data') {
            const result = await outcome;
            expect(result.error).toBeUndefined();
            expect(result.response?.status).toBe(HTTP_STATUS.INTERNAL_ERROR);
            expect(result.response?.headers[HEADER_TYPE.CONTENT_TYPE]).toBe(HEADERS.JSON_CHARSET);
            expect(result.response?.body.error).toBeTruthy();
          } else {
            const [firstChunk] = await Promise.race([
              Promise.all([received.promise, reading.promise]),
              outcome.then(({ error }) => {
                throw error ?? new Error('download ended before the injected read failure');
              }),
            ]);
            expect(firstChunk.length).toBe(64);
            expect(responseStatus).toBe(HTTP_STATUS.OK);
            releaseRead();
            const result = await outcome;
            expect(result.response).toBeUndefined();
            expect(result.error?.message).toMatch(/aborted|socket hang up|ECONNRESET/i);
          }
          await sourceDone;
          expect(source?.closed).toBe(true);
          // A failed read must leave the registry usable and the original file intact.
          const retry = await supertest(app)
            .get(url)
            .timeout({ deadline: 3000 })
            .expect(HTTP_STATUS.OK);
          expect(retry.body.length).toBe(512);
          expect(Number(retry.headers[HEADER_TYPE.CONTENT_LENGTH])).toBe(retry.body.length);
        } finally {
          request.abort();
          source?.destroy();
          releaseRead();
          await Promise.all([sourceDone, outcome]);
          spy.mockRestore();
        }
      }
    );
  });

  describe('get package', () => {
    let app;
    beforeEach(async () => {
      app = await initializeServer('package.yaml');
    });

    test.each(['foo', '@scope/foo'])('should resolve versions and tags for %s', async (pkg) => {
      await publishVersion(app, pkg, '1.0.0');
      for (const query of ['1.0.0', 'latest']) {
        const response = await supertest(app).get(`/${pkg}/${query}`).expect(HTTP_STATUS.OK);
        expect(response.body.version).toBe('1.0.0');
      }
    });

    test.each(['constructor', 'toString', 'hasOwnProperty', 'nope'])(
      'should return 404 for missing version or tag %s',
      async (query) => {
        await publishVersion(app, 'foo', '1.0.0');
        await supertest(app).get(`/foo/${query}`).expect(HTTP_STATUS.NOT_FOUND);
      }
    );

    test.each(['constructor', 'toString', 'hasOwnProperty'])(
      'should resolve an explicitly stored tag %s',
      async (tag) => {
        await publishVersion(app, 'foo', '1.0.0');
        await supertest(app)
          .put(`/-/package/foo/dist-tags/${tag}`)
          .set(HEADERS.CONTENT_TYPE, HEADERS.JSON)
          .send(JSON.stringify('1.0.0'))
          .expect(HTTP_STATUS.CREATED);
        const response = await supertest(app).get(`/foo/${tag}`).expect(HTTP_STATUS.OK);
        expect(response.body.version).toBe('1.0.0');
      }
    );

    test('should keep rejecting an invalid version name', async () => {
      await publishVersion(app, 'foo', '1.0.0');
      await supertest(app).get('/foo/__proto__').expect(HTTP_STATUS.BAD_REQUEST);
    });

    test.each([
      ['foo', 'foo'],
      ['@scope/foo', '@scope/foo'],
      ['@scope/foo', encodeURIComponent('@scope/foo')],
    ])('should return a private package', async (pkg, path) => {
      await publishVersion(app, pkg, '1.0.0');
      const response = await supertest(app)
        .get(`/${path}`)
        .set(HEADERS.ACCEPT, HEADERS.JSON)
        .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
        .expect(HTTP_STATUS.OK);
      expect(response.body.name).toEqual(pkg);
    });

    test.each(['foo-access', '@scope/foo-access'])(
      'should return the stored manifest.access for %s',
      async (pkg) => {
        const { app, storage } = await initializeServerWithContext('package.yaml');
        await publishVersion(app, pkg, '1.0.0').expect(HTTP_STATUS.CREATED);
        const packageStorage = storage.localStorage.getStoragePlugin().getPackageStorage(pkg);
        const manifest = await packageStorage.readPackage(pkg);
        manifest.access = 'public';
        await packageStorage.savePackage(pkg, manifest);

        const response = await supertest(app)
          .get(`/${encodeURIComponent(pkg)}`)
          .set(HEADERS.ACCEPT, HEADERS.JSON)
          .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
          .expect(HTTP_STATUS.OK);

        expect(response.body.access).toBe(manifest.access);

        const abbreviatedResponse = await supertest(app)
          .get(`/${encodeURIComponent(pkg)}`)
          .set(HEADERS.ACCEPT, Storage.ABBREVIATED_HEADER)
          .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_INSTALL_CHARSET)
          .expect(HTTP_STATUS.OK);

        expect(abbreviatedResponse.body).not.toHaveProperty('access');
      }
    );

    test('should authorize protected package routes with a web bearer token (#5765)', async () => {
      const { app, auth } = await initializeServerWithContext('package-web-token.yaml');
      const token = await auth.jwtEncrypt(createRemoteUser('web-user', []), {});

      await publishVersion(app, 'foo', '1.0.0');

      await supertest(app)
        .get('/foo')
        .set(HEADERS.ACCEPT, HEADERS.JSON)
        .expect(HTTP_STATUS.UNAUTHORIZED);

      const manifestResponse = await supertest(app)
        .get('/foo')
        .set(HEADERS.ACCEPT, HEADERS.JSON)
        .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, token))
        .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
        .expect(HTTP_STATUS.OK);
      expect(manifestResponse.body.name).toEqual('foo');

      const tarballResponse = await supertest(app)
        .get('/foo/-/foo-1.0.0.tgz')
        .set(HEADERS.ACCEPT, HEADERS.JSON)
        .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, token))
        .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.OCTET_STREAM)
        .expect(HTTP_STATUS.OK);
      expect(Buffer.from(tarballResponse.body).toString('utf8')).toBeDefined();
    });

    test.each([
      ['foo-abbreviated', 'foo-abbreviated'],
      ['@scope/foo-abbreviated', '@scope/foo-abbreviated'],
      ['@scope/foo-abbreviated', encodeURIComponent('@scope/foo-abbreviated')],
    ])('should return abbreviated local manifest', async (pkg, path) => {
      await publishVersion(app, pkg, '1.0.0');
      const response = await supertest(app)
        .get(`/${path}`)
        .set(HEADERS.ACCEPT, HEADERS.JSON)
        .set(HEADERS.ACCEPT, Storage.ABBREVIATED_HEADER)
        .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_INSTALL_CHARSET)
        .expect(HTTP_STATUS.OK);
      expect(response.body.name).toEqual(pkg);
      expect(response.body.time).toBeDefined();
      expect(response.body.modified).toBeDefined();
      expect(response.body[DIST_TAGS]).toEqual({ latest: '1.0.0' });
      // the abbreviated (install-v1) format excludes the readme and internal
      // CouchDB fields to keep install metadata small
      expect(response.body.readme).not.toBeDefined();
      expect(response.body._rev).not.toBeDefined();
      expect(response.body._id).not.toBeDefined();
      expect(response.body.users).not.toBeDefined();
    });
  });
});
