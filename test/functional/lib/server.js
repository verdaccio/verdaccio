
const _ = require('lodash');
import assert from 'assert';
import request from './request';

const buildAuthHeader = (user, pass) => {
  return `Basic ${(new Buffer(`${user}:${pass}`)).toString('base64')}`;
};

class Server {

  constructor(url) {
    this.url = url.replace(/\/$/, '');
    this.userAgent = 'node/v8.1.2 linux x64';
    this.authstr = buildAuthHeader('test', 'test');
  }

  request(options) {
    assert(options.uri);
    const headers = options.headers || {};
    headers.accept = headers.accept || 'application/json';
    headers['user-agent'] = headers['user-agent'] || this.userAgent;
    headers.authorization = headers.authorization || this.authstr;

    return request({
      url: this.url + options.uri,
      method: options.method || 'GET',
      headers: headers,
      encoding: options.encoding,
      json: _.isNil(options.json) === false ? options.json : true,
    });
  }

  auth(name, password) {
    this.authstr = buildAuthHeader(name, password);
    return this.request({
      uri: `/-/user/org.couchdb.user:${encodeURIComponent(name)}/-rev/undefined`,
      method: 'PUT',
      json: {
        name: name,
        password: password,
        email: 'test@example.com',
        _id: `org.couchdb.user:${name}`,
        type: 'user',
        roles: [],
        date: new Date(),
      },
    });
  }

  logout(token) {
    return this.request({
      uri: `/-/user/token/${encodeURIComponent(token)}`,
      method: 'DELETE',
    });
  }


  getPackage(name) {
    return this.request({
      uri: `/${encodeURIComponent(name)}`,
      method: 'GET',
    });
  }

  putPackage(name, data) {
    if (_.isObject(data) && !Buffer.isBuffer(data)) {
      data = JSON.stringify(data);
    }
    return this.request({
      uri: `/${encodeURIComponent(name)}`,
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
      },
    }).send(data);
  }

  putVersion(name, version, data) {
    if (_.isObject(data) && !Buffer.isBuffer(data)) {
      data = JSON.stringify(data);
    }
    return this.request({
      uri: `/${encodeURIComponent(name)}/${encodeURIComponent(version)}/-tag/latest`,
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
      },
    }).send(data);
  }

  getTarball(name, filename) {
    return this.request({
      uri: `/${encodeURIComponent(name)}/-/${encodeURIComponent(filename)}`,
      method: 'GET',
      encoding: null,
    });
  }

  putTarball(name, filename, data) {
    return this.request({
      uri: `/${encodeURIComponent(name)}/-/${encodeURIComponent(filename)}/whatever`,
      method: 'PUT',
      headers: {
        'content-type': 'application/octet-stream',
      },
    }).send(data);
  }

  removeTarball(name) {
    return this.request({
      uri: `/${encodeURIComponent(name)}/-rev/whatever`,
      method: 'DELETE',
      headers: {
        'content-type': 'application/json; charset=utf-8',
      },
    });
  }

  removeSingleTarball(name, filename) {
    return this.request({
      uri: `/${encodeURIComponent(name)}/-/${filename}/-rev/whatever`,
      method: 'DELETE',
      headers: {
        'content-type': 'application/json; charset=utf-8',
      },
    });
  }


  addTag(name, tag, version) {
    return this.request({
      uri: `/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`,
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
      },
    }).send(JSON.stringify(version));
  }

  putTarballIncomplete(name, filename, data, size, cb) {
    let promise = this.request({
      uri: `/${encodeURIComponent(name)}/-/${encodeURIComponent(filename)}/whatever`,
      method: 'PUT',
      headers: {
        'content-type': 'application/octet-stream',
        'content-length': size,
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

  addPackage(name) {
    return this.putPackage(name, require('../fixtures/package')(name))
      .status(201)
      .body_ok('created new package');
  }

  whoami() {
    return this.request({
      uri: '/-/whoami'
    }).status(200)
      .then(function(body) {
        return body.username;
      });
  }

  ping() {
    return this.request({
      uri: '/-/ping'
    }).status(200)
      .then(function(body) {
        return body;
      });
  }

  debug() {
    return this.request({
      uri: '/-/_debug',
      method: 'GET',
      headers: {
        'content-type': 'application/json',
      },
    })
  }

}
export default Server;
