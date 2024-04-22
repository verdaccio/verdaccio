/* eslint-disable jest/no-commented-out-tests */
import nock from 'nock';

import { HTTP_STATUS } from '@verdaccio/core';

import {
  changeOwners,
  createUser,
  getPackage,
  initializeServer,
  publishVersionWithToken,
} from './_helper';

describe('owner', () => {
  test.each([['foo', '@scope%2Ffoo']])('should get owner of package', async (pkgName) => {
    nock('https://registry.npmjs.org').get(`/${pkgName}`).reply(404);
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

  test.each([['foo', '@scope%2Ffoo']])('should add owner to package', async (pkgName) => {
    nock('https://registry.npmjs.org').get(`/${pkgName}`).reply(404);
    const app = await initializeServer('owner.yaml');
    const credentials = { name: 'test', password: 'test' };
    const response = await createUser(app, credentials.name, credentials.password);
    expect(response.body.ok).toMatch(`user '${credentials.name}' created`);
    await publishVersionWithToken(app, pkgName, '1.0.0', response.body.token).expect(
      HTTP_STATUS.CREATED
    );

    // publish sets owner to logged in user
    const manifest = await getPackage(app, '', decodeURIComponent(pkgName));
    expect(manifest.body.maintainers).toHaveLength(1);

    // add another owner
    const owner = { name: 'tester', email: 'test@verdaccio.org' };
    const newOwners = manifest.body.maintainers;
    newOwners.push(owner);
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

    const manifest2 = await getPackage(app, '', decodeURIComponent(pkgName));
    const maintainers2 = manifest2.body.maintainers;
    expect(maintainers2).toHaveLength(2);
    expect(maintainers2).toEqual([{ name: credentials.name, email: '' }, owner]);
  });

  test.each([['foo', '@scope%2Ffoo']])('should remove owner from package', async (pkgName) => {
    nock('https://registry.npmjs.org').get(`/${pkgName}`).reply(404);
    const app = await initializeServer('owner.yaml');
    const credentials = { name: 'test', password: 'test' };
    const response = await createUser(app, credentials.name, credentials.password);
    expect(response.body.ok).toMatch(`user '${credentials.name}' created`);
    await publishVersionWithToken(app, pkgName, '1.0.0', response.body.token).expect(
      HTTP_STATUS.CREATED
    );

    // publish sets owner to logged in user
    const manifest = await getPackage(app, '', decodeURIComponent(pkgName));
    expect(manifest.body.maintainers).toHaveLength(1);

    // add another owner
    const owner = { name: 'tester', email: 'test@verdaccio.org' };
    let newOwners = manifest.body.maintainers;
    newOwners.push(owner);
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

    const manifest2 = await getPackage(app, '', decodeURIComponent(pkgName));
    const maintainers2 = manifest2.body.maintainers;
    expect(maintainers2).toHaveLength(2);
    expect(maintainers2).toEqual([{ name: credentials.name, email: '' }, owner]);

    // remove original owner
    await changeOwners(
      app,
      {
        _rev: manifest2.body._rev,
        _id: manifest2.body._id,
        name: pkgName,
        maintainers: [owner],
      },
      response.body.token
    ).expect(HTTP_STATUS.CREATED);

    const manifest3 = await getPackage(app, '', decodeURIComponent(pkgName));
    const maintainers3 = manifest3.body.maintainers;
    expect(maintainers3).toHaveLength(1);
    expect(maintainers3).toEqual([owner]);
  });

  test.each([['foo', '@scope%2Ffoo']])('should fail if user is not logged in', async (pkgName) => {
    nock('https://registry.npmjs.org').get(`/${pkgName}`).reply(404);
    const app = await initializeServer('owner.yaml');
    const credentials = { name: 'test', password: 'test' };
    const response = await createUser(app, credentials.name, credentials.password);
    expect(response.body.ok).toMatch(`user '${credentials.name}' created`);
    await publishVersionWithToken(app, pkgName, '1.0.0', response.body.token).expect(
      HTTP_STATUS.CREATED
    );

    // publish sets owner to logged in user
    const manifest = await getPackage(app, '', decodeURIComponent(pkgName));
    expect(manifest.body.maintainers).toHaveLength(1);

    // add another owner
    const owner = { name: 'tester', email: 'test@verdaccio.org' };
    let newOwners = manifest.body.maintainers;
    newOwners.push(owner);
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
