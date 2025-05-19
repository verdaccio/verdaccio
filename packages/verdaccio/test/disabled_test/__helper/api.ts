import _ from 'lodash';
import request from 'supertest';

import {
  HEADERS,
  HEADER_TYPE,
  HTTP_STATUS,
  TOKEN_BEARER,
  authUtils,
  cryptoUtils,
} from '@verdaccio/core';
import { Package } from '@verdaccio/types';

import { getTaggedVersionFromPackage } from './expects';

const buildToken = authUtils.buildToken;

// API Helpers

// This file should contain utilities to avoid repeated task over API unit testing,
// Please, comply with the following:
// - Promisify everything
// - Encourage using constants or create new ones if it's needed
// - // @ts-ignore or any is fine if there is no other way

export function putPackage(
  request: any,
  pkgName: string,
  publishMetadata: Package,
  token?: string
): Promise<any[]> {
  return new Promise((resolve) => {
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
  return new Promise((resolve) => {
    let del = request
      .put(`/${pkgName}/-rev/${cryptoUtils.generateRandomHexString(8)}`)
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
  return new Promise((resolve) => {
    let getRequest = request.get(`/${pkgName}`);

    // token is a string
    if (token !== '') {
      getRequest.set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, token));
    }

    getRequest
      .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
      .expect(statusCode)
      .end(function (err, res) {
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
  // $FlowFixMe
  return new Promise((resolve) => {
    request
      .put(`/-/user/org.couchdb.user:${user}`)
      .send(credentials)
      .set('authorization', buildToken(TOKEN_BEARER, token))
      .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
      .expect(statusCode)
      .end(function (err, res) {
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
  // $FlowFixMe
  return new Promise((resolve) => {
    request
      .put(`/-/user/org.couchdb.user:${user}`)
      .send(credentials)
      .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
      .expect(statusCode)
      .end(function (err, res) {
        return resolve([err, res]);
      });
  });
}

export async function getNewToken(request: any, credentials: any): Promise<string> {
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
  // $FlowFixMe
  return new Promise((resolve) => {
    request
      .get(`/-/npm/v1/user`)
      .set('authorization', buildToken(TOKEN_BEARER, token))
      .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
      .expect(statusCode)
      .end(function (err, res) {
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
  // $FlowFixMe
  return new Promise((resolve) => {
    request
      .post(`/-/npm/v1/user`)
      .send(body)
      .set(HEADERS.AUTHORIZATION, `Bearer ${token}`)
      .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
      .expect(statusCode)
      .end(function (err, res) {
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
  // we retrieve the package to verify
  const [err, resp] = await getPackage(request(app), '', encodedPkgName);

  expect(err).toBeNull();

  // we check whether the latest version match with the previous published one
  return getTaggedVersionFromPackage(resp.body, pkgName, tag, version);
}

export async function isExistPackage(app, packageName) {
  const [err] = await getPackage(request(app), '', packageName, HTTP_STATUS.OK);

  return _.isNull(err);
}

export async function verifyPackageVersionDoesExist(app, packageName, version, token?: string) {
  const [, res] = await getPackage(request(app), token as string, packageName, HTTP_STATUS.OK);

  const { versions } = res.body;
  const versionsKeys = Object.keys(versions);

  return versionsKeys.includes(version) === false;
}

export function generateUnPublishURI(pkgName) {
  return `/${pkgName}/-rev/${cryptoUtils.generateRandomHexString(8)}`;
}
