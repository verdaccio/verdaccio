import nock from 'nock';
import path from 'path';
import { beforeEach, describe, test, vi } from 'vitest';

import { Config, parseConfigFile } from '@verdaccio/config';
import { logger, setup } from '@verdaccio/logger';

import { ProxyStorage } from '../src';

await setup({});

const getConf = (name) => path.join(__dirname, '/conf', name);

// // mock to get the headers fixed value
vi.mock('crypto', () => {
  return {
    randomBytes: (): { toString: () => string } => {
      return {
        toString: (): string => 'foo-random-bytes',
      };
    },
    pseudoRandomBytes: (): { toString: () => string } => {
      return {
        toString: (): string => 'foo-phseudo-bytes',
      };
    },
  };
});

describe('tarball proxy', () => {
  beforeEach(() => {
    nock.cleanAll();
    nock.abortPendingRequests();
    vi.clearAllMocks();
  });
  const defaultRequestOptions = {
    url: 'https://registry.verdaccio.org',
  };

  const proxyPath = getConf('proxy1.yaml');
  const conf = new Config(parseConfigFile(proxyPath));

  describe('fetchTarball', () => {
    test('get file tarball fetch', () =>
      new Promise((done) => {
        nock('https://registry.verdaccio.org')
          .get('/jquery/-/jquery-0.0.1.tgz')
          .replyWithFile(201, path.join(__dirname, 'partials/jquery-0.0.1.tgz'));
        const prox1 = new ProxyStorage('uplink', defaultRequestOptions, conf, logger);
        const stream = prox1.fetchTarball(
          'https://registry.verdaccio.org/jquery/-/jquery-0.0.1.tgz',
          // @ts-expect-error
          {}
        );
        stream.on('response', () => {
          done(true);
        });
        stream.on('error', (err) => {
          done(err);
        });
      }));

    test.skip('get file tarball handle retries', () =>
      new Promise((done) => {
        nock('https://registry.verdaccio.org')
          .get('/jquery/-/jquery-0.0.1.tgz')
          .twice()
          .reply(500, 'some-text')
          .get('/jquery/-/jquery-0.0.1.tgz')
          .once()
          .replyWithFile(201, path.join(__dirname, 'partials/jquery-0.0.1.tgz'));
        const prox1 = new ProxyStorage('uplink', defaultRequestOptions, conf, logger);
        const stream = prox1.fetchTarball(
          'https://registry.verdaccio.org/jquery/-/jquery-0.0.1.tgz',
          { retry: { limit: 2 } }
        );
        stream.on('error', () => {
          // FIXME: stream should have handle 2 retry
          done();
        });
      }));
  });
});
//     test('get file tarball correct content-length', (done) => {
//       nock(domain)
//         .get('/jquery/-/jquery-0.0.1.tgz')
//         // types does not match here with documentation
//         // @ts-expect-error
//         .replyWithFile(201, path.join(__dirname, 'partials/jquery-0.0.1.tgz'), {
//           [HEADER_TYPE.CONTENT_LENGTH]: 277,
//         });
//       const prox1 = new ProxyStorage('uplink',defaultRequestOptions, conf);
//       const stream = prox1.fetchTarball('https://registry.npmjs.org/jquery/-/jquery-0.0.1.tgz');
//       stream.on(HEADER_TYPE.CONTENT_LENGTH, (data) => {
//         expect(data).toEqual('277');
//         done();
//       });
//     });

//     describe('error handling', () => {
//       test('should be offline uplink', (done) => {
//         const tarball = 'https://registry.npmjs.org/jquery/-/jquery-0.0.1.tgz';
//         nock(domain).get('/jquery/-/jquery-0.0.1.tgz').times(100).replyWithError('some error');
//         const proxy = new ProxyStorage('uplink',defaultRequestOptions, conf);
//         const stream = proxy.fetchTarball(tarball);
//         // to test a uplink is offline we have to be try 3 times
//         // the default failed request are set to 2
//         process.nextTick(function () {
//           stream.on('error', function (err) {
//             expect(err).not.toBeNull();
//             // expect(err.statusCode).toBe(404);
//             expect(proxy.failed_requests).toBe(1);

//             const streamSecondTry = proxy.fetchTarball(tarball);
//             streamSecondTry.on('error', function (err) {
//               expect(err).not.toBeNull();
//               /*
//               code: 'ENOTFOUND',
//               errno: 'ENOTFOUND',
//               */
//               // expect(err.statusCode).toBe(404);
//               expect(proxy.failed_requests).toBe(2);
//               const streamThirdTry = proxy.fetchTarball(tarball);
//               streamThirdTry.on('error', function (err: VerdaccioError) {
//                 expect(err).not.toBeNull();
//                 expect(err.statusCode).toBe(HTTP_STATUS.INTERNAL_ERROR);
//                 expect(proxy.failed_requests).toBe(2);
//                 expect(err.message).toMatch(API_ERROR.UPLINK_OFFLINE);
//                 done();
//               });
//             });
//           });
//         });
//       });

//       test('not found tarball', (done) => {
//         nock(domain).get('/jquery/-/jquery-0.0.1.tgz').reply(404);
//         const prox1 = new ProxyStorage('uplink',defaultRequestOptions, conf);
//         const stream = prox1.fetchTarball('https://registry.npmjs.org/jquery/-/jquery-0.0.1.tgz');
//         stream.on('error', (response) => {
//           expect(response).toEqual(errorUtils.getNotFound(API_ERROR.NOT_FILE_UPLINK));
//           done();
//         });
//       });

//       test('fail tarball request', (done) => {
//         nock(domain).get('/jquery/-/jquery-0.0.1.tgz').replyWithError('boom file');
//         const prox1 = new ProxyStorage('uplink',defaultRequestOptions, conf);
//         const stream = prox1.fetchTarball('https://registry.npmjs.org/jquery/-/jquery-0.0.1.tgz');
//         stream.on('error', (response) => {
//           expect(response).toEqual(Error('boom file'));
//           done();
//         });
//       });

//       test('bad uplink request', (done) => {
//         nock(domain).get('/jquery/-/jquery-0.0.1.tgz').reply(409);
//         const prox1 = new ProxyStorage('uplink',defaultRequestOptions, conf);
//         const stream = prox1.fetchTarball('https://registry.npmjs.org/jquery/-/jquery-0.0.1.tgz');
//         stream.on('error', (response) => {
//           expect(response).toEqual(errorUtils.getInternalError(`bad uplink status code: 409`));
//           done();
//         });
//       });

//       test('content length header mismatch', (done) => {
//         nock(domain)
//           .get('/jquery/-/jquery-0.0.1.tgz')
//           // types does not match here with documentation
//           // @ts-expect-error
//           .replyWithFile(201, path.join(__dirname, 'partials/jquery-0.0.1.tgz'), {
//             [HEADER_TYPE.CONTENT_LENGTH]: 0,
//           });
//         const prox1 = new ProxyStorage('uplink',defaultRequestOptions, conf);
//         const stream = prox1.fetchTarball('https://registry.npmjs.org/jquery/-/jquery-0.0.1.tgz');
//         stream.on('error', (response) => {
//           expect(response).toEqual(errorUtils.getInternalError(API_ERROR.CONTENT_MISMATCH));
//           done();
//         });
//       });
//     });
//   });
// });
