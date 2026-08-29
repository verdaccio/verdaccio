import supertest from 'supertest';
import { beforeAll, describe, expect, test } from 'vitest';

import { HEADERS, HEADER_TYPE, HTTP_STATUS, TOKEN_BEARER } from '@verdaccio/core';
import { setup } from '@verdaccio/logger';
import { generatePackageMetadata } from '@verdaccio/test-helper';

import {
  buildToken,
  getNewToken,
  initializeServer,
  publishVersion,
  publishVersionWithToken,
} from './_helper';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const A_UUID = '8f6d5b3c-1a2e-4f7b-9c0d-1e2f3a4b5c6d';
/** 404 from the GET catch-all, 590 from the test server's unmatched-request handler. */
const UNMATCHED_STATUSES = [HTTP_STATUS.NOT_FOUND, 590];

const credentials = { name: 'jota_stage', password: 'secretPass' };

beforeAll(async () => {
  await setup({ type: 'stdout', format: 'pretty', level: 'fatal' });
});

async function buildApp(config = 'stage.yaml') {
  const app = await initializeServer(config);
  // every server gets its own htpasswd file, so fixed usernames are safe and
  // let the config grant `restricted-*` to `owner` only
  const token = await getNewToken(app, { name: 'owner', password: credentials.password });
  return { app, token };
}

function stageVersion(app: any, pkgName: string, version: string, token: string, distTags?: any) {
  return supertest(app)
    .post(`/-/stage/package/${encodeURIComponent(pkgName)}`)
    .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
    .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, token))
    .send(JSON.stringify(generatePackageMetadata(pkgName, version, distTags)));
}

function authed(request: supertest.Test, token: string) {
  return request.set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, token));
}

