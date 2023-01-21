import nock from 'nock';
import supertest from 'supertest';

import { HTTP_STATUS } from '@verdaccio/core';
import { HEADERS, HEADER_TYPE } from '@verdaccio/core';

import { getNewToken, getPackage, initializeServer, publishVersion, starPackage } from './_helper';

describe('star', () => {
  test.each([['foo', '@scope/foo']])('should list stared packages for an user', async (pkgName) => {
    const userLogged = 'jota_token';
    nock('https://registry.npmjs.org').get(`/${pkgName}`).reply(404);
    const app = await initializeServer('star.yaml');
    const token = await getNewToken(app, { name: userLogged, password: 'secretPass' });
    await publishVersion(app, pkgName, '1.0.0', undefined, token).expect(HTTP_STATUS.CREATED);
    await publishVersion(app, 'pkg-1', '1.0.0', undefined, token).expect(HTTP_STATUS.CREATED);
    await publishVersion(app, 'pkg-2', '1.0.0', undefined, token).expect(HTTP_STATUS.CREATED);
    const manifest = await getPackage(app, '', decodeURIComponent(pkgName));
    await starPackage(
      app,
      {
        _rev: manifest.body._rev,
        _id: manifest.body.id,
        name: pkgName,
        users: { [userLogged]: true },
      },
      token
    ).expect(HTTP_STATUS.OK);
    await starPackage(
      app,
      {
        _rev: manifest.body._rev,
        _id: manifest.body.id,
        name: 'pkg-1',
        users: { [userLogged]: true },
      },
      token
    ).expect(HTTP_STATUS.OK);
    await starPackage(
      app,
      {
        _rev: manifest.body._rev,
        _id: manifest.body.id,
        name: 'pkg-2',
        users: { [userLogged]: true },
      },
      token
    ).expect(HTTP_STATUS.OK);
    const resp = await supertest(app)
      .get(`/-/_view/starredByUser?key=%22jota_token%22`)
      .set('Accept', HEADERS.JSON)
      .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
      .expect(HTTP_STATUS.OK);
    expect(resp.body.rows).toHaveLength(3);
    expect(resp.body.rows).toEqual([{ value: 'foo' }, { value: 'pkg-1' }, { value: 'pkg-2' }]);
  });

  test.each([['foo']])('should requires parameters', async (pkgName) => {
    const userLogged = 'jota_token';
    nock('https://registry.npmjs.org').get(`/${pkgName}`).reply(404);
    const app = await initializeServer('star.yaml');
    const token = await getNewToken(app, { name: userLogged, password: 'secretPass' });
    await publishVersion(app, pkgName, '1.0.0', undefined, token).expect(HTTP_STATUS.CREATED);
    return supertest(app)
      .get(`/-/_view/starredByUser?key_xxxxx=other`)
      .set('Accept', HEADERS.JSON)
      .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
      .expect(HTTP_STATUS.BAD_REQUEST);
  });
});
