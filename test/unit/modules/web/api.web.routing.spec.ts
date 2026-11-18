import path from 'node:path';
import request from 'supertest';
import { expect, test } from 'vitest';

import { HEADERS, HEADER_TYPE, HTTP_STATUS } from '@verdaccio/core';
import { generatePackageMetadata } from '@verdaccio/test-helper';

import { setup } from '../../../../src/lib/logger';
import { createWebApp } from './__helper';

setup({});

test('lists packages at the root after an asynchronous middleware plugin', async () => {
  const { app, mockRegistry } = await createWebApp(
    {
      url_prefix: '',
      plugins: path.join(__dirname, 'partials/plugins'),
      middlewares: { 'routing-delay': {} },
    },
    'htpasswd-web-async-routing'
  );

  try {
    const packageName = 'async-routing-test';
    await request(app)
      .put(`/${packageName}`)
      .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
      .send(generatePackageMetadata(packageName))
      .expect(HTTP_STATUS.CREATED);

    const response = await request(app)
      .get('/-/verdaccio/data/packages')
      .expect('x-async-middleware', 'executed')
      .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
      .expect(HTTP_STATUS.OK);

    expect(response.body.map((pkg: { name: string }) => pkg.name)).toEqual([packageName]);
  } finally {
    mockRegistry[0].stop();
  }
});
