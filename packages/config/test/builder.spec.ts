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

  test('constructor should not mutate initial config values', () => {
    // @ts-expect-error
    const config = ConfigBuilder.build({ security: { api: { legacy: true } } });
    expect(config.getConfig().security).toEqual({ api: { legacy: true } });
  });

  test('should add web configuration', () => {
    const config = ConfigBuilder.build().addWeb({ title: 'My Registry', primaryColor: '#4b5e40' });
    expect(config.getConfig().web).toEqual({
      title: 'My Registry',
      primaryColor: '#4b5e40',
    });
  });

  test('should merge web configuration', () => {
    const config = ConfigBuilder.build()
      .addWeb({ title: 'My Registry' })
      .addWeb({ darkMode: true });
    expect(config.getConfig().web).toEqual({
      title: 'My Registry',
      darkMode: true,
    });
  });

  test('should add listen address', () => {
    const config = ConfigBuilder.build().addListen({ 0: 'localhost:4873' });
    expect(config.getConfig().listen).toEqual({ 0: 'localhost:4873' });
  });

  test('should add https configuration', () => {
    const config = ConfigBuilder.build().addHttps({
      key: '/path/to/key.pem',
      cert: '/path/to/cert.pem',
    });
    expect(config.getConfig().https).toEqual({
      key: '/path/to/key.pem',
      cert: '/path/to/cert.pem',
    });
  });

  test('should add publish options', () => {
    const config = ConfigBuilder.build().addPublish({ allow_offline: true, check_owners: false });
    expect(config.getConfig().publish).toEqual({
      allow_offline: true,
      check_owners: false,
    });
  });

  test('should add flags configuration', () => {
    const config = ConfigBuilder.build().addFlags({ changePassword: true, createUser: true });
    expect(config.getConfig().flags).toEqual({
      changePassword: true,
      createUser: true,
    });
  });

  test('should merge flags configuration', () => {
    const config = ConfigBuilder.build()
      .addFlags({ changePassword: true })
      .addFlags({ createUser: true });
    expect(config.getConfig().flags).toEqual({
      changePassword: true,
      createUser: true,
    });
  });

  test('should add notifications', () => {
    const notification = { endpoint: 'https://hooks.example.com', content: '{"text": "{{name}}"}' };
    const config = ConfigBuilder.build().addNotify(notification);
    expect(config.getConfig().notify).toEqual(notification);
  });

  test('should add multiple notifications as array', () => {
    const notifications = [
      { endpoint: 'https://hooks.example.com/1', content: '{"text": "{{name}}"}' },
      { endpoint: 'https://hooks.example.com/2', content: '{"text": "{{name}}"}' },
    ];
    const config = ConfigBuilder.build().addNotify(notifications);
    expect(config.getConfig().notify).toEqual(notifications);
  });

  test('should add middlewares', () => {
    const config = ConfigBuilder.build().addMiddlewares({ audit: { enabled: true } });
    expect(config.getConfig().middlewares).toEqual({ audit: { enabled: true } });
  });

  test('should add filters', () => {
    const config = ConfigBuilder.build().addFilters({ 'storage-filter': { enabled: true } });
    expect(config.getConfig().filters).toEqual({ 'storage-filter': { enabled: true } });
  });

  test('should merge filters configuration', () => {
    const config = ConfigBuilder.build()
      .addFilters({ 'filter-a': { enabled: true } })
      .addFilters({ 'filter-b': { enabled: false } });
    expect(config.getConfig().filters).toEqual({
      'filter-a': { enabled: true },
      'filter-b': { enabled: false },
    });
  });

  test('should add max body size', () => {
    const config = ConfigBuilder.build().addMaxBodySize('50mb');
    expect(config.getConfig().max_body_size).toBe('50mb');
  });

  test('should add user rate limit', () => {
    const config = ConfigBuilder.build().addUserRateLimit({ windowMs: 60000, max: 100 });
    expect(config.getConfig().userRateLimit).toEqual({ windowMs: 60000, max: 100 });
  });

  test('should add url prefix', () => {
    const config = ConfigBuilder.build().addUrlPrefix('/verdaccio/');
    expect(config.getConfig().url_prefix).toBe('/verdaccio/');
  });

  test('should add i18n configuration', () => {
    const config = ConfigBuilder.build().addI18n({ web: 'en-US' });
    expect(config.getConfig().i18n).toEqual({ web: 'en-US' });
  });

  test('should add user agent', () => {
    const config = ConfigBuilder.build().addUserAgent('verdaccio/6.0.0');
    expect(config.getConfig().user_agent).toBe('verdaccio/6.0.0');
  });

  test('should add http proxy', () => {
    const config = ConfigBuilder.build().addHttpProxy('http://proxy.example.com:8080');
    expect(config.getConfig().http_proxy).toBe('http://proxy.example.com:8080');
  });

  test('should add https proxy', () => {
    const config = ConfigBuilder.build().addHttpsProxy('https://proxy.example.com:8443');
    expect(config.getConfig().https_proxy).toBe('https://proxy.example.com:8443');
  });

  test('should add no proxy', () => {
    const config = ConfigBuilder.build().addNoProxy('localhost,127.0.0.1');
    expect(config.getConfig().no_proxy).toBe('localhost,127.0.0.1');
  });

  test('should add plugins directory', () => {
    const config = ConfigBuilder.build().addPlugins('/opt/verdaccio/plugins');
    expect(config.getConfig().plugins).toBe('/opt/verdaccio/plugins');
  });

  test('should add notifications configuration', () => {
    const config = ConfigBuilder.build().addNotifications({
      endpoint: 'https://notify.example.com',
      content: '{"msg": "package published"}',
    });
    expect(config.getConfig().notifications).toEqual({
      endpoint: 'https://notify.example.com',
      content: '{"msg": "package published"}',
    });
  });

  test('should chain all new methods together', () => {
    const config = ConfigBuilder.build()
      .addStorage('/tmp/verdaccio')
      .addAuth({ htpasswd: { file: '.htpasswd' } })
      .addUplink('npmjs', { url: 'https://registry.npmjs.org/' })
      .addPackageAccess('**', { access: '$all', publish: '$authenticated', proxy: 'npmjs' })
      .addWeb({ title: 'My Registry' })
      .addFlags({ changePassword: true })
      .addPublish({ allow_offline: false, check_owners: true })
      .addMaxBodySize('100mb')
      .addUrlPrefix('/registry/')
      .addUserRateLimit({ windowMs: 60000, max: 200 })
      .addI18n({ web: 'en-US' })
      .addLogger({ level: 'warn', type: 'stdout', format: 'pretty' });

    const result = config.getConfig();
    expect(result.storage).toBe('/tmp/verdaccio');
    expect(result.web).toEqual({ title: 'My Registry' });
    expect(result.flags).toEqual({ changePassword: true });
    expect(result.publish).toEqual({ allow_offline: false, check_owners: true });
    expect(result.max_body_size).toBe('100mb');
    expect(result.url_prefix).toBe('/registry/');
    expect(result.userRateLimit).toEqual({ windowMs: 60000, max: 200 });
    expect(result.i18n).toEqual({ web: 'en-US' });
  });

  test('should build a full configuration using all builder methods', () => {
    const config = ConfigBuilder.build()
      .addStorage('./storage')
      .addSecurity({
        api: {
          jwt: {
            sign: { expiresIn: '7d' },
            verify: {},
          },
          legacy: false,
        },
        web: {
          sign: { expiresIn: '1h' },
          verify: {},
        },
      })
      .addWeb({
        title: 'Test Registry',
        darkMode: true,
        showInfo: false,
        primaryColor: '#000000',
      })
      .addAuth({
        'custom-auth-plugin': {
          enabled: true,
        },
      })
      .addStorage({
        'custom-storage-plugin': {
          bucket: 'test-bucket',
          region: 'us-east-1',
        },
      })
      .addMiddlewares({
        'custom-middleware': {
          enabled: true,
        },
      })
      .addPackageAccess('@scope/public-pkg', {
        access: ['$all'],
        publish: ['$authenticated'],
        unpublish: ['$authenticated'],
      })
      .addPackageAccess('@scope/*', {
        access: ['$authenticated'],
        publish: ['$authenticated'],
        unpublish: ['$authenticated'],
      })
      .addLogger({ type: 'stdout', format: 'pretty', level: 'warn' })
      .addI18n({ web: 'en-US' });

    const result = config.getConfig();
    expect(result.store).toEqual({
      'custom-storage-plugin': {
        bucket: 'test-bucket',
        region: 'us-east-1',
      },
    });
    expect(result.security.api).toEqual({
      jwt: { sign: { expiresIn: '7d' }, verify: {} },
      legacy: false,
    });
    expect(result.web?.title).toBe('Test Registry');
    expect(result.web?.primaryColor).toBe('#000000');
    expect(result.auth).toEqual({
      'custom-auth-plugin': { enabled: true },
    });
    expect(result.middlewares).toEqual({
      'custom-middleware': { enabled: true },
    });
    expect(result.packages).toHaveProperty('@scope/public-pkg');
    expect(result.packages).toHaveProperty('@scope/*');
    expect(result.i18n).toEqual({ web: 'en-US' });
    expect(result.log).toEqual({ type: 'stdout', format: 'pretty', level: 'warn' });
  });
});
