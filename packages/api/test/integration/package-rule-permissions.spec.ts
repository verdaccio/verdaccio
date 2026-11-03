import type { Application } from 'express';
import supertest from 'supertest';
import { beforeAll, describe, expect, test } from 'vitest';

import { HEADERS, HTTP_STATUS, TOKEN_BEARER } from '@verdaccio/core';

import {
  buildToken,
  getNewToken,
  initializeServer,
  publishVersion,
  publishVersionWithToken,
} from './_helper';

const privatePackages = ['@private/core', 'private-core', '@internal/core', '@secret/core'];

describe('package rule permissions with minimatch', () => {
  let app: Application;
  let owner: string;
  let outsider: string;

  beforeAll(async () => {
    app = await initializeServer('package-rule-permissions.yaml');
    owner = await getNewToken(app, { name: 'owner', password: 'owner-password' });
    outsider = await getNewToken(app, { name: 'outsider', password: 'outsider-password' });
    for (const name of [...privatePackages, '@public/core', 'public-core']) {
      await publishVersionWithToken(app, name, '1.0.0', owner).expect(HTTP_STATUS.CREATED);
    }
  });

  test('serves package metadata as well as ping', async () => {
    await supertest(app).get('/-/ping').expect(HTTP_STATUS.OK);
    for (const name of ['public-core', '@public/core']) {
      const response = await supertest(app)
        .get(`/${encodeURIComponent(name)}`)
        .expect(HTTP_STATUS.OK);
      expect(response.body.name).toBe(name);
    }
  });

  test.each(['public-core', '@public/core'])(
    'denies anonymous publication for %s',
    async (name) => {
      await publishVersion(app, name, '1.1.0').expect(HTTP_STATUS.UNAUTHORIZED);
    }
  );

  describe.each(privatePackages)('%s remains private ahead of public wildcards', (name) => {
    test.each(['metadata', 'tarball'] as const)(
      'enforces read permissions for %s',
      async (resource) => {
        const basename = name.split('/').at(-1);
        const suffix = resource === 'tarball' ? `/-/${basename}-1.0.0.tgz` : '';
        for (const encoded of [name, encodeURIComponent(name)]) {
          const url = `/${encoded}${suffix}`;
          await supertest(app).get(url).expect(HTTP_STATUS.UNAUTHORIZED);
          await supertest(app)
            .get(url)
            .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, outsider))
            .expect(HTTP_STATUS.FORBIDDEN);
          await supertest(app)
            .get(url)
            .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, owner))
            .expect(HTTP_STATUS.OK);
          await supertest(app).get(url).expect(HTTP_STATUS.UNAUTHORIZED);
        }
      }
    );

    test('denies unauthorized publication without falling back to the public rule', async () => {
      await publishVersion(app, name, '1.1.0').expect(HTTP_STATUS.UNAUTHORIZED);
      await publishVersionWithToken(app, name, '1.1.0', outsider).expect(HTTP_STATUS.FORBIDDEN);
      await publishVersionWithToken(app, name, '1.1.0', owner).expect(HTTP_STATUS.CREATED);
    });

    test('denies unauthorized unpublish without removing the package', async () => {
      const removable = `${name}-to-remove`;
      await publishVersionWithToken(app, removable, '1.0.0', owner).expect(HTTP_STATUS.CREATED);
      const url = `/${encodeURIComponent(removable)}`;
      const manifest = await supertest(app)
        .get(url)
        .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, owner))
        .expect(HTTP_STATUS.OK);
      const revisionUrl = `${url}/-rev/${manifest.body._rev}`;
      await supertest(app).delete(revisionUrl).expect(HTTP_STATUS.UNAUTHORIZED);
      await supertest(app)
        .delete(revisionUrl)
        .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, outsider))
        .expect(HTTP_STATUS.FORBIDDEN);
      await supertest(app)
        .get(url)
        .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, owner))
        .expect(HTTP_STATUS.OK);
      await supertest(app)
        .delete(revisionUrl)
        .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, owner))
        .expect(HTTP_STATUS.CREATED);
      await supertest(app)
        .get(url)
        .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, owner))
        .expect(HTTP_STATUS.NOT_FOUND);
    });
  });
});
