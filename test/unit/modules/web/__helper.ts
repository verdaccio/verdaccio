import getPort from 'get-port';
import _ from 'lodash';
import request from 'supertest';

import { HEADERS, HEADER_TYPE, HTTP_STATUS, fileUtils } from '@verdaccio/core';
import { generatePackageMetadata } from '@verdaccio/test-helper';

import endPointAPI from '../../../../src/api';
import { mockServer } from '../../__helper/mock';
import configDefault from '../../partials/config';
import forbiddenPlace from '../../partials/forbidden-place';
import publishMetadata from '../../partials/publish-api';

export interface WebAppContext {
  app: any;
  mockRegistry: any;
}

/**
 * Bootstraps an Express app wired to the web endpoints with htpasswd auth
 * and a mock upstream registry. Each caller gets its own temp storage +
 * mock server port, so suites can run in parallel.
 */
export async function createWebApp(
  overrides: Record<string, any> = {},
  storagePrefix = 'htpasswd-web-api'
): Promise<WebAppContext> {
  const store = await fileUtils.createTempStorageFolder(storagePrefix);
  const mockServerPort = await getPort();

  const configForTest = configDefault(
    _.merge(
      {
        auth: {
          htpasswd: {
            file: `./${storagePrefix}`,
          },
        },
        storage: store,
        uplinks: {
          npmjs: {
            url: `http://localhost:${mockServerPort}`,
          },
        },
        self_path: store,
      },
      overrides
    ),
    'api.web.spec.yaml'
  );

  const app = await endPointAPI(configForTest);
  const mockRegistry = await mockServer(mockServerPort).init();

  return { app, mockRegistry };
}

/**
 * Publishes the canonical three test packages used by the packages/search
 * suites: `@scope/pk1-test`, `forbidden-place`, and `@protected/pk1`.
 */
export async function seedPackages(app: any): Promise<void> {
  await request(app)
    .put('/@scope%2fpk1-test')
    .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
    .send(JSON.stringify(publishMetadata))
    .expect(HTTP_STATUS.CREATED);

  await request(app)
    .put('/forbidden-place')
    .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
    .send(JSON.stringify(forbiddenPlace))
    .expect(HTTP_STATUS.CREATED);

  await request(app)
    .put('/@protected/pk1')
    .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
    .send(JSON.stringify(generatePackageMetadata('@protected/pk1')))
    .expect(HTTP_STATUS.CREATED);
}
