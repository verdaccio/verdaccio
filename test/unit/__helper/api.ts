import createDebug from 'debug';
import _ from 'lodash';
import request from 'supertest';
import { expect } from 'vitest';

import { Manifest } from '@verdaccio/types';
import { generateRandomHexString } from '@verdaccio/utils';

import { HEADERS, HEADER_TYPE, HTTP_STATUS, TOKEN_BEARER } from '../../../src/lib/constants';
import { buildToken, encodeScopedUri } from '../../../src/lib/utils';
import { getTaggedVersionFromPackage } from './expects';

const debug = createDebug('verdaccio:test:unit:api');

// API Helpers

// This file should contain utilities to avoid repeated task over API unit testing,
// Please, comply with the following:
// - Promisify everything
// - Encourage using constants or create new ones if it's needed
// - // @ts-ignore or any is fine if there is no other way

export function putPackage(
  request: any,
  pkgName: string,
  publishMetadata: Manifest,
  token?: string
): Promise<any[]> {
  return new Promise((resolve) => {
    debug('putPackage', pkgName, publishMetadata);
    let put = request
      .put(pkgName)
      .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
      .send(JSON.stringify(publishMetadata));

    if (_.isEmpty(token) === false) {
      expect(token).toBeDefined();
      put.set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, token as string));
    }

    put
      .set('accept', 'gzip')
      .set('accept-encoding', HEADERS.JSON)
      .expect(HTTP_STATUS.CREATED)
      .end(function (err, res) {
        resolve([err, res]);
      });
  });
}

export function deletePackage(request: any, pkgName: string, token?: string): Promise<any[]> {
  debug('deletePackage', pkgName);
  return new Promise((resolve) => {
    let del = request
      .put(`/${encodeScopedUri(pkgName)}/-rev/${generateRandomHexString(8)}`)
      .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON);

    if (_.isNil(token) === false) {
      del.set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, token as string));
    }

    del
      .set('accept-encoding', HEADERS.JSON)
      .expect(HTTP_STATUS.CREATED)
      .end(function (err, res) {
        resolve([err, res]);
      });
  });
}

export function getPackage(
  request: any,
  token: string,
  pkgName: string,
  statusCode: number = HTTP_STATUS.OK
): Promise<any[]> {
  debug('getPackage', pkgName, statusCode);
  return new Promise((resolve) => {
    let getRequest = request.get(`/${pkgName}`);
    debug('getPackage token', token);
    // token is a string
    if (typeof token === 'string' && token !== '') {
      getRequest.set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, token));
    }

    debug('getPackage request');
    getRequest
      .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
      .expect(statusCode)
      .end(function (err, res) {
        debug('getPackage error', err);
        resolve([err, res]);
      });
  });
}

export function loginUserToken(
  request: any,
  user: string,
  credentials: any,
  token: string,
  statusCode: number = HTTP_STATUS.CREATED
): Promise<any[]> {
  return new Promise((resolve) => {
    debug('loginUserToken', user, credentials, token, statusCode);
    request
      .put(`/-/user/org.couchdb.user:${user}`)
      .send(credentials)
      .set('authorization', buildToken(TOKEN_BEARER, token))
      .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
      .expect(statusCode)
      .end(function (err, res) {
        debug('loginUserToken response', err, res);
        return resolve([err, res]);
      });
  });
}

export function addUser(
  request: any,
  user: string,
  credentials: any,
  statusCode: number = HTTP_STATUS.CREATED
): Promise<any[]> {
  return new Promise((resolve) => {
    debug('addUser', user, credentials, statusCode);
    request
      .put(`/-/user/org.couchdb.user:${user}`)
      .send(credentials)
      .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
      .expect(statusCode)
      .end(function (err, res) {
        debug('addUser response', err, res.body);
        return resolve([err, res]);
      });
  });
}

export async function getNewToken(request: any, credentials: any): Promise<string> {
  debug('token', credentials.name, credentials);
  /* eslint no-async-promise-executor: 0 */
  return new Promise(async (resolve) => {
    const [err, res] = await addUser(request, credentials.name, credentials);
    expect(err).toBeNull();
    const { token, ok } = res.body;
    expect(ok).toBeDefined();
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    resolve(token);
  });
}

export function getProfile(
  request: any,
  token: string,
  statusCode: number = HTTP_STATUS.OK
): Promise<any[]> {
  return new Promise((resolve) => {
    request
      .get(`/-/npm/v1/user`)
      .set('authorization', buildToken(TOKEN_BEARER, token))
      .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
      .expect(statusCode)
      .end(function (err, res) {
        debug('getProfile response', err, res);
        return resolve([err, res]);
      });
  });
}

export function postProfile(
  request: any,
  body: any,
  token: string,
  statusCode: number = HTTP_STATUS.OK
): Promise<any[]> {
  debug('postProfile', body, token, statusCode);
  return new Promise((resolve) => {
    request
      .post(`/-/npm/v1/user`)
      .send(body)
      .set(HEADERS.AUTHORIZATION, `Bearer ${token}`)
      .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
      .expect(statusCode)
      .end(function (err, res) {
        debug('postProfile response', err, res);
        return resolve([err, res]);
      });
  });
}

export async function fetchPackageByVersionAndTag(
  app,
  encodedPkgName,
  pkgName,
  version,
  tag = 'latest'
) {
  debug('fetchPackageByVersionAndTag', encodedPkgName, pkgName, version, tag);
  // we retrieve the package to verify
  const [err, resp] = await getPackage(request(app), '', encodedPkgName);

  expect(err).toBeNull();

  debug('fetchPackageByVersionAndTag response', resp.body);
  // we check whether the latest version match with the previous published one
  return getTaggedVersionFromPackage(resp.body, pkgName, tag, version);
}

export async function isExistPackage(app, packageName) {
  debug('isExistPackage', packageName);
  const [err] = await getPackage(request(app), '', encodeScopedUri(packageName), HTTP_STATUS.OK);
  debug('isExistPackage response', err);
  return _.isNull(err);
}

export async function verifyPackageVersionDoesExist(app, packageName, version, token?: string) {
  debug('verifyPackageVersionDoesExist', packageName, version, token);
  const [, res] = await getPackage(
    request(app),
    token as string,
    encodeScopedUri(packageName),
    HTTP_STATUS.OK
  );
  debug('verifyPackageVersionDoesExist response', res.body);
  const { versions } = res.body;
  const versionsKeys = Object.keys(versions);
  debug('verifyPackageVersionDoesExist versionsKeys', versionsKeys);
  return versionsKeys.includes(version) === false;
}

export function generateUnPublishURI(pkgName) {
  debug('generateUnPublishURI', pkgName);
  return `/${encodeScopedUri(pkgName)}/-rev/${generateRandomHexString(8)}`;
}
