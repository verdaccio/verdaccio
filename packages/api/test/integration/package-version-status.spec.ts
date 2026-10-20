import supertest from 'supertest';
import { afterEach, describe, expect, test, vi } from 'vitest';

import { errorUtils } from '@verdaccio/core';
import { generatePackageMetadata } from '@verdaccio/test-helper';

import { getNewToken, initializeServerWithContext, publishVersionWithToken } from './_helper';

function statusUrl(name: string, version = '1.0.0') {
  return `/-/package/${encodeURIComponent(name)}/version/${encodeURIComponent(version)}/status`;
}

async function buildApp(config = 'stage.yaml', username = 'owner') {
  const context = await initializeServerWithContext(config);
  const token = await getNewToken(context.app, { name: username, password: 'secretPass' });
  return { ...context, token };
}

function authed(request: supertest.Test, token: string) {
  return request.set('Authorization', `Bearer ${token}`);
}

async function stageVersion(app: any, token: string, name: string, version = '1.0.0') {
  const manifest = generatePackageMetadata(name, version);
  // The existing tarball filename validator rejects '+', even though semver build metadata is valid.
  manifest._attachments = { 'package.tgz': Object.values(manifest._attachments)[0] };
  const response = await authed(
    supertest(app).post(`/-/stage/package/${encodeURIComponent(name)}`),
    token
  )
    .send(manifest)
    .expect(201);
  return response.body.stageId as string;
}

afterEach(() => vi.restoreAllMocks());

