import request from 'supertest';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';

import { HTTP_STATUS, fileUtils } from '@verdaccio/core';

import { setup } from '../../../../src/lib/logger';
import { endPointAPI } from '../../../../src/lib/run-server';
import configDefault from '../../partials/config';

setup({});

describe('web ui version', () => {
  const previous = process.env.PACKAGE_VERSION;

  beforeAll(() => {
    process.env.PACKAGE_VERSION = '7.0.0-test';
  });

  afterAll(() => {
    process.env.PACKAGE_VERSION = previous;
  });

  test('should expose the verdaccio package version, not the @verdaccio/server one', async () => {
    const store = await fileUtils.createTempStorageFolder('ui-version');
    const app = await endPointAPI(
      configDefault(
        { auth: { htpasswd: { file: './htpasswd-ui-version' } }, storage: store, self_path: store },
        'api.web.spec.yaml'
      )
    );
    const response = await request(app).get('/-/static/ui-options.js').expect(HTTP_STATUS.OK);
    expect(response.text).toContain('"version":"7.0.0-test"');
    expect(response.text).not.toContain('"version":"9.0.0-next-9');
  });
});
