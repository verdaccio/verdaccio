import nock from 'nock';
import path from 'node:path';
import { beforeAll, beforeEach, describe, test, vi } from 'vitest';

import { Config, parseConfigFile } from '@verdaccio/config';
import { logger, setup } from '@verdaccio/logger';

import type { IProxy } from '../src';
import { ProxyStorage } from '../src';

beforeAll(async () => {
  await setup({});
});

const getConf = (name) => path.join(import.meta.dirname, '/conf', name);

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
          .replyWithFile(201, path.join(import.meta.dirname, 'partials/jquery-0.0.1.tgz'));
        const prox1: IProxy = new ProxyStorage('uplink', defaultRequestOptions, conf, logger);
        const stream = prox1.fetchTarball(
          'https://registry.verdaccio.org/jquery/-/jquery-0.0.1.tgz',
          {}
        );
        stream.on('response', () => {
          done(true);
        });
        stream.on('error', (err) => {
          done(err);
        });
      }));

    test('get file tarball handle retries', () =>
      new Promise((done) => {
        nock('https://registry.verdaccio.org')
          .get('/jquery/-/jquery-0.0.1.tgz')
          .reply(500, 'Internal Server Error')
          .get('/jquery/-/jquery-0.0.1.tgz')
          .reply(500, 'Internal Server Error')
          .get('/jquery/-/jquery-0.0.1.tgz')
          .replyWithFile(201, path.join(import.meta.dirname, 'partials/jquery-0.0.1.tgz'));
        const prox1: IProxy = new ProxyStorage('uplink', defaultRequestOptions, conf, logger);
        const stream = prox1.fetchTarball(
          'https://registry.verdaccio.org/jquery/-/jquery-0.0.1.tgz',
          { retry: { limit: 2 } }
        );
        stream.on('response', () => {
          // Should succeed after 2 retries
          done(true);
        });
        stream.on('error', (err) => {
          done(new Error(`Should not error with retries: ${err.message}`));
        });
      }));
  });
});
