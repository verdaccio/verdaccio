import assert from 'assert';
import _ from 'lodash';

import { API_MESSAGE, HEADERS, HTTP_STATUS, TOKEN_BASIC } from '../../src/lib/constants';
import { buildToken } from '../../src/lib/utils';
import { IServerBridge } from '../types';
import { CREDENTIALS } from './credentials';
import smartRequest from './request';

const buildAuthHeader = (user, pass): string => {
  return buildToken(TOKEN_BASIC, Buffer.from(`${user}:${pass}`).toString('base64'));
};

function getPackage(
  name,
  version = '0.0.0',
  port = '55551',
  domain = `http://localhost:${port}`,
  fileName = 'tarball-blahblah-file.name',
  readme = 'this is a readme'
): any {
  return {
    name,
    version,
    readme,
    dist: {
      shasum: 'fake',
      tarball: `${domain}/${encodeURIComponent(name)}/-/${fileName}`,
    },
  };
}

export default class Server implements IServerBridge {
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

  public putTarballIncomplete(
    pkgName: string,
    filename: string,
    data: any,
    headerContentSize: number
  ): Promise<any> {
    const promise = this.request({
      uri: `/${encodeURIComponent(pkgName)}/-/${encodeURIComponent(filename)}/whatever`,
      method: 'PUT',
      headers: {
        [HEADERS.CONTENT_TYPE]: HEADERS.OCTET_STREAM,
        [HEADERS.CONTENT_LENGTH]: headerContentSize,
      },
      timeout: 1000,
    });

    promise.request(function (req) {
      req.write(data);
      // it auto abort the request
      setTimeout(function () {
        req.req.abort();
      }, 20);
    });

    return new Promise(function (resolve, reject) {
      promise
        .then(function () {
          reject(Error('no error'));
        })
        .catch(function (err) {
          if (err.code === 'ECONNRESET') {
            // @ts-ignore
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
      .then(function (body) {
        return body.username;
      });
  }

  public ping() {
    return this.request({
      uri: '/-/ping',
    })
      .status(HTTP_STATUS.OK)
      .then(function (body) {
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
