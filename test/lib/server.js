// @flow

import _ from 'lodash';
import assert from 'assert';
import smartRequest from './request';
import type {IServerBridge} from '../types';
import {API_MESSAGE, HEADERS, HTTP_STATUS, TOKEN_BASIC} from '../../src/lib/constants';
import {buildToken} from "../../src/lib/utils";
import {CREDENTIALS} from "../functional/config.functional";

const buildAuthHeader = (user, pass): string => {
  return buildToken(TOKEN_BASIC, new Buffer(`${user}:${pass}`).toString('base64'));
};

export default class Server implements IServerBridge {
  url: string;
  userAgent: string;
  authstr: string;

  constructor(url: string) {
    this.url = url.replace(/\/$/, '');
    this.userAgent = 'node/v8.1.2 linux x64';
    this.authstr = buildAuthHeader(CREDENTIALS.user, CREDENTIALS.password);
  }

  request(options: any): any {
    assert(options.uri);
    const headers = options.headers || {};

    headers.accept = headers.accept || HEADERS.JSON;
    headers['user-agent'] = headers['user-agent'] || this.userAgent;
    headers.authorization = headers.authorization || this.authstr;

    return smartRequest({
      url: this.url + options.uri,
      method: options.method || 'GET',
      headers: headers,
      encoding: options.encoding,
      json: _.isNil(options.json) === false ? options.json : true,
    });
  }

  auth(name: string, password: string) {
    this.authstr = buildAuthHeader(name, password);
    return this.request({
      uri: `/-/user/org.couchdb.user:${encodeURIComponent(name)}/-rev/undefined`,
      method: 'PUT',
      json: {
        name: name,
        password: password,
        email: `${CREDENTIALS.user}@example.com`,
        _id: `org.couchdb.user:${name}`,
        type: 'user',
        roles: [],
        date: new Date(),
      },
    });
  }

  logout(token: string) {
    return this.request({
      uri: `/-/user/token/${encodeURIComponent(token)}`,
      method: 'DELETE',
    });
  }


  getPackage(name: string) {
    return this.request({
      uri: `/${encodeURIComponent(name)}`,
      method: 'GET',
    });
  }

  putPackage(name: string, data) {
    if (_.isObject(data) && !Buffer.isBuffer(data)) {
      data = JSON.stringify(data);
    }
    return this.request({
      uri: `/${encodeURIComponent(name)}`,
      method: 'PUT',
      headers: {
        [HEADERS.CONTENT_TYPE]: HEADERS.JSON,
      },
    }).send(data);
  }

  putVersion(name: string, version: string, data: any) {
    if (_.isObject(data) && !Buffer.isBuffer(data)) {
      data = JSON.stringify(data);
    }

    return this.request({
      uri: `/${encodeURIComponent(name)}/${encodeURIComponent(version)}/-tag/latest`,
      method: 'PUT',
      headers: {
        [HEADERS.CONTENT_TYPE]: HEADERS.JSON,
      },
    }).send(data);
  }

  getTarball(name: string, filename: string) {
    return this.request({
      uri: `/${encodeURIComponent(name)}/-/${encodeURIComponent(filename)}`,
      method: 'GET',
      encoding: null,
    });
  }

  putTarball(name: string, filename: string, data: any) {
    return this.request({
      uri: `/${encodeURIComponent(name)}/-/${encodeURIComponent(filename)}/whatever`,
      method: 'PUT',
      headers: {
        [HEADERS.CONTENT_TYPE]: HEADERS.OCTET_STREAM,
      },
    }).send(data);
  }

  removeTarball(name: string) {
    return this.request({
      uri: `/${encodeURIComponent(name)}/-rev/whatever`,
      method: 'DELETE',
      headers: {
        [HEADERS.CONTENT_TYPE]: HEADERS.JSON_CHARSET,
      },
    });
  }

  removeSingleTarball(name: string, filename: string) {
    return this.request({
      uri: `/${encodeURIComponent(name)}/-/${filename}/-rev/whatever`,
      method: 'DELETE',
      headers: {
        [HEADERS.CONTENT_TYPE]: HEADERS.JSON_CHARSET,
      },
    });
  }


  addTag(name: string, tag: string, version: string) {
    return this.request({
      uri: `/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`,
      method: 'PUT',
      headers: {
        [HEADERS.CONTENT_TYPE]: HEADERS.JSON,
      },
    }).send(JSON.stringify(version));
  }

  putTarballIncomplete(name: string, filename: string, data: any, size: number, cb: Function): Promise<*> {
    let promise = this.request({
      uri: `/${encodeURIComponent(name)}/-/${encodeURIComponent(filename)}/whatever`,
      method: 'PUT',
      headers: {
        [HEADERS.CONTENT_TYPE]: HEADERS.OCTET_STREAM,
        [HEADERS.CONTENT_LENGTH]: size,
      },
      timeout: 1000,
    });

    promise.request(function(req) {
      req.write(data);
      setTimeout(function() {
        req.req.abort();
      }, 20);
    });

    return new Promise(function(resolve, reject) {
      promise
        .then(function() {
          reject(Error('no error'));
        })
        .catch(function(err) {
          if (err.code === 'ECONNRESET') {
            resolve();
          } else {
            reject(err);
          }
        });
    });
  }

  addPackage(name: string) {
    return this.putPackage(name, require('../functional/fixtures/package')(name))
      .status(HTTP_STATUS.CREATED)
      .body_ok(API_MESSAGE.PKG_CREATED);
  }

  whoami() {
    return this.request({
      uri: '/-/whoami'
    }).status(HTTP_STATUS.OK)
      .then(function(body) {
        return body.username;
      });
  }

  ping() {
    return this.request({
      uri: '/-/ping'
    }).status(HTTP_STATUS.OK)
      .then(function(body) {
        return body;
      });
  }

  debug() {
    return this.request({
      uri: '/-/_debug',
      method: 'GET',
      headers: {
        [HEADERS.CONTENT_TYPE]: HEADERS.JSON,
      },
    })
  }
}
