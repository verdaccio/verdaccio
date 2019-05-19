// @flow

import {HEADER_TYPE, HEADERS, HTTP_STATUS} from '../../../src/lib/constants';

export function getPackage(
    request: any,
    header: string,
    pkg: string,
    statusCode: number = HTTP_STATUS.OK) {
  // $FlowFixMe
  return new Promise((resolve) => {
  request.get(`/${pkg}`)
    .set(HEADERS.AUTHORIZATION, header)
    .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
    .expect(statusCode)
    .end(function(err, res) {
      resolve([err, res]);
    });
  });
}

export function addUser(request: any, user: string, credentials: any,
                        statusCode: number = HTTP_STATUS.CREATED) {
  // $FlowFixMe
  return new Promise((resolve) => {
      request.put(`/-/user/org.couchdb.user:${user}`)
      .send(credentials)
      .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
      .expect(statusCode)
      .end(function(err, res) {
        return resolve([err, res]);
      });
  });
}

export async function getNewToken(request: any, credentials: any) {
  return new Promise(async (resolve) => {
    const [err, res] = await
    addUser(request, credentials.name, credentials);
    expect(err).toBeNull();
    const {token, ok} = res.body;
    expect(ok).toBeDefined();
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    resolve(token);
  });
}

export function getProfile(request: any, token: string, statusCode: number = HTTP_STATUS.OK) {
  // $FlowFixMe
  return new Promise((resolve) => {
    request.get(`/-/npm/v1/user`)
      .set(HEADERS.AUTHORIZATION, `Bearer ${token}`)
      .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
      .expect(statusCode)
      .end(function(err, res) {
        return resolve([err, res]);
      });
  });
}

export function postProfile(request: any, body: any, token: string, statusCode: number = HTTP_STATUS.OK) {
  // $FlowFixMe
  return new Promise((resolve) => {
    request.post(`/-/npm/v1/user`)
      .send(body)
      .set(HEADERS.AUTHORIZATION, `Bearer ${token}`)
      .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
      .expect(statusCode)
      .end(function(err, res) {
        return resolve([err, res]);
      });
  });
}