describe('stage', () => {
  describe('flag disabled', () => {
    test('should not register any stage route', async () => {
      const { app, token } = await buildApp('stage-disabled.yaml');

      await authed(supertest(app).get('/-/stage'), token).expect(HTTP_STATUS.NOT_FOUND);
      await authed(supertest(app).get(`/-/stage/${A_UUID}`), token).expect(HTTP_STATUS.NOT_FOUND);
      await authed(supertest(app).get(`/-/stage/${A_UUID}/tarball`), token).expect(
        HTTP_STATUS.NOT_FOUND
      );

      // the test server only installs a catch-all 404 for GET, so an unmatched
      // POST/DELETE falls through to its 590 handler instead. Either way no
      // stage route claimed the request, which is what this asserts.
      const approve = await authed(supertest(app).post(`/-/stage/${A_UUID}/approve`), token);
      expect(UNMATCHED_STATUSES).toContain(approve.status);

      const reject = await authed(supertest(app).delete(`/-/stage/${A_UUID}`), token);
      expect(UNMATCHED_STATUSES).toContain(reject.status);

      const staged = await stageVersion(app, 'foo-off', '1.0.0', token);
      expect(UNMATCHED_STATUSES).toContain(staged.status);
    });

    test('should not resolve GET /-/stage as a package manifest', async () => {
      const { app, token } = await buildApp('stage-disabled.yaml');

      const response = await authed(supertest(app).get('/-/stage'), token);

      expect(response.status).toBe(HTTP_STATUS.NOT_FOUND);
      expect(response.body).not.toHaveProperty('versions');
    });
  });

  describe('stage a version', () => {
    test('should answer 201 with a uuid stage id', async () => {
      const { app, token } = await buildApp();

      const response = await stageVersion(app, 'foo-stage', '1.0.0', token).expect(
        HTTP_STATUS.CREATED
      );

      // the npm CLI validates the id format before calling view/approve/reject
      expect(response.body.stageId).toMatch(UUID_PATTERN);
      expect(response.body.message).toBe('Package version staged successfully.');
    });

    test('should not make the version installable', async () => {
      const { app, token } = await buildApp();
      await stageVersion(app, 'foo-hidden', '1.0.0', token).expect(HTTP_STATUS.CREATED);

      await authed(supertest(app).get('/foo-hidden'), token).expect(HTTP_STATUS.NOT_FOUND);
    });

    test('should reject an anonymous request', async () => {
      const app = await initializeServer('stage.yaml');

      await supertest(app)
        .post('/-/stage/package/foo-anon')
        .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
        .send(JSON.stringify(generatePackageMetadata('foo-anon', '1.0.0')))
        .expect(HTTP_STATUS.UNAUTHORIZED);
    });

    test('should reject a payload that is not a single version publish', async () => {
      const { app, token } = await buildApp();

      await supertest(app)
        .post('/-/stage/package/foo-bad')
        .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
        .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, token))
        .send(JSON.stringify({ name: 'foo-bad' }))
        .expect(HTTP_STATUS.BAD_REQUEST);
    });

    test('should answer 409 when the version is already published', async () => {
      const { app, token } = await buildApp();
      await publishVersionWithToken(app, 'foo-published', '1.0.0', token).expect(
        HTTP_STATUS.CREATED
      );

      await stageVersion(app, 'foo-published', '1.0.0', token).expect(HTTP_STATUS.CONFLICT);
    });

    test('should answer 409 when the same version is staged twice', async () => {
      const { app, token } = await buildApp();
      await stageVersion(app, 'foo-twice', '1.0.0', token).expect(HTTP_STATUS.CREATED);

      await stageVersion(app, 'foo-twice', '1.0.0', token).expect(HTTP_STATUS.CONFLICT);
    });

    test('should stage a scoped package', async () => {
      const { app, token } = await buildApp();

      const response = await stageVersion(app, '@scope/foo', '1.0.0', token).expect(
        HTTP_STATUS.CREATED
      );

      const item = await authed(
        supertest(app).get(`/-/stage/${response.body.stageId}`),
        token
      ).expect(HTTP_STATUS.OK);
      expect(item.body.packageName).toBe('@scope/foo');
    });
  });

  describe('list', () => {
    test('should list the staged versions newest first', async () => {
      const { app, token } = await buildApp();
      await stageVersion(app, 'foo-list', '1.0.0', token).expect(HTTP_STATUS.CREATED);
      await stageVersion(app, 'foo-list', '2.0.0', token).expect(HTTP_STATUS.CREATED);

      const response = await authed(supertest(app).get('/-/stage'), token).expect(HTTP_STATUS.OK);

      expect(response.body.total).toBe(2);
      expect(response.body.items.map((item: any) => item.version)).toEqual(['2.0.0', '1.0.0']);
      expect(response.body.items[0]).not.toHaveProperty('tarballFilename');
    });

    test('should filter by package name', async () => {
      const { app, token } = await buildApp();
      await stageVersion(app, 'foo-a', '1.0.0', token).expect(HTTP_STATUS.CREATED);
      await stageVersion(app, 'foo-b', '1.0.0', token).expect(HTTP_STATUS.CREATED);

      const response = await authed(
        supertest(app).get('/-/stage').query({ package: 'foo-b' }),
        token
      ).expect(HTTP_STATUS.OK);

      expect(response.body.total).toBe(1);
      expect(response.body.items[0].packageName).toBe('foo-b');
    });

    test('should paginate without repeating or losing items', async () => {
      const { app, token } = await buildApp();
      for (const version of ['1.0.0', '2.0.0', '3.0.0', '4.0.0', '5.0.0']) {
        await stageVersion(app, 'foo-page', version, token).expect(HTTP_STATUS.CREATED);
      }

      const seen: string[] = [];
      let page = 0;
      // mirrors how `npm stage list` walks the pages
      while (true) {
        const response = await authed(
          supertest(app).get('/-/stage').query({ page, perPage: 2 }),
          token
        ).expect(HTTP_STATUS.OK);
        seen.push(...response.body.items.map((item: any) => item.version));
        expect(response.body.total).toBe(5);
        if (seen.length >= response.body.total || response.body.items.length < 2) {
          break;
        }
        page++;
      }

      expect(seen).toHaveLength(5);
      expect(new Set(seen).size).toBe(5);
    });

    test('should cap perPage at 100', async () => {
      const { app, token } = await buildApp();

      const response = await authed(
        supertest(app).get('/-/stage').query({ perPage: 5000 }),
        token
      ).expect(HTTP_STATUS.OK);

      expect(response.body.perPage).toBe(100);
    });

    test('should hide items the caller can neither publish nor has staged', async () => {
      const { app, token } = await buildApp();
      await stageVersion(app, 'restricted-pkg', '1.0.0', token).expect(HTTP_STATUS.CREATED);
      const otherToken = await getNewToken(app, { name: 'intruder', password: 'secretPass' });

      const response = await authed(supertest(app).get('/-/stage'), otherToken).expect(
        HTTP_STATUS.OK
      );

      // `restricted-*` may only be published by `owner`
      expect(response.body.total).toBe(0);
      expect(response.body.items).toEqual([]);
    });

    test('should list items the caller staged themselves', async () => {
      const { app, token } = await buildApp();
      await stageVersion(app, 'restricted-pkg', '1.0.0', token).expect(HTTP_STATUS.CREATED);

      const response = await authed(supertest(app).get('/-/stage'), token).expect(HTTP_STATUS.OK);

      expect(response.body.total).toBe(1);
    });

    test('should reject an anonymous request', async () => {
      const app = await initializeServer('stage.yaml');

      await supertest(app).get('/-/stage').expect(HTTP_STATUS.UNAUTHORIZED);
    });
  });

  describe('view', () => {
    test('should return the staged item', async () => {
      const { app, token } = await buildApp();
      const staged = await stageVersion(app, 'foo-view', '1.0.0', token, { next: '1.0.0' });

      const response = await authed(
        supertest(app).get(`/-/stage/${staged.body.stageId}`),
        token
      ).expect(HTTP_STATUS.OK);

      expect(response.body).toMatchObject({
        id: staged.body.stageId,
        packageName: 'foo-view',
        version: '1.0.0',
        tag: 'next',
        actorType: 'user',
        access: 'public',
      });
      expect(response.body.shasum).toEqual(expect.any(String));
      expect(response.body.createdAt).toEqual(expect.any(String));
    });

    test('should answer 404 for an unknown id', async () => {
      const { app, token } = await buildApp();

      await authed(supertest(app).get(`/-/stage/${A_UUID}`), token).expect(HTTP_STATUS.NOT_FOUND);
    });

    test('should answer 404, not 403, for an item the caller may not see', async () => {
      const { app, token } = await buildApp();
      const staged = await stageVersion(app, 'restricted-pkg', '1.0.0', token);
      const otherToken = await getNewToken(app, { name: 'intruder', password: 'secretPass' });

      // 403 would confirm the id exists to someone not allowed to know
      await authed(supertest(app).get(`/-/stage/${staged.body.stageId}`), otherToken).expect(
        HTTP_STATUS.NOT_FOUND
      );
    });

    test('should not let a foreign caller approve or reject an item', async () => {
      const { app, token } = await buildApp();
      const staged = await stageVersion(app, 'restricted-pkg', '1.0.0', token);
      const otherToken = await getNewToken(app, { name: 'intruder', password: 'secretPass' });

      await authed(
        supertest(app).post(`/-/stage/${staged.body.stageId}/approve`),
        otherToken
      ).expect(HTTP_STATUS.NOT_FOUND);
      await authed(supertest(app).delete(`/-/stage/${staged.body.stageId}`), otherToken).expect(
        HTTP_STATUS.NOT_FOUND
      );

      // and the item survived both attempts
      await authed(supertest(app).get(`/-/stage/${staged.body.stageId}`), token).expect(
        HTTP_STATUS.OK
      );
    });

    test('should answer 404 for an id that is not a uuid', async () => {
      const { app, token } = await buildApp();

      await authed(supertest(app).get('/-/stage/not-a-uuid'), token).expect(HTTP_STATUS.NOT_FOUND);
    });
  });

  describe('tarball', () => {
    test('should serve the staged tarball as an octet stream', async () => {
      const { app, token } = await buildApp();
      const staged = await stageVersion(app, 'foo-tarball', '1.0.0', token);

      const response = await authed(
        supertest(app).get(`/-/stage/${staged.body.stageId}/tarball`),
        token
      ).expect(HTTP_STATUS.OK);

      expect(response.headers['content-type']).toContain('application/octet-stream');
      expect(response.body.length).toBeGreaterThan(0);
    });

    test('should answer 404 for an unknown id', async () => {
      const { app, token } = await buildApp();

      await authed(supertest(app).get(`/-/stage/${A_UUID}/tarball`), token).expect(
        HTTP_STATUS.NOT_FOUND
      );
    });
  });

  describe('approve', () => {
    test('should publish the version and drop the staged item', async () => {
      const { app, token } = await buildApp();
      const staged = await stageVersion(app, 'foo-approve', '1.0.0', token);

      await authed(supertest(app).post(`/-/stage/${staged.body.stageId}/approve`), token).expect(
        HTTP_STATUS.CREATED
      );

      // the version is installable now
      const manifest = await authed(supertest(app).get('/foo-approve'), token).expect(
        HTTP_STATUS.OK
      );
      expect(manifest.body.versions['1.0.0']).toBeDefined();
      expect(manifest.body['dist-tags'].latest).toBe('1.0.0');

      // and the staged copy is gone
      await authed(supertest(app).get(`/-/stage/${staged.body.stageId}`), token).expect(
        HTTP_STATUS.NOT_FOUND
      );
      const list = await authed(supertest(app).get('/-/stage'), token).expect(HTTP_STATUS.OK);
      expect(list.body.total).toBe(0);
    });

    test('should serve the approved tarball', async () => {
      const { app, token } = await buildApp();
      const staged = await stageVersion(app, 'foo-approve-tgz', '1.0.0', token);
      await authed(supertest(app).post(`/-/stage/${staged.body.stageId}/approve`), token).expect(
        HTTP_STATUS.CREATED
      );

      await authed(
        supertest(app).get('/foo-approve-tgz/-/foo-approve-tgz-1.0.0.tgz'),
        token
      ).expect(HTTP_STATUS.OK);
    });

    test('should keep the staged item when the version got published meanwhile', async () => {
      const { app, token } = await buildApp();
      const staged = await stageVersion(app, 'foo-raced', '1.0.0', token);
      await publishVersionWithToken(app, 'foo-raced', '1.0.0', token).expect(HTTP_STATUS.CREATED);

      await authed(supertest(app).post(`/-/stage/${staged.body.stageId}/approve`), token).expect(
        HTTP_STATUS.CONFLICT
      );

      // still there, so a maintainer can inspect and reject it
      await authed(supertest(app).get(`/-/stage/${staged.body.stageId}`), token).expect(
        HTTP_STATUS.OK
      );
    });

    test('should answer 404 for an unknown id', async () => {
      const { app, token } = await buildApp();

      await authed(supertest(app).post(`/-/stage/${A_UUID}/approve`), token).expect(
        HTTP_STATUS.NOT_FOUND
      );
    });

    test('should reject an anonymous request', async () => {
      const app = await initializeServer('stage.yaml');

      await supertest(app).post(`/-/stage/${A_UUID}/approve`).expect(HTTP_STATUS.UNAUTHORIZED);
    });
  });

  describe('reject', () => {
    test('should answer 204 with no body and drop the item', async () => {
      const { app, token } = await buildApp();
      const staged = await stageVersion(app, 'foo-reject', '1.0.0', token);

      const response = await authed(
        supertest(app).delete(`/-/stage/${staged.body.stageId}`),
        token
      ).expect(HTTP_STATUS.NO_CONTENT);
      // `npm stage reject` sends ignoreBody: true
      expect(response.text).toBeFalsy();

      await authed(supertest(app).get(`/-/stage/${staged.body.stageId}`), token).expect(
        HTTP_STATUS.NOT_FOUND
      );
    });

    test('should not publish the rejected version', async () => {
      const { app, token } = await buildApp();
      const staged = await stageVersion(app, 'foo-rejected', '1.0.0', token);
      await authed(supertest(app).delete(`/-/stage/${staged.body.stageId}`), token).expect(
        HTTP_STATUS.NO_CONTENT
      );

      await authed(supertest(app).get('/foo-rejected'), token).expect(HTTP_STATUS.NOT_FOUND);
    });

    test('should free the version so it can be staged again', async () => {
      const { app, token } = await buildApp();
      const staged = await stageVersion(app, 'foo-restage', '1.0.0', token);
      await authed(supertest(app).delete(`/-/stage/${staged.body.stageId}`), token).expect(
        HTTP_STATUS.NO_CONTENT
      );

      await stageVersion(app, 'foo-restage', '1.0.0', token).expect(HTTP_STATUS.CREATED);
    });

    test('should answer 404 for an unknown id', async () => {
      const { app, token } = await buildApp();

      await authed(supertest(app).delete(`/-/stage/${A_UUID}`), token).expect(
        HTTP_STATUS.NOT_FOUND
      );
    });
  });

  describe('the stage permission', () => {
    // `stage` falls back to `publish` when unset, so every existing
    // configuration keeps working; setting it to a narrower group is what
    // separates proposing a release from making one.
    const asUser = async (name: string) => {
      const app = await initializeServer('stage-split.yaml');
      const token = await getNewToken(app, { name, password: credentials.password });
      return { app, token };
    };

    test('should let publishers stage when stage is not configured', async () => {
      const { app, token } = await buildApp();

      // '**' in stage.yaml sets publish but never stage
      await stageVersion(app, 'fallback-pkg', '1.0.0', token).expect(HTTP_STATUS.CREATED);
    });

    test('should let a stager submit a package they cannot publish', async () => {
      const { app, token } = await asUser('developer');

      await stageVersion(app, 'gated-pkg', '1.0.0', token).expect(HTTP_STATUS.CREATED);
      // the point of the split: they may propose, not publish
      await publishVersionWithToken(app, 'gated-pkg', '2.0.0', token).expect(HTTP_STATUS.FORBIDDEN);
    });

    test('should refuse to stage a package the user may only publish elsewhere', async () => {
      const { app, token } = await asUser('reviewer');

      // 'reviewer' holds publish on gated-*, but stage is granted to developer
      await stageVersion(app, 'gated-pkg', '1.0.0', token).expect(HTTP_STATUS.FORBIDDEN);
    });

    test('should let the reviewer approve what a stager submitted', async () => {
      const app = await initializeServer('stage-split.yaml');
      const devToken = await getNewToken(app, {
        name: 'developer',
        password: credentials.password,
      });
      const reviewerToken = await getNewToken(app, {
        name: 'reviewer',
        password: credentials.password,
      });

      const staged = await stageVersion(app, 'gated-pkg', '1.0.0', devToken).expect(
        HTTP_STATUS.CREATED
      );

      await authed(
        supertest(app).post(`/-/stage/${staged.body.stageId}/approve`),
        reviewerToken
      ).expect(HTTP_STATUS.CREATED);

      await authed(supertest(app).get('/gated-pkg'), reviewerToken).expect(HTTP_STATUS.OK);
    });

    test('should not let a stager approve their own submission', async () => {
      const { app, token } = await asUser('developer');
      const staged = await stageVersion(app, 'gated-pkg', '1.0.0', token).expect(
        HTTP_STATUS.CREATED
      );

      // this is the whole reason the permission exists
      await authed(supertest(app).post(`/-/stage/${staged.body.stageId}/approve`), token).expect(
        HTTP_STATUS.FORBIDDEN
      );
    });

    test('should let a stager withdraw their own submission', async () => {
      const { app, token } = await asUser('developer');
      const staged = await stageVersion(app, 'gated-pkg', '1.0.0', token).expect(
        HTTP_STATUS.CREATED
      );

      // withdrawing your own proposal is not the same as rejecting someone else's
      await authed(supertest(app).delete(`/-/stage/${staged.body.stageId}`), token).expect(
        HTTP_STATUS.NO_CONTENT
      );
    });
  });

  describe('isolation from the regular registry', () => {
    test('should not leak the stage namespace into the package list', async () => {
      const { app, token } = await buildApp();
      await stageVersion(app, 'foo-leak', '1.0.0', token).expect(HTTP_STATUS.CREATED);
      await publishVersion(app, 'foo-visible', '1.0.0', undefined, token).expect(
        HTTP_STATUS.CREATED
      );

      const response = await authed(supertest(app).get('/-/all'), token);
      const body = JSON.stringify(response.body);
      expect(body).not.toContain('.stage');
    });
  });
});
