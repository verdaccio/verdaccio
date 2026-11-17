import express, { type Application } from 'express';
import path from 'node:path';
import request from 'supertest';
import { beforeAll, describe, expect, test } from 'vitest';

import { HTTP_STATUS } from '@verdaccio/core';

import { initializeServer } from './_helper';

describe.each([
  { prefix: '', defer: false },
  { prefix: '', defer: true },
  { prefix: '/registry', defer: false },
  { prefix: '/registry', defer: true },
])('web routes mounted at "$prefix" with async middleware: $defer', ({ prefix, defer }) => {
  let app: Application;
  const credentials = { name: 'routing-user', password: 'routing-password' };

  beforeAll(async () => {
    const registry = await initializeServer('conf.yaml', (config) => {
      config.plugins = path.join(import.meta.dirname, 'config/plugins');
      config.middlewares = { 'routing-delay': { defer } };
      config.url_prefix = prefix;
      config.flags = { ...config.flags, changePassword: true };
    });
    await request(registry)
      .put(`/-/user/org.couchdb.user:${credentials.name}`)
      .send(credentials)
      .expect(HTTP_STATUS.CREATED);
    app = express();
    app.use(prefix || '/', registry);
  });

  test('serves package listing and search before the catch-all handler', async () => {
    for (const route of ['/packages', '/search/routing-fixture']) {
      const response = await request(app)
        .get(`${prefix}/-/verdaccio/data${route}`)
        .expect(HTTP_STATUS.OK);
      expect(response.body).toEqual([]);
    }
  });

  test('authenticates web requests and protects password changes', async () => {
    const login = await request(app)
      .post(`${prefix}/-/verdaccio/sec/login`)
      .send({ username: credentials.name, password: credentials.password })
      .expect(HTTP_STATUS.OK);
    expect(login.body.token).toBeTruthy();
    await request(app)
      .get(`${prefix}/-/verdaccio/data/packages`)
      .set('Authorization', `Bearer ${login.body.token}`)
      .expect(HTTP_STATUS.OK);
    const newPassword = 'routing-password-changed';
    const change = { password: { old: credentials.password, new: newPassword } };
    await request(app)
      .put(`${prefix}/-/verdaccio/sec/reset_password`)
      .send(change)
      .expect(HTTP_STATUS.UNAUTHORIZED);
    const response = await request(app)
      .put(`${prefix}/-/verdaccio/sec/reset_password`)
      .set('Authorization', `Bearer ${login.body.token}`)
      .send(change)
      .expect(HTTP_STATUS.OK);
    expect(response.body.ok).toBe(true);
    await request(app)
      .post(`${prefix}/-/verdaccio/sec/login`)
      .send({ username: credentials.name, password: credentials.password })
      .expect(HTTP_STATUS.UNAUTHORIZED);
    const updatedLogin = await request(app)
      .post(`${prefix}/-/verdaccio/sec/login`)
      .send({ username: credentials.name, password: newPassword })
      .expect(HTTP_STATUS.OK);
    expect(updatedLogin.body.token).toBeTruthy();
  });

  test('serves ping and the UI while keeping missing routes as 404', async () => {
    await request(app).get(`${prefix}/-/ping`).expect(HTTP_STATUS.OK);
    const ui = await request(app).get(`${prefix}/`).expect(HTTP_STATUS.OK);
    expect(ui.text).toContain('<title>verdaccio</title>');
    await request(app).get(`${prefix}/-/verdaccio/data/missing`).expect(HTTP_STATUS.NOT_FOUND);
  });
});