describe('package version status', () => {
  test.each(['status-package', '@scope/status-package'])(
    'should follow staging and approval for %s',
    async (name) => {
      const { app, token } = await buildApp();
      const id = await stageVersion(app, token, name);
      const staged = await authed(supertest(app).get(statusUrl(name)), token).expect(200);
      expect(staged.body).toEqual({ packageName: name, version: '1.0.0', status: 'staged' });
      await authed(supertest(app).post(`/-/stage/${id}/approve`), token).expect(201);
      const published = await authed(supertest(app).get(statusUrl(name)), token).expect(200);
      expect(published.body).toEqual({ packageName: name, version: '1.0.0', status: 'published' });
    }
  );

  test('should return 404 after rejecting a staged version', async () => {
    const { app, token } = await buildApp();
    const id = await stageVersion(app, token, 'status-reject');
    await authed(supertest(app).delete(`/-/stage/${id}`), token).expect(204);
    await authed(supertest(app).get(statusUrl('status-reject')), token).expect(404);
  });

  test('should resolve published versions without enabling staging', async () => {
    const { app, token, storage } = await buildApp('stage-disabled.yaml');
    await publishVersionWithToken(app, 'status-published', '1.0.0', token).expect(201);
    const stageLookup = vi.spyOn(storage, 'getStageStorage');
    const response = await authed(supertest(app).get(statusUrl('status-published')), token).expect(
      200
    );
    expect(response.body.status).toBe('published');
    expect(stageLookup).not.toHaveBeenCalled();
    await authed(supertest(app).get(statusUrl('status-published', '2.0.0')), token).expect(404);
  });

  test.each(['1.2.3-beta.1', '1.2.3+build.1'])(
    'should resolve the exact staged version %s',
    async (version) => {
      const { app, token } = await buildApp();
      await stageVersion(app, token, 'status-exact', version);
      const response = await authed(
        supertest(app).get(statusUrl('status-exact', version)),
        token
      ).expect(200);
      expect(response.body).toEqual({ packageName: 'status-exact', version, status: 'staged' });
      await authed(supertest(app).get(statusUrl('status-exact', '1.2.3')), token).expect(404);
    }
  );

  test.each([
    'latest',
    '^1.0.0',
    '~1.0.0',
    '*',
    '1.x',
    '1.0',
    '01.0.0',
    'v1.0.0',
    ' 1.0.0 ',
    '__proto__',
  ])('should reject %s before missing or invalid credentials', async (version) => {
    const { app } = await initializeServerWithContext('stage.yaml');
    await supertest(app).get(statusUrl('status-invalid', version)).expect(400);
    await authed(supertest(app).get(statusUrl('status-invalid', version)), 'invalid').expect(400);
  });

  test.each(['bad name', '@scope/', 'pkg/extra', '__proto__'])(
    'should reject invalid package %s before authentication',
    async (name) => {
      const { app } = await initializeServerWithContext('stage.yaml');
      await authed(supertest(app).get(statusUrl(name)), 'invalid').expect(400);
    }
  );

  test('should require authentication even for public packages', async () => {
    const { app, token } = await buildApp();
    await publishVersionWithToken(app, 'status-public', '1.0.0', token).expect(201);
    await supertest(app).get(statusUrl('status-public')).expect(401);
    await authed(supertest(app).get(statusUrl('status-public')), 'invalid').expect(401);
  });

  test('should hide existence from users without publish access', async () => {
    const { app, token, storage } = await buildApp();
    await publishVersionWithToken(app, 'restricted-status', '1.0.0', token).expect(201);
    const intruder = await getNewToken(app, { name: 'intruder', password: 'secretPass' });
    const lookup = vi.spyOn(storage, 'getPackageVersionStatus');
    const denied = await authed(
      supertest(app).get(statusUrl('restricted-status')),
      intruder
    ).expect(404);
    expect(lookup).not.toHaveBeenCalled();
    const missing = await authed(supertest(app).get(statusUrl('restricted-missing')), token).expect(
      404
    );
    expect(denied.body).toEqual(missing.body);
  });

  test('should require publish permission even for the staging author', async () => {
    const { app, token } = await buildApp('stage-split.yaml', 'developer');
    const id = await stageVersion(app, token, 'gated-status');
    await authed(supertest(app).get(`/-/stage/${id}`), token).expect(200);
    await authed(supertest(app).get(statusUrl('gated-status')), token).expect(404);
    const reviewer = await getNewToken(app, { name: 'reviewer', password: 'secretPass' });
    const response = await authed(supertest(app).get(statusUrl('gated-status')), reviewer).expect(
      200
    );
    expect(response.body.status).toBe('staged');
  });

  test('should pass the exact version to publish authorization', async () => {
    const { app, token, auth } = await buildApp();
    const permission = vi
      .spyOn(auth, 'allow_publish')
      .mockImplementation((_pkg, _user, callback) => {
        callback(errorUtils.getForbidden(), false);
      });
    await authed(supertest(app).get(statusUrl('@scope/status', '1.2.3')), token).expect(404);
    expect(permission).toHaveBeenCalledWith(
      { packageName: '@scope/status', packageVersion: '1.2.3' },
      expect.objectContaining({ name: 'owner' }),
      expect.any(Function)
    );
  });

  test('should preserve internal authorization failures', async () => {
    const { app, token, auth } = await buildApp();
    vi.spyOn(auth, 'allow_publish').mockImplementation((_pkg, _user, callback) => {
      callback(errorUtils.getInternalError(), false);
    });
    await authed(supertest(app).get(statusUrl('status-error')), token).expect(500);
  });

  test('should preserve storage failures instead of reporting a missing version', async () => {
    const { app, token, storage } = await buildApp();
    vi.spyOn(storage, 'getPackageLocalMetadata').mockRejectedValue(
      errorUtils.getServiceUnavailable()
    );
    await authed(supertest(app).get(statusUrl('status-error')), token).expect(503);
  });

  test('should not contact uplinks when the version is unknown locally', async () => {
    const { app, token, storage } = await buildApp();
    const uplinks = vi.spyOn(storage, 'syncUplinksMetadata');
    await authed(supertest(app).get(statusUrl('status-unknown')), token).expect(404);
    expect(uplinks).not.toHaveBeenCalled();
  });
  test('should return 404 after unpublishing rather than inventing deletion history', async () => {
    const { app, token, storage } = await buildApp();
    await publishVersionWithToken(app, 'status-unpublished', '1.0.0', token).expect(201);
    const manifest = await storage.getPackageLocalMetadata('status-unpublished');
    await storage.removePackage('status-unpublished', manifest._rev, 'owner');
    await authed(supertest(app).get(statusUrl('status-unpublished')), token).expect(404);
  });

  test('should not report versions hidden by manifest filters as published', async () => {
    const { app, token, storage } = await buildApp();
    await publishVersionWithToken(app, 'status-filtered', '1.0.0', token).expect(201);
    storage.filters = [{ filter_metadata: async (manifest) => ({ ...manifest, versions: {} }) }];
    await authed(supertest(app).get(statusUrl('status-filtered')), token).expect(404);
  });

  test('should report cached versions without refreshing uplinks', async () => {
    const { app, token, storage } = await buildApp();
    const manifest = generatePackageMetadata('status-cached');
    vi.spyOn(storage, 'getPackageLocalMetadata').mockResolvedValue(manifest);
    const uplinks = vi.spyOn(storage, 'syncUplinksMetadata');
    const response = await authed(supertest(app).get(statusUrl('status-cached')), token).expect(
      200
    );
    expect(response.body.status).toBe('published');
    expect(uplinks).not.toHaveBeenCalled();
  });
});
