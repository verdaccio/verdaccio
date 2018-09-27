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
    .set('authorization', header)
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
  return new Promise((resolve, reject) => {
      request.put(`/-/user/org.couchdb.user:${user}`)
      .send(credentials)
      .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
      .expect(statusCode)
      .end(function(err, res) {
        return resolve([err, res]);
      });
  });
}
