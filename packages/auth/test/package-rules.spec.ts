import { beforeAll, describe, expect, test, vi } from 'vitest';

import {
  Config,
  createAnonymousRemoteUser,
  createRemoteUser,
  getDefaultConfig,
} from '@verdaccio/config';
import { HTTP_STATUS } from '@verdaccio/core';
import { logger, setup } from '@verdaccio/logger';
import type { PackageList } from '@verdaccio/types';

import { Auth } from '../src';

const privateRule = {
  access: ['readers'],
  publish: ['publishers'],
  unpublish: ['maintainers'],
};
const publicRule = {
  access: ['$all'],
  publish: ['$all'],
  unpublish: ['$all'],
};

async function createAuth(packages: PackageList) {
  const config = new Config({ ...getDefaultConfig(), auth: {}, uplinks: {}, packages });
  config.checkSecretKey('0123456789abcdef0123456789abcdef');
  const auth = new Auth(config, logger);
  await auth.init();
  return auth;
}

beforeAll(async () => {
  await setup({ type: 'stdout', format: 'json', level: 'fatal' });
});

describe.each([
  ['allow_access', 'readers'],
  ['allow_publish', 'publishers'],
  ['allow_unpublish', 'maintainers'],
] as const)('%s follows package rules', (action, group) => {
  test.each(['@private/core', '@PRIVATE/Core', '@private/ui'])(
    'does not fall back to a public rule after denying %s',
    async (packageName) => {
      const auth = await createAuth({
        '@private/*': privateRule,
        '@*/*': publicRule,
        '**': publicRule,
      });
      const denied = [
        [createAnonymousRemoteUser(), HTTP_STATUS.UNAUTHORIZED],
        [createRemoteUser('outsider', []), HTTP_STATUS.FORBIDDEN],
      ] as const;

      for (const [user, status] of denied) {
        const callback = vi.fn();
        auth[action]({ packageName }, user, callback);
        expect(callback).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ status }));
      }

      const callback = vi.fn();
      auth[action]({ packageName }, createRemoteUser('member', [group]), callback);
      expect(callback).toHaveBeenCalledExactlyOnceWith(null, true);
    }
  );

  test('allows public scoped and unscoped packages', async () => {
    const auth = await createAuth({
      '@private/*': privateRule,
      '@*/*': publicRule,
      '**': publicRule,
    });
    for (const packageName of ['@public/core', 'public-core']) {
      const callback = vi.fn();
      auth[action]({ packageName }, createAnonymousRemoteUser(), callback);
      expect(callback).toHaveBeenCalledExactlyOnceWith(null, true);
    }
  });

  test('keeps first-match precedence when the public wildcard is first', async () => {
    const auth = await createAuth({ '**': publicRule, '@private/*': privateRule });
    const callback = vi.fn();
    auth[action]({ packageName: '@private/core' }, createAnonymousRemoteUser(), callback);
    expect(callback).toHaveBeenCalledExactlyOnceWith(null, true);
  });

  test('keeps a matching deny rule ahead of the public wildcard', async () => {
    const auth = await createAuth({
      '@private/*': { access: [], publish: [], unpublish: [] },
      '**': publicRule,
    });
    const callback = vi.fn();
    auth[action]({ packageName: '@private/core' }, createRemoteUser('member', [group]), callback);
    expect(callback).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ status: HTTP_STATUS.FORBIDDEN })
    );
  });
});
