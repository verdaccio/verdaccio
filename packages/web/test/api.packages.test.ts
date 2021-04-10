import path from 'path';
import supertest from 'supertest';
import { setup } from '@verdaccio/logger';
import { HEADERS, HEADER_TYPE, HTTP_STATUS } from '@verdaccio/commons-api';
import { initializeServer } from './helper';

setup([]);

const mockManifest = jest.fn();
jest.mock('@verdaccio/ui-theme', () => mockManifest());

describe('test web server', () => {
  afterEach(() => {
    jest.clearAllMocks();
    mockManifest.mockClear();
  });

  test('should OK to package api', async () => {
    mockManifest.mockReturnValue(() => ({
      staticPath: path.join(__dirname, 'static'),
      manifestFiles: {
        js: ['runtime.js', 'vendors.js', 'main.js'],
      },
      manifest: require('./partials/manifest/manifest.json'),
    }));
    const response = await supertest(await initializeServer('default-test.yaml'))
      .get('/-/verdaccio/packages')
      .set('Accept', HEADERS.JSON_CHARSET)
      .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
      .expect(HTTP_STATUS.OK);
    expect(response.body).toEqual([]);
  });
});
