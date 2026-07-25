import type { Server } from 'http';
import { createServer } from 'http';
import type { AddressInfo } from 'net';
import { basename } from 'path';
import supertest from 'supertest';
import { afterEach, describe, expect, test } from 'vitest';

import { HEADERS, HEADER_TYPE, HTTP_STATUS } from '@verdaccio/core';
import { generatePackageMetadata } from '@verdaccio/test-helper';

import { initializeServer, publishVersion } from './_helper';

// A real HTTP server instead of nock: the notify client in @verdaccio/hooks is
// moving from got-cjs to the global fetch, which nock@13 cannot intercept
// (and nock@14 breaks the https mocks used by the uplink test suites).
type NotifyServer = {
  url: string;
  received: { url: string; body: any }[];
  // when true, the socket is destroyed before replying to simulate an
  // unreachable notification endpoint
  failConnections: boolean;
  close: () => Promise<void>;
};

describe('publish notifications', () => {
  const notifyPath = '/foo?auth_token=mySecretToken';
  let notifyServer: NotifyServer;

  const startNotifyServer = async (): Promise<NotifyServer> => {
    const received: NotifyServer['received'] = [];
    const state = { failConnections: false };
    const server: Server = createServer((req, res) => {
      let data = '';
      req.on('data', (chunk) => (data += chunk));
      req.on('end', () => {
        received.push({ url: req.url as string, body: data ? JSON.parse(data) : undefined });
        if (state.failConnections) {
          req.socket.destroy();
          return;
        }
        res.statusCode = HTTP_STATUS.OK;
        res.end();
      });
    });
    await new Promise<void>((resolve) => server.listen(0, resolve));
    const { port } = server.address() as AddressInfo;
    notifyServer = {
      url: `http://localhost:${port}`,
      received,
      get failConnections() {
        return state.failConnections;
      },
      set failConnections(value: boolean) {
        state.failConnections = value;
      },
      close: () => new Promise<void>((resolve) => server.close(() => resolve())),
    };
    return notifyServer;
  };

  const initializeNotifyServer = async () => {
    const server = await startNotifyServer();
    const app = await initializeServer('publish-notify.yaml', (config: any) => {
      config.notify.endpoint = `${server.url}${notifyPath}`;
    });
    return { server, app };
  };

  // notifications are fired in a non-blocking way (the response does not wait
  // for them), so poll until the expected number of requests arrived.
  const waitForRequests = async (
    server: NotifyServer,
    count: number,
    timeout = 3000
  ): Promise<void> => {
    const start = Date.now();
    while (server.received.length < count && Date.now() - start < timeout) {
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
  };

  afterEach(async () => {
    await notifyServer?.close();
  });

  test.each(['notify-pkg', '@scope/notify-pkg'])(
    'should trigger notification when publishing a package (%s)',
    async (pkgName) => {
      const { server, app } = await initializeNotifyServer();
      await publishVersion(app, pkgName, '1.0.0').expect(HTTP_STATUS.CREATED);

      await waitForRequests(server, 1);
      expect(server.received).toHaveLength(1);
      expect(server.received[0].url).toEqual(notifyPath);
      expect(server.received[0].body).toEqual({
        color: 'green',
        message: `New package published: * ${pkgName}*`,
        publishedPackage: `${pkgName}@1.0.0`,
        publishType: 'publish',
        message_format: 'text',
        notify: true,
      });
    }
  );

  test.each(['notify-unpublish-pkg', '@scope/notify-unpublish-pkg'])(
    'should trigger notification when unpublishing a package entirely (%s)',
    async (pkgName) => {
      const { server, app } = await initializeNotifyServer();
      await publishVersion(app, pkgName, '1.0.0').expect(HTTP_STATUS.CREATED);
      await waitForRequests(server, 1);
      server.received.length = 0;

      await supertest(app)
        .delete(`/${encodeURIComponent(pkgName)}/-rev/xxx`)
        .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
        .expect(HTTP_STATUS.CREATED);

      await waitForRequests(server, 1);
      expect(server.received).toHaveLength(1);
      expect(server.received[0].body).toEqual({
        color: 'green',
        message: `New package published: * ${pkgName}*`,
        publishedPackage: pkgName,
        publishType: 'unpublish',
        message_format: 'text',
        notify: true,
      });
    }
  );

  test.each(['notify-tarball-pkg', '@scope/notify-tarball-pkg'])(
    'should trigger notification when removing a tarball (%s)',
    async (pkgName) => {
      const { server, app } = await initializeNotifyServer();
      await publishVersion(app, pkgName, '1.0.0').expect(HTTP_STATUS.CREATED);
      await waitForRequests(server, 1);
      server.received.length = 0;

      await supertest(app)
        .delete(`/${pkgName}/-/${basename(pkgName)}-1.0.0.tgz/-rev/revision`)
        .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
        .expect(HTTP_STATUS.CREATED);

      await waitForRequests(server, 1);
      expect(server.received).toHaveLength(1);
      expect(server.received[0].body).toEqual({
        color: 'green',
        message: `New package published: * ${pkgName}*`,
        publishedPackage: `${pkgName}@1.0.0`,
        publishType: 'unpublish',
        message_format: 'text',
        notify: true,
      });
    }
  );

  test('should fall back to the package name when the tarball filename has no version', async () => {
    const pkgName = 'notify-fallback-pkg';
    const tarballName = 'no-version-here.tgz';
    const { server, app } = await initializeNotifyServer();
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
    await waitForRequests(server, 1);
    server.received.length = 0;

    await supertest(app)
      .delete(`/${pkgName}/-/${tarballName}/-rev/revision`)
      .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
      .expect(HTTP_STATUS.CREATED);

    await waitForRequests(server, 1);
    expect(server.received).toHaveLength(1);
    // not `notify-fallback-pkg@undefined`
    expect(server.received[0].body.publishedPackage).toEqual(pkgName);
    expect(server.received[0].body.publishType).toEqual('unpublish');
  });

  test('should unpublish successfully when the notification endpoint fails', async () => {
    const pkgName = 'notify-failure-pkg';
    const { server, app } = await initializeNotifyServer();
    await publishVersion(app, pkgName, '1.0.0').expect(HTTP_STATUS.CREATED);
    await waitForRequests(server, 1);
    server.received.length = 0;
    server.failConnections = true;

    await supertest(app)
      .delete(`/${encodeURIComponent(pkgName)}/-rev/xxx`)
      .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
      .expect(HTTP_STATUS.CREATED);

    // the notification is attempted (and errors out) without affecting the response
    await waitForRequests(server, 1);
    expect(server.received).toHaveLength(1);
  });

  test('should not trigger notification when the tarball removal fails', async () => {
    const pkgName = 'notify-missing-tarball-pkg';
    const { server, app } = await initializeNotifyServer();
    await publishVersion(app, pkgName, '1.0.0').expect(HTTP_STATUS.CREATED);
    await waitForRequests(server, 1);
    server.received.length = 0;

    await supertest(app)
      .delete(`/${pkgName}/-/${pkgName}-9.9.9.tgz/-rev/revision`)
      .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
      .expect(HTTP_STATUS.NOT_FOUND);

    // give a (wrongly) fired notification time to arrive before asserting silence
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(server.received).toHaveLength(0);
  });
});
