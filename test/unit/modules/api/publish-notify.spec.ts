import nock from 'nock';
import { basename } from 'path';
import supertest from 'supertest';
import { beforeEach, describe, expect, test } from 'vitest';

import { HEADERS, HEADER_TYPE, HTTP_STATUS } from '@verdaccio/core';
import { generatePackageMetadata } from '@verdaccio/test-helper';

import { initializeServer, publishVersion } from './_helper';

describe('publish notifications', () => {
  const notifyDomain = 'http://slack-service';
  const notifyPath = '/foo?auth_token=mySecretToken';

  beforeEach(() => {
    nock.cleanAll();
    nock.abortPendingRequests();
  });

  // unpublish notifications are fired in a non-blocking way (the response
  // does not wait for them), so the assertion cannot rely on the request
  // having completed by the time the HTTP response resolves. Poll the nock
  // scope until the interceptor has been consumed (or time out).
  const waitForScopeDone = async (scope: nock.Scope, timeout = 3000): Promise<void> => {
    const start = Date.now();
    while (!scope.isDone() && Date.now() - start < timeout) {
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
  };

  test.each(['notify-pkg', '@scope/notify-pkg'])(
    'should trigger notification when publishing a package (%s)',
    async (pkgName) => {
      const notifyScope = nock(notifyDomain)
        .post(notifyPath, (body) => {
          expect(body).toEqual({
            color: 'green',
            message: `New package published: * ${pkgName}*`,
            publishedPackage: `${pkgName}@1.0.0`,
            publishType: 'publish',
            message_format: 'text',
            notify: true,
          });
          return true;
        })
        .reply(200);

      const app = await initializeServer('publish-notify.yaml');
      await publishVersion(app, pkgName, '1.0.0').expect(HTTP_STATUS.CREATED);
      await waitForScopeDone(notifyScope);
      expect(notifyScope.isDone()).toBe(true);
    }
  );

  test.each(['notify-unpublish-pkg', '@scope/notify-unpublish-pkg'])(
    'should trigger notification when unpublishing a package entirely (%s)',
    async (pkgName) => {
      const app = await initializeServer('publish-notify.yaml');
      await publishVersion(app, pkgName, '1.0.0').expect(HTTP_STATUS.CREATED);
      nock.cleanAll();

      const notifyScope = nock(notifyDomain)
        .post(notifyPath, (body) => {
          expect(body).toEqual({
            color: 'green',
            message: `New package published: * ${pkgName}*`,
            publishedPackage: pkgName,
            publishType: 'unpublish',
            message_format: 'text',
            notify: true,
          });
          return true;
        })
        .reply(200);

      await supertest(app)
        .delete(`/${encodeURIComponent(pkgName)}/-rev/xxx`)
        .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
        .expect(HTTP_STATUS.CREATED);

      await waitForScopeDone(notifyScope);
      expect(notifyScope.isDone()).toBe(true);
    }
  );

  test.each(['notify-tarball-pkg', '@scope/notify-tarball-pkg'])(
    'should trigger notification when removing a tarball (%s)',
    async (pkgName) => {
      const app = await initializeServer('publish-notify.yaml');
      await publishVersion(app, pkgName, '1.0.0').expect(HTTP_STATUS.CREATED);
      nock.cleanAll();

      const notifyScope = nock(notifyDomain)
        .post(notifyPath, (body) => {
          expect(body).toEqual({
            color: 'green',
            message: `New package published: * ${pkgName}*`,
            publishedPackage: `${pkgName}@1.0.0`,
            publishType: 'unpublish',
            message_format: 'text',
            notify: true,
          });
          return true;
        })
        .reply(200);

      await supertest(app)
        .delete(`/${pkgName}/-/${basename(pkgName)}-1.0.0.tgz/-rev/revision`)
        .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
        .expect(HTTP_STATUS.CREATED);

      await waitForScopeDone(notifyScope);
      expect(notifyScope.isDone()).toBe(true);
    }
  );

  test('should fall back to the package name when the tarball filename has no version', async () => {
    const pkgName = 'notify-fallback-pkg';
    const tarballName = 'no-version-here.tgz';
    const app = await initializeServer('publish-notify.yaml');
    const pkgMetadata = generatePackageMetadata(pkgName, '1.0.0');
    const [origFilename] = Object.keys(pkgMetadata._attachments);
    pkgMetadata._attachments = {
      [tarballName]: pkgMetadata._attachments[origFilename],
    };
    await supertest(app)
      .put(`/${encodeURIComponent(pkgName)}`)
      .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
      .send(JSON.stringify(pkgMetadata))
      .set('accept', HEADERS.GZIP)
      .expect(HTTP_STATUS.CREATED);
    nock.cleanAll();

    const notifyScope = nock(notifyDomain)
      .post(notifyPath, (body) => {
        // not `notify-fallback-pkg@undefined`
        expect(body.publishedPackage).toEqual(pkgName);
        expect(body.publishType).toEqual('unpublish');
        return true;
      })
      .reply(200);

    await supertest(app)
      .delete(`/${pkgName}/-/${tarballName}/-rev/revision`)
      .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
      .expect(HTTP_STATUS.CREATED);

    await waitForScopeDone(notifyScope);
    expect(notifyScope.isDone()).toBe(true);
  });

  test('should unpublish successfully when the notification endpoint fails', async () => {
    const pkgName = 'notify-failure-pkg';
    const app = await initializeServer('publish-notify.yaml');
    await publishVersion(app, pkgName, '1.0.0').expect(HTTP_STATUS.CREATED);
    nock.cleanAll();

    const notifyScope = nock(notifyDomain).post(notifyPath).replyWithError('connection refused');

    await supertest(app)
      .delete(`/${encodeURIComponent(pkgName)}/-rev/xxx`)
      .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
      .expect(HTTP_STATUS.CREATED);

    await waitForScopeDone(notifyScope);
    expect(notifyScope.isDone()).toBe(true);
  });

  test('should not trigger notification when the tarball removal fails', async () => {
    const pkgName = 'notify-missing-tarball-pkg';
    const app = await initializeServer('publish-notify.yaml');
    await publishVersion(app, pkgName, '1.0.0').expect(HTTP_STATUS.CREATED);
    nock.cleanAll();

    const notifyScope = nock(notifyDomain).post(notifyPath).reply(200);

    await supertest(app)
      .delete(`/${pkgName}/-/${pkgName}-9.9.9.tgz/-rev/revision`)
      .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
      .expect(HTTP_STATUS.NOT_FOUND);

    // give a (wrongly) fired notification time to arrive before asserting silence
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(notifyScope.isDone()).toBe(false);
  });
});
