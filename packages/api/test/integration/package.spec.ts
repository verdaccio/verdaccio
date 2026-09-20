import { PassThrough } from 'node:stream';
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
        // buffered until the route pipes the stream into the response, which
        // flushes the 200 + headers; then the source dies mid-body
        stream.push(Buffer.alloc(1024));
        setTimeout(() => stream.destroy(new Error('uplink connection dropped')), 100);
        await expect(supertest(app).get('/foo/-/foo-1.0.0.tgz')).rejects.toThrow(
          /aborted|socket hang up|ECONNRESET/i
        );
      } finally {
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
        setTimeout(() => {
          stream.emit('content-length', 2048);
          stream.push(Buffer.alloc(1024));
          stream.end();
        }, 100);
        const response = await supertest(app).get('/foo/-/foo-1.0.0.tgz').expect(HTTP_STATUS.OK);
        expect(Buffer.from(response.body).length).toEqual(2048);
        expect(response.headers[HEADER_TYPE.CONTENT_LENGTH]).toBeUndefined();
      } finally {
        spy.mockRestore();
      }
    });
  });

  describe('get package', () => {
    let app;
    beforeEach(async () => {
      app = await initializeServer('package.yaml');
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
