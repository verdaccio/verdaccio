import { describe, expect, test } from 'vitest';

import { ConfigBuilder } from '../src';

describe('Config builder', () => {
  test('should create a configuration file as object', () => {
    const config = ConfigBuilder.build();
    config
      .addUplink('upstream', { url: 'https://registry.verdaccio.org' })
      .addUplink('upstream2', { url: 'https://registry.verdaccio.org' })
      .addPackageAccess('upstream/*', {
        access: 'public',
        publish: 'foo, bar',
        unpublish: 'foo, bar',
        proxy: 'some',
      })
      .addLogger({ level: 'info', type: 'stdout', format: 'json' })
      .addAuth({ htpasswd: { file: '.htpasswd' } })
      .addStorage('/tmp/verdaccio')
      .addSecurity({ api: { legacy: true } });
    expect(config.getConfig()).toEqual({
      security: {
        api: {
          legacy: true,
        },
      },
      auth: {
        htpasswd: {
          file: '.htpasswd',
        },
      },
      storage: '/tmp/verdaccio',
      packages: {
        'upstream/*': {
          access: 'public',
          publish: 'foo, bar',
          unpublish: 'foo, bar',
          proxy: 'some',
        },
      },
      uplinks: {
        upstream: {
          url: 'https://registry.verdaccio.org',
        },
        upstream2: {
          url: 'https://registry.verdaccio.org',
        },
      },
      log: {
        level: 'info',
        type: 'stdout',
        format: 'json',
      },
    });
  });

  test('should create a configuration file as yaml', () => {
    const config = ConfigBuilder.build();
    config
      .addUplink('upstream', { url: 'https://registry.verdaccio.org' })
      .addUplink('upstream2', { url: 'https://registry.verdaccio.org' })
      .addPackageAccess('upstream/*', {
        access: 'public',
        publish: 'foo, bar',
        unpublish: 'foo, bar',
        proxy: 'some',
      })
      .addLogger({ level: 'info', type: 'stdout', format: 'json' })
      .addStorage('/tmp/verdaccio')
      .addSecurity({ api: { legacy: true } });
    expect(config.getAsYaml()).toMatchSnapshot();

    expect(config.getConfig()).toEqual({
      uplinks: {
        upstream: {
          url: 'https://registry.verdaccio.org',
        },
        upstream2: {
          url: 'https://registry.verdaccio.org',
        },
      },
      packages: {
        'upstream/*': {
          access: 'public',
          publish: 'foo, bar',
          unpublish: 'foo, bar',
          proxy: 'some',
        },
      },
      security: {
        api: {
          legacy: true,
        },
      },
      log: {
        level: 'info',
        type: 'stdout',
        format: 'json',
      },
      storage: '/tmp/verdaccio',
    });
  });

  test('should merge configurations', () => {
    // @ts-expect-error
    const config = ConfigBuilder.build({ security: { api: { legacy: false } } });
    config.addSecurity({ web: { verify: {}, sign: { algorithm: 'ES256' } } });
    config.addStorage('/tmp/verdaccio');
    expect(config.getConfig()).toEqual({
      security: {
        api: {
          legacy: false,
        },
        web: {
          verify: {},
          sign: {
            algorithm: 'ES256',
          },
        },
      },
      uplinks: {},
      packages: {},
      storage: '/tmp/verdaccio',
    });
  });
});
