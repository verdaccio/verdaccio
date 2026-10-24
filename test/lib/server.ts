import assert from 'assert';

import { authUtils } from '@verdaccio/core';

import { HEADERS, HTTP_STATUS, TOKEN_BEARER } from '../../src/lib/constants';
import { IServerBridge } from '../types';
import { CREDENTIALS } from './credentials';

export default class Server implements IServerBridge {
  public url: string;
  public authstr: string | undefined;

  public constructor(url: string) {
    this.url = url.replace(/\/$/, '');
    this.authstr = undefined;
  }

  private async request(
    uri: string,
    init: RequestInit = {}
  ): Promise<{ status: number; body: any }> {
    const headers = new Headers(init.headers);
    headers.set('accept', HEADERS.JSON);
    if (this.authstr) {
      headers.set('authorization', this.authstr);
    }
    const res = await fetch(this.url + uri, { ...init, headers });
    return { status: res.status, body: await res.json() };
  }

  public async debug() {
    const { status, body } = await this.request('/-/_debug');
    assert.equal(status, HTTP_STATUS.OK);
    return body;
  }

  public async auth(name: string, password: string) {
    // the login request itself is anonymous, the bearer token comes back in the body
    this.authstr = undefined;
    const { status, body } = await this.request(
      `/-/user/org.couchdb.user:${encodeURIComponent(name)}/-rev/undefined`,
      {
        method: 'PUT',
        headers: { [HEADERS.CONTENT_TYPE]: HEADERS.JSON },
        body: JSON.stringify({
          name,
          password,
          email: `${CREDENTIALS.user}@example.com`,
          _id: `org.couchdb.user:${name}`,
          type: 'user',
          roles: [],
          date: new Date(),
        }),
      }
    );
    assert.equal(status, HTTP_STATUS.CREATED);
    assert.match(body.ok, new RegExp(name));
    this.authstr = authUtils.buildToken(TOKEN_BEARER, body.token);
    return body;
  }
}
