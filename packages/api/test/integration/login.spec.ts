import supertest from 'supertest';
import { describe, expect, test } from 'vitest';

import { HEADERS, HEADER_TYPE, HTTP_STATUS } from '@verdaccio/core';

import { initializeServer } from './_helper';

describe('login', () => {
  test('should return login and done urls, set session id', async () => {
    const app = await initializeServer('login.yaml');

    const response = await supertest(app)
      .post('/-/v1/login')
      .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
      .set(HEADER_TYPE.ACCEPT_ENCODING, HEADERS.JSON)
      .send(JSON.stringify({}));

    expect(response.status).toBe(HTTP_STATUS.OK);
    expect(response.headers['content-type']).toBe(HEADERS.JSON_CHARSET);
    expect(response.body).toEqual({
      loginUrl: expect.stringContaining('/login?next=/-/v1/login/cli/'),
      doneUrl: expect.stringContaining('/-/v1/done/'),
    });

    const sessionId = response.body.doneUrl.split('/-/v1/done/')[1];
    expect(sessionId.length).toBe(36);
  });

  test('should authenticate user using session id', async () => {
    const username = 'test';
    const password = 'testPass';
    const app = await initializeServer('login.yaml');

    const response = await supertest(app)
      .post('/-/v1/login')
      .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
      .set(HEADER_TYPE.ACCEPT_ENCODING, HEADERS.JSON)
      .send(JSON.stringify({}));

    expect(response.status).toBe(HTTP_STATUS.OK);

    const sessionId = response.body.doneUrl.split('/-/v1/done/')[1];

    const response2 = await supertest(app)
      .post(`/-/v1/login/cli/${sessionId}`)
      .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
      .set(HEADER_TYPE.ACCEPT_ENCODING, HEADERS.JSON)
      .send(
        JSON.stringify({
          username,
          password,
        })
      );

    expect(response2.status).toBe(HTTP_STATUS.CREATED);
    expect(response2.headers['content-type']).toBe(HEADERS.JSON_CHARSET);
    expect(response2.body).toEqual({
      ok: expect.any(String),
    });
  });

  test('should return session token when polled', async () => {
    const username = 'test';
    const password = 'testPass';
    const app = await initializeServer('login.yaml');

    const response = await supertest(app)
      .post('/-/v1/login')
      .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
      .set(HEADER_TYPE.ACCEPT_ENCODING, HEADERS.JSON)
      .send(JSON.stringify({}));

    expect(response.status).toBe(HTTP_STATUS.OK);

    const sessionId = response.body.doneUrl.split('/-/v1/done/')[1];

    const response2 = await supertest(app)
      .post(`/-/v1/login/cli/${sessionId}`)
      .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
      .set(HEADER_TYPE.ACCEPT_ENCODING, HEADERS.JSON)
      .send(
        JSON.stringify({
          username,
          password,
        })
      );

    expect(response2.status).toBe(HTTP_STATUS.CREATED);

    const response3 = await supertest(app)
      .get(`/-/v1/done/${sessionId}`)
      .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
      .set(HEADER_TYPE.ACCEPT_ENCODING, HEADERS.JSON);

    expect(response3.status).toBe(HTTP_STATUS.OK);
    expect(response3.headers['content-type']).toBe(HEADERS.JSON_CHARSET);
    expect(response3.body).toEqual({
      token: expect.any(String),
    });
  });
});
