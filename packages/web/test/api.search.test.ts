import path from 'path';
import supertest from 'supertest';
import { IGetPackageOptions } from '@verdaccio/store';
import { setup } from '@verdaccio/logger';

import { HEADERS, HEADER_TYPE, HTTP_STATUS } from '@verdaccio/commons-api';
import { initializeServer } from './helper';

setup([]);

const mockManifest = jest.fn();
const mockQuery = jest.fn(() => ['pkg1', 'pk2']);
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
    mockManifest.mockReturnValue({
      staticPath: path.join(__dirname, 'static'),
      manifest: require('./partials/manifest/manifest.json'),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    mockManifest.mockClear();
  });

  test('should OK to search api', async () => {
    mockManifest.mockReturnValue({
      manifest: require('./partials/manifest/manifest.json'),
    });
    const response = await supertest(await initializeServer('default-test.yaml'))
      .get('/-/verdaccio/search/keyword')
      .set('Accept', HEADERS.JSON_CHARSET)
      .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
      .expect(HTTP_STATUS.OK);
    expect(response.body).toHaveLength(2);
  });

  test('should 404 to search api', async () => {
    mockManifest.mockReturnValue({
      manifest: require('./partials/manifest/manifest.json'),
    });
    mockQuery.mockReturnValue([]);
    const response = await supertest(await initializeServer('default-test.yaml'))
      .get('/-/verdaccio/search/notFound')
      .set('Accept', HEADERS.JSON_CHARSET)
      .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
      .expect(HTTP_STATUS.OK);
    expect(response.body).toHaveLength(0);
  });

  test('should fail search api', async () => {
    mockManifest.mockReturnValue({
      manifest: require('./partials/manifest/manifest.json'),
    });
    mockQuery.mockImplementation(() => {
      return ['aa', 'bb', 'cc'];
    });
    const response = await supertest(await initializeServer('default-test.yaml'))
      .get('/-/verdaccio/search/notFound')
      .set('Accept', HEADERS.JSON_CHARSET)
      .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
      .expect(HTTP_STATUS.OK);
    expect(response.body).toHaveLength(3);
  });
});
