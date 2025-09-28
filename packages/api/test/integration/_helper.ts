import { Application } from 'express';
import _ from 'lodash';
import path from 'node:path';
import supertest from 'supertest';
import { App } from 'supertest/types';
import { expect } from 'vitest';

import { parseConfigFile } from '@verdaccio/config';
import {
  HEADERS,
  HEADER_TYPE,
  HTTP_STATUS,
  TOKEN_BEARER,
  authUtils,
  cryptoUtils,
} from '@verdaccio/core';
import { setup } from '@verdaccio/logger';
import { Storage } from '@verdaccio/store';
import {
  generatePackageMetadata,
  initializeServer as initializeServerHelper,
} from '@verdaccio/test-helper';
import { Author, GenericBody, PackageUsers } from '@verdaccio/types';

import apiMiddleware from '../../src';

setup({});

export const buildToken = authUtils.buildToken;

export const getConf = (conf: string) => {
  const configPath = path.join(__dirname, 'config', conf);
  const config = parseConfigFile(configPath);
  // custom config to avoid conflict with other tests
  config.auth.htpasswd.file = `${config.auth.htpasswd.file}-${cryptoUtils.generateRandomHexString()}`;
  return config;
};

export async function initializeServer(configName: string): Promise<Application> {
  const config = getConf(configName);
  return initializeServerHelper(config, [apiMiddleware], Storage);
}

export function createUser(app: App, name: string, password: string): supertest.Test {
  return supertest(app)
    .put(`/-/user/org.couchdb.user:${name}`)
    .send({
      name: name,
      password: password,
    })
    .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
    .expect(HEADERS.CACHE_CONTROL, 'no-cache, no-store')
    .expect(HTTP_STATUS.CREATED);
}

export async function getNewToken(app: any, credentials: any): Promise<string> {
  const response = await createUser(app, credentials.name, credentials.password);
  const { token, ok } = response.body;
  expect(ok).toBeDefined();
  expect(token).toBeDefined();
  expect(typeof token).toBe('string');
  return token;
}

export async function generateTokenCLI(app: App, token: string, payload: any): Promise<any> {
  return supertest(app)
    .post('/-/npm/v1/tokens')
    .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
    .send(JSON.stringify(payload))
    .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, token))
    .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET);
}

export async function deleteTokenCLI(app: App, token: string, tokenToDelete: string): Promise<any> {
  return supertest(app)
    .delete(`/-/npm/v1/tokens/token/${tokenToDelete}`)
    .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
    .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, token))
    .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
    .expect(HTTP_STATUS.OK);
}

export function publishVersionWithToken(
  app: App,
  pkgName: string,
  version: string,
  token: string,
  distTags?: GenericBody
): supertest.Test {
  const pkgMetadata = generatePackageMetadata(pkgName, version, distTags);

  return supertest(app)
    .put(`/${encodeURIComponent(pkgName)}`)
    .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
    .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, token))
    .send(JSON.stringify(pkgMetadata))
    .set('accept', HEADERS.GZIP)
    .set(HEADER_TYPE.ACCEPT_ENCODING, HEADERS.JSON);
}

export function publishVersion(
  app: App,
  pkgName: string,
  version: string,
  distTags?: GenericBody,
  token?: string
): supertest.Test {
  const pkgMetadata = generatePackageMetadata(pkgName, version, distTags);

  const test = supertest(app)
    .put(`/${encodeURIComponent(pkgName)}`)
    .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
    .send(JSON.stringify(pkgMetadata))
    .set('accept', HEADERS.GZIP)
    .set(HEADER_TYPE.ACCEPT_ENCODING, HEADERS.JSON);

  if (typeof token === 'string') {
    test.set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, token));
  }

  return test;
}

export function starPackage(
  app,
  options: {
    users: PackageUsers;
    name: string;
    _rev: string;
    _id?: string;
  },
  token?: string
): supertest.Test {
  const { _rev, _id, users } = options;
  const starManifest = {
    _rev,
    _id,
    users,
  };

  const test = supertest(app)
    .put(`/${encodeURIComponent(options.name)}`)
    .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
    .send(JSON.stringify(starManifest))
    .set('accept', HEADERS.GZIP)
    .set(HEADER_TYPE.ACCEPT_ENCODING, HEADERS.JSON);

  if (typeof token === 'string') {
    test.set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, token));
  }

  return test;
}

export function changeOwners(
  app: App,
  options: {
    maintainers: Author[];
    name: string;
    _rev: string;
    _id?: string;
  },
  token?: string
): supertest.Test {
  const { _rev, _id, maintainers } = options;
  const ownerManifest = {
    _rev,
    _id,
    maintainers,
  };

  const test = supertest(app)
    .put(`/${encodeURIComponent(options.name)}`)
    .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
    .send(JSON.stringify(ownerManifest))
    .set('accept', HEADERS.GZIP)
    .set(HEADER_TYPE.ACCEPT_ENCODING, HEADERS.JSON);

  if (typeof token === 'string') {
    test.set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, token));
  }

  return test;
}

export function getDisTags(app: App, pkgName: string): supertest.Test {
  return supertest(app)
    .get(`/-/package/${encodeURIComponent(pkgName)}/dist-tags`)
    .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
    .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
    .expect(HTTP_STATUS.OK);
}

export function getPackage(
  app: App,
  token: string,
  pkgName: string,
  statusCode: number = HTTP_STATUS.OK
): supertest.Test {
  const test = supertest(app).get(`/${pkgName}`);

  if (_.isNil(token) === false || _.isEmpty(token) === false) {
    test.set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, token));
  }

  return test.expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET).expect(statusCode);
}
