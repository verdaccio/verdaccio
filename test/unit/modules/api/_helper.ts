import { Application } from 'express';
import _ from 'lodash';
import path from 'path';
import supertest from 'supertest';

import { parseConfigFile } from '@verdaccio/config';
import { HEADERS, HEADER_TYPE, HTTP_STATUS, TOKEN_BEARER } from '@verdaccio/core';
import { GenericBody, PackageUsers } from '@verdaccio/types';
import { buildToken, generateRandomHexString } from '@verdaccio/utils';

import apiMiddleware from '../../../../src/api/endpoint';
import { setup } from '../../../../src/lib/logger';
import Storage from '../../../../src/lib/storage';
import { generatePackageMetadata } from '../../../helpers/generatePackageMetadata';
import { initializeServer as initializeServerHelper } from '../../../helpers/initializeServer';

setup({});

export const getConf = (conf) => {
  const configPath = path.join(__dirname, 'config', conf);
  const config = parseConfigFile(configPath);
  // custom config to avoid conflict with other tests
  config.auth.htpasswd.file = `${config.auth.htpasswd.file}-${generateRandomHexString()}`;
  return config;
};

export async function initializeServer(configName): Promise<Application> {
  const config = getConf(configName);
  return initializeServerHelper(config, [apiMiddleware], Storage);
}

export function createUser(app, name: string, password: string): supertest.Test {
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

export async function generateTokenCLI(app, token, payload): Promise<any> {
  return supertest(app)
    .post('/-/npm/v1/tokens')
    .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
    .send(JSON.stringify(payload))
    .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, token))
    .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET);
}

export async function deleteTokenCLI(app, token, tokenToDelete): Promise<any> {
  return supertest(app)
    .delete(`/-/npm/v1/tokens/token/${tokenToDelete}`)
    .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
    .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, token))
    .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
    .expect(HTTP_STATUS.OK);
}

export function publishVersionWithToken(
  app,
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
  app,
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

export function getDisTags(app, pkgName) {
  return supertest(app)
    .get(`/-/package/${encodeURIComponent(pkgName)}/dist-tags`)
    .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
    .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
    .expect(HTTP_STATUS.OK);
}

export function getPackage(
  app: any,
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
