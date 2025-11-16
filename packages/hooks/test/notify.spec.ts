import nock from 'nock';
import { beforeEach, describe, expect, test } from 'vitest';

import { createRemoteUser, parseConfigFile } from '@verdaccio/config';
import { setup } from '@verdaccio/logger';
import { generatePackageMetadata } from '@verdaccio/test-helper';
import { Config } from '@verdaccio/types';

import { notify } from '../src';
import { parseConfigurationFile } from './__helper';

const parseConfigurationNotifyFile = (name: string) => {
  return parseConfigurationFile(`notify/${name}`);
};

setup({});

const domain = 'http://slack-service';

const options = {
  path: '/foo?auth_token=mySecretToken',
};

describe('Notifications', () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  test('when sending a empty notification', async () => {
    nock(domain).post(options.path).reply(200, { body: 'test' });

    const notificationResponse = await notify(
      generatePackageMetadata('bar'),
      // @ts-expect-error notify expects Config but we are testing invalid config
      {},
      createRemoteUser('foo', []),
      'bar'
    );
    expect(notificationResponse).toEqual([false]);
  });

  test('when template is invalid', async () => {
    nock(domain).post(options.path).reply(200, { body: 'test' });
    const config = parseConfigFile(parseConfigurationNotifyFile('single.header.post.notify'));
    const notificationResponse = await notify(
      generatePackageMetadata('bar'),

      {
        // @ts-expect-error notify expects Config but we are testing partial config
        notify: {
          ...config.notify,
          content: 'invalid format {{{{',
        },
      },
      createRemoteUser('foo', []),
      'bar'
    );
    expect(notificationResponse).toEqual([false]);
  });

  test('when sending a single notification POST', async () => {
    nock(domain)
      .post(options.path, (body) => {
        expect(body).toEqual(
          '{"color":"green","message":"New package published: * bar*","notify":true,"message_format":"text"}'
        );
        return true;
      })
      .reply(200);
    const config = parseConfigFile(
      parseConfigurationNotifyFile('single.header.post.notify')
    ) as Partial<Config>;
    const notificationResponse = await notify(
      generatePackageMetadata('bar', '1.0.0'),
      // @ts-expect-error notify expects Config but we are testing partial config
      config,
      createRemoteUser('foo', []),
      'bar'
    );
    expect(notificationResponse).toEqual([true]);
  });

  test('when sending a single notification PUT', async () => {
    nock(domain)
      .put(options.path, (body) => {
        expect(body).toEqual(
          '{"color":"green","message":"New package published: * bar*","notify":true,"message_format":"text"}'
        );
        return true;
      })
      .reply(200);
    const config = parseConfigFile(
      parseConfigurationNotifyFile('single.header.put.notify')
    ) as Partial<Config>;
    const notificationResponse = await notify(
      generatePackageMetadata('bar', '1.0.0'),
      // @ts-expect-error notify expects Config but we are testing partial config
      config,
      createRemoteUser('foo', []),
      'bar'
    );
    expect(notificationResponse).toEqual([true]);
  });

  test('fallback to POST if method is invalid', async () => {
    nock(domain)
      .post(options.path, (body) => {
        expect(body).toEqual(
          '{"color":"green","message":"New package published: * bar*","notify":true,"message_format":"text"}'
        );
        return true;
      })
      .reply(200);
    const config = parseConfigFile(
      parseConfigurationNotifyFile('single.header.post.notify')
    ) as Partial<Config>;
    const notificationResponse = await notify(
      generatePackageMetadata('bar', '1.0.0'),
      {
        // @ts-expect-error notify expects Config but we are testing partial config
        notify: {
          ...config.notify,
          method: 'INVALID_METHOD',
        },
      },
      createRemoteUser('foo', []),
      'bar'
    );
    expect(notificationResponse).toEqual([true]);
  });

  test('when sending a single notification GET', async () => {
    nock(domain)
      .get('/foo')
      .query((actualQueryObject) => {
        expect(JSON.parse(actualQueryObject.body as string)).toEqual({
          color: 'green',
          message: 'New package published: * bar*',
          message_format: 'text',
          notify: true,
        });
        return true;
      })
      .reply(200);
    const config = parseConfigFile(
      parseConfigurationNotifyFile('single.header.get.notify')
    ) as Partial<Config>;
    const notificationResponse = await notify(
      generatePackageMetadata('bar', '1.0.0'),
      // @ts-expect-error notify expects Config but we are testing partial config
      config,
      createRemoteUser('foo', []),
      'bar'
    );
    expect(notificationResponse).toEqual([true]);
  });

  test('when single notification is invalid, returns false', async () => {
    const invalidNotificationConfig = {
      notify: {
        foo: 'bar',
      },
    };

    const responses = await notify(
      generatePackageMetadata('bar'),
      // @ts-expect-error notify expects Config but we are testing partial config
      invalidNotificationConfig,
      { name: 'foo' },
      'bar'
    );

    expect(responses).toEqual([false]);
  });

  test('when endpoint fails with 400', async () => {
    nock(domain)
      .post(options.path, (body) => {
        expect(body).toEqual(
          '{"color":"green","message":"New package published: * bar*","notify":true,"message_format":"text"}'
        );
        return true;
      })
      .reply(400, { error: 'bad request local server' });
    const config = parseConfigFile(
      parseConfigurationNotifyFile('single.header.post.notify')
    ) as Partial<Config>;
    const notificationResponse = await notify(
      generatePackageMetadata('bar', '1.0.0'),
      // @ts-expect-error notify expects Config but we are testing partial config
      config,
      createRemoteUser('foo', []),
      'bar'
    );
    expect(notificationResponse).toEqual([false]);
  });

  test('when notification endpoint is missing', async () => {
    nock(domain).post(options.path).reply(200);
    const config: Partial<Config> = {
      // @ts-expect-error endpoint is missing
      notify: {
        method: 'POST',
        endpoint: undefined,
        content: '',
      },
    };
    const notificationResponse = await notify(
      generatePackageMetadata('bar', '1.0.0'),
      // @ts-expect-error notify expects Config but we are testing partial config
      config,
      createRemoteUser('foo', []),
      'bar'
    );
    expect(notificationResponse).toEqual([false]);
  });

  test('when multiple notifications', async () => {
    nock(domain)
      .post(options.path)
      .once()
      .reply(200, { body: 'test' })
      .post(options.path)
      .once()
      .reply(400, {})
      .post(options.path)
      .once()
      .reply(500, { message: 'Something bad happened' });

    const multiNotificationConfig = parseConfigFile(
      parseConfigurationNotifyFile('multiple.notify')
    );
    const responses = await notify(
      generatePackageMetadata('bar'),
      // @ts-expect-error notify expects Config but we are testing partial config
      multiNotificationConfig,
      { name: 'foo' },
      'bar'
    );
    expect(responses).toEqual([true, false, false]);
  });

  test('when all notifications are invalid, returns all false', async () => {
    const invalidNotifications = {
      notify: {
        first: { foo: 'bar' },
        second: { endpoint: 'http://domain.com' },
        third: { content: 'template' },
      },
    };

    const responses = await notify(
      generatePackageMetadata('bar'),
      // @ts-expect-error notify expects Config but we are testing partial config
      invalidNotifications,
      { name: 'foo' },
      'bar'
    );

    expect(responses).toEqual([false, false, false]);
  });
});
