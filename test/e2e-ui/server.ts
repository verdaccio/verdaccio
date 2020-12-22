import assert from 'assert';

import { HTTP_STATUS, HEADERS, API_MESSAGE } from '@verdaccio/commons-api';
import _ from 'lodash';

import { CREDENTIALS } from './registry-launcher';
import smartRequest, { RequestPromise } from './request';

declare class PromiseAssert<RequestPromise> extends Promise<any> {
  public constructor(options: any);
}

const TARBALL = 'tarball-blahblah-file.name';

function getPackage(name, version = '0.0.0'): any {
  return {
    name,
    version,
    readme: 'this is a readme',
    dist: {
      shasum: 'fake',
      tarball: `http://localhost:0000/${encodeURIComponent(name)}/-/${TARBALL}`,
    },
  };
}

export interface ServerBridge {
  url: string;
  userAgent: string;
  authstr: string;
  request(options: any): typeof PromiseAssert;
  auth(name: string, password: string): RequestPromise;
  auth(name: string, password: string): RequestPromise;
  logout(token: string): Promise<any>;
  getPackage(name: string): Promise<any>;
  putPackage(name: string, data: any): Promise<any>;
  putVersion(name: string, version: string, data: any): Promise<any>;
  getTarball(name: string, filename: string): Promise<any>;
  putTarball(name: string, filename: string, data: any): Promise<any>;
  removeTarball(name: string): Promise<any>;
  removeSingleTarball(name: string, filename: string): Promise<any>;
  addTag(name: string, tag: string, version: string): Promise<any>;
  putTarballIncomplete(name: string, filename: string, data: any, size: number, cb: Function): Promise<any>;
  addPackage(name: string): Promise<any>;
  whoami(): Promise<any>;
  ping(): Promise<any>;
  debug(): RequestPromise;
}

const TOKEN_BASIC = 'Basic';

function buildToken(type: string, token: string): string {
  return `${_.capitalize(type)} ${token}`;
}

const buildAuthHeader = (user, pass): string => {
  return buildToken(TOKEN_BASIC, new Buffer(`${user}:${pass}`).toString('base64'));
};

export default class Server implements ServerBridge {
  public url: string;
  public userAgent: string;
  public authstr: string;

  public constructor(url: string) {
    this.url = url.replace(/\/$/, '');
    this.userAgent = 'node/v8.1.2 linux x64';
    this.authstr = buildAuthHeader(CREDENTIALS.user, CREDENTIALS.password);
  }

  public request(options: any): any {
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

  public auth(name: string, password: string) {
    // pragma: allowlist secret
    this.authstr = buildAuthHeader(name, password);
    return this.request({
      uri: `/-/user/org.couchdb.user:${encodeURIComponent(name)}/-rev/undefined`,
      method: 'PUT',
      json: {
        name,
        password,
        email: `${CREDENTIALS.user}@example.com`,
        _id: `org.couchdb.user:${name}`,
        type: 'user',
        roles: [],
        date: new Date(),
      },
    });
  }

  public logout(token: string) {
    return this.request({
      uri: `/-/user/token/${encodeURIComponent(token)}`,
      method: 'DELETE',
    });
  }

  public getPackage(name: string) {
    return this.request({
      uri: `/${encodeURIComponent(name)}`,
      method: 'GET',
    });
  }

  public putPackage(name: string, data) {
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

  public putVersion(name: string, version: string, data: any) {
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

  public getTarball(name: string, filename: string) {
    return this.request({
      uri: `/${encodeURIComponent(name)}/-/${encodeURIComponent(filename)}`,
      method: 'GET',
      encoding: null,
    });
  }

  public putTarball(name: string, filename: string, data: any) {
    return this.request({
      uri: `/${encodeURIComponent(name)}/-/${encodeURIComponent(filename)}/whatever`,
      method: 'PUT',
      headers: {
        [HEADERS.CONTENT_TYPE]: HEADERS.OCTET_STREAM,
      },
    }).send(data);
  }

  public removeTarball(name: string) {
    return this.request({
      uri: `/${encodeURIComponent(name)}/-rev/whatever`,
      method: 'DELETE',
      headers: {
        [HEADERS.CONTENT_TYPE]: HEADERS.JSON_CHARSET,
      },
    });
  }

  public removeSingleTarball(name: string, filename: string) {
    return this.request({
      uri: `/${encodeURIComponent(name)}/-/${filename}/-rev/whatever`,
      method: 'DELETE',
      headers: {
        [HEADERS.CONTENT_TYPE]: HEADERS.JSON_CHARSET,
      },
    });
  }

  public addTag(name: string, tag: string, version: string) {
    return this.request({
      uri: `/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`,
      method: 'PUT',
      headers: {
        [HEADERS.CONTENT_TYPE]: HEADERS.JSON,
      },
    }).send(JSON.stringify(version));
  }

  public putTarballIncomplete(pkgName: string, filename: string, data: any, headerContentSize: number): Promise<any> {
    const promise = this.request({
      uri: `/${encodeURIComponent(pkgName)}/-/${encodeURIComponent(filename)}/whatever`,
      method: 'PUT',
      headers: {
        [HEADERS.CONTENT_TYPE]: HEADERS.OCTET_STREAM,
        [HEADERS.CONTENT_LENGTH]: headerContentSize,
      },
      timeout: 1000,
    });

    promise.request(function(req) {
      req.write(data);
      // it auto abort the request
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

  public addPackage(name: string) {
    return this.putPackage(name, getPackage(name))
      .status(HTTP_STATUS.CREATED)
      .body_ok(API_MESSAGE.PKG_CREATED);
  }

  public whoami() {
    return this.request({
      uri: '/-/whoami',
    })
      .status(HTTP_STATUS.OK)
      .then(function(body) {
        return body.username;
      });
  }

  public ping() {
    return this.request({
      uri: '/-/ping',
    })
      .status(HTTP_STATUS.OK)
      .then(function(body) {
        return body;
      });
  }

  public debug() {
    return this.request({
      uri: '/-/_debug',
      method: 'GET',
      headers: {
        [HEADERS.CONTENT_TYPE]: HEADERS.JSON,
      },
    });
  }
}
