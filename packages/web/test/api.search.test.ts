import path from 'path';
import supertest from 'supertest';
import { IGetPackageOptions } from '@verdaccio/store';
import { setup } from '@verdaccio/logger';

import { HEADERS, HEADER_TYPE, HTTP_STATUS } from '@verdaccio/commons-api';
import { initializeServer } from './helper';

setup([]);

const mockManifest = jest.fn();
const mockQuery = jest.fn(() => [
  { ref: 'pkg1', score: 1 },
  { ref: 'pk2', score: 0.9 },
]);
jest.mock('@verdaccio/ui-theme', () => mockManifest());

jest.mock('@verdaccio/store', () => ({
  Storage: class {
    public init() {
      return Promise.resolve();
    }
    public getPackage({ name, callback }: IGetPackageOptions) {
      callback(null, {
        name,
        ['dist-tags']: {
          latest: '1.0.0',
        },
        versions: {
          ['1.0.0']: {
            name,
          },
        },
      });
    }
  },
  SearchInstance: {
    configureStorage: () => {},
    query: () => mockQuery(),
  },
}));

describe('test web server', () => {
  beforeAll(() => {
    mockManifest.mockReturnValue(() => ({
      staticPath: path.join(__dirname, 'static'),
      manifestFiles: {
        js: ['runtime.js', 'vendors.js', 'main.js'],
      },
      manifest: require('./partials/manifest/manifest.json'),
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
    mockManifest.mockClear();
  });

  test('should OK to search api', async () => {
    const response = await supertest(await initializeServer('default-test.yaml'))
      .get('/-/verdaccio/search/keyword')
      .set('Accept', HEADERS.JSON_CHARSET)
      .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
      .expect(HTTP_STATUS.OK);
    expect(response.body).toHaveLength(2);
  });

  test('should 404 to search api', async () => {
    mockQuery.mockReturnValue([]);
    const response = await supertest(await initializeServer('default-test.yaml'))
      .get('/-/verdaccio/search/notFound')
      .set('Accept', HEADERS.JSON_CHARSET)
      .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
      .expect(HTTP_STATUS.OK);
    expect(response.body).toHaveLength(0);
  });

  test('should fail search api', async () => {
    mockQuery.mockImplementation(() => {
      return [
        { ref: 'aa', score: 1 },
        { ref: 'bb', score: 0.8 },
        { ref: 'cc', score: 0.6 },
      ];
    });
    const response = await supertest(await initializeServer('default-test.yaml'))
      .get('/-/verdaccio/search/notFound')
      .set('Accept', HEADERS.JSON_CHARSET)
      .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
      .expect(HTTP_STATUS.OK);
    expect(response.body).toHaveLength(3);
  });
});
