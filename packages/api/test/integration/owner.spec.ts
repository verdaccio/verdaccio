import nock from 'nock';
import { describe, expect, test } from 'vitest';

import { HTTP_STATUS } from '@verdaccio/core';

import {
  changeOwners,
  createUser,
  getPackage,
  initializeServer,
  publishVersionWithToken,
} from './_helper';

describe('owner', () => {
  test.each([
    ['foo', 'foo'],
    ['@scope/foo', '@scope/foo'],
    ['@scope/foo', encodeURIComponent('@scope/foo')],
  ])('should get owner of package', async (pkgName, path) => {
    nock('https://registry.npmjs.org').get(`/${path}`).reply(404);
    const app = await initializeServer('owner.yaml');
    const credentials = { name: 'test', password: 'test' };
    const response = await createUser(app, credentials.name, credentials.password);
    expect(response.body.ok).toMatch(`user '${credentials.name}' created`);
    await publishVersionWithToken(app, pkgName, '1.0.0', response.body.token).expect(
      HTTP_STATUS.CREATED
    );

    // expect publish to set owner to logged in user
    const manifest = await getPackage(app, '', decodeURIComponent(pkgName));
    const maintainers = manifest.body.maintainers;
    expect(maintainers).toHaveLength(1);
    // TODO: This should eventually include the email of the user
    expect(maintainers).toEqual([{ name: credentials.name, email: '' }]);
  });

  test.each([
    ['foo', 'foo'],
    ['@scope/foo', '@scope/foo'],
    ['@scope/foo', encodeURIComponent('@scope/foo')],
  ])('should add/remove owner to package', async (pkgName, path) => {
    nock('https://registry.npmjs.org').get(`/${path}`).reply(404);
    const app = await initializeServer('owner.yaml');
    const credentials = { name: 'test', password: 'test' };
    const firstOwner = { name: 'test', email: '' };
    const response = await createUser(app, credentials.name, credentials.password);
    expect(response.body.ok).toMatch(`user '${credentials.name}' created`);
    await publishVersionWithToken(app, pkgName, '1.0.0', response.body.token).expect(
      HTTP_STATUS.CREATED
    );

    // publish sets owner to logged in user
    const manifest = await getPackage(app, '', pkgName);
    const maintainers = manifest.body.maintainers;
    expect(maintainers).toHaveLength(1);
    expect(maintainers).toEqual([firstOwner]);

    // add another owner
    const secondOwner = { name: 'tester', email: 'test@verdaccio.org' };
    const newOwners = [...maintainers, secondOwner];
    await changeOwners(
      app,
      {
        _rev: manifest.body._rev,
        _id: manifest.body._id,
        name: pkgName,
        maintainers: newOwners,
      },
      response.body.token
    ).expect(HTTP_STATUS.CREATED);

    const manifest2 = await getPackage(app, '', pkgName);
    const maintainers2 = manifest2.body.maintainers;
    expect(maintainers2).toHaveLength(2);
    expect(maintainers2).toEqual([firstOwner, secondOwner]);

    // remove original owner
    await changeOwners(
      app,
      {
        _rev: manifest2.body._rev,
        _id: manifest2.body._id,
        name: pkgName,
        maintainers: [secondOwner],
      },
      response.body.token
    ).expect(HTTP_STATUS.CREATED);

    const manifest3 = await getPackage(app, '', pkgName);
    const maintainers3 = manifest3.body.maintainers;
    expect(maintainers3).toHaveLength(1);
    expect(maintainers3).toEqual([secondOwner]);
  });

  test.each([
    ['foo', 'foo'],
    ['@scope/foo', '@scope/foo'],
    ['@scope/foo', encodeURIComponent('@scope/foo')],
  ])('should fail if user is not logged in', async (pkgName, path) => {
    nock('https://registry.npmjs.org').get(`/${path}`).reply(404);
    const app = await initializeServer('owner.yaml');
    const credentials = { name: 'test', password: 'test' };
    const firstOwner = { name: 'test', email: '' };
    const response = await createUser(app, credentials.name, credentials.password);
    expect(response.body.ok).toMatch(`user '${credentials.name}' created`);
    await publishVersionWithToken(app, pkgName, '1.0.0', response.body.token).expect(
      HTTP_STATUS.CREATED
    );

    // publish sets owner to logged in user
    const manifest = await getPackage(app, '', pkgName);
    const maintainers = manifest.body.maintainers;
    expect(maintainers).toHaveLength(1);
    expect(maintainers).toEqual([firstOwner]);

    // try adding another owner
    const secondOwner = { name: 'tester', email: 'test@verdaccio.org' };
    const newOwners = [...maintainers, secondOwner];
    await changeOwners(
      app,
      {
        _rev: manifest.body._rev,
        _id: manifest.body._id,
        name: pkgName,
        maintainers: newOwners,
      },
      '' // no token
    ).expect(HTTP_STATUS.UNAUTHORIZED);
  });
});
