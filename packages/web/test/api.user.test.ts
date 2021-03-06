import path from 'path';
import supertest from 'supertest';
import { setup } from '@verdaccio/logger';
import { HEADERS, HEADER_TYPE, HTTP_STATUS, API_ERROR } from '@verdaccio/commons-api';
import { initializeServer } from './helper';

setup([]);

const mockManifest = jest.fn();
jest.mock('@verdaccio/ui-theme', () => mockManifest());

describe('test web server', () => {
  beforeAll(() => {
    mockManifest.mockReturnValue({
      staticPath: path.join(__dirname, '../static'),
      manifest: require('./partials/manifest/manifest.json'),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    mockManifest.mockClear();
  });

  test('should get 401', async () => {
    mockManifest.mockReturnValue({
      manifest: require('./partials/manifest/manifest.json'),
    });
    return supertest(await initializeServer('default-test.yaml'))
      .post('/-/verdaccio/login')
      .send(
        JSON.stringify({
          username: 'test',
          password: 'password1',
        })
      )
      .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
      .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
      .expect(HTTP_STATUS.UNAUTHORIZED)
      .then((response) => {
        expect(response.body.error).toEqual(API_ERROR.BAD_USERNAME_PASSWORD);
      });
  });

  test('should log in', async () => {
    mockManifest.mockReturnValue({
      manifest: require('./partials/manifest/manifest.json'),
    });
    return supertest(await initializeServer('default-test.yaml'))
      .post('/-/verdaccio/login')
      .send(
        JSON.stringify({
          username: 'test',
          password: 'test',
        })
      )
      .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
      .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
      .expect(HTTP_STATUS.OK)
      .then((res) => {
        expect(res.body.error).toBeUndefined();
        expect(res.body.token).toBeDefined();
        expect(res.body.token).toBeTruthy();
        expect(res.body.username).toMatch('test');
      });
  });

  test.todo('should change password');
  test.todo('should not change password if flag is disabled');
});
