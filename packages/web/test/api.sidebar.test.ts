import path from 'path';
import supertest from 'supertest';
import { setup } from '@verdaccio/logger';
import { IGetPackageOptions } from '@verdaccio/store';
import { HEADERS, HEADER_TYPE, HTTP_STATUS } from '@verdaccio/commons-api';

import { NOT_README_FOUND } from '../src/api/readme';
import { initializeServer } from './helper';

setup([]);

const mockManifest = jest.fn();
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
  },
}));

describe.skip('sidebar api', () => {
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

  test('should display sidebar info', async () => {
    mockManifest.mockReturnValue({
      manifest: require('./partials/manifest/manifest.json'),
    });
    const response = await supertest(await initializeServer('default-test.yaml'))
      .get('/-/verdaccio/sidebar/@scope/pk1-test')
      .set('Accept', HEADERS.TEXT_PLAIN)
      .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
      .expect(HTTP_STATUS.OK);
    expect(response.text).toMatch(NOT_README_FOUND);
  });
});
