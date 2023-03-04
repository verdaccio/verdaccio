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
      .addStorage('/tmp/verdaccio')
      .addSecurity({ api: { legacy: true } });
    expect(config.getConfig()).toEqual({
      security: {
        api: {
          legacy: true,
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
  });
});
