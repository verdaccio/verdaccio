import nock from 'nock';
import { beforeEach, describe, expect, test } from 'vitest';

import { createRemoteUser, parseConfigFile } from '@verdaccio/config';
import { setup } from '@verdaccio/logger';
import { Config } from '@verdaccio/types';

import { notify } from '../src/notify';
import { parseConfigurationFile } from './__helper';

const parseConfigurationNotifyFile = (name) => {
  return parseConfigurationFile(`notify/${name}`);
};
const singleHeaderNotificationConfig = parseConfigFile(
  parseConfigurationNotifyFile('single.header.notify')
);
const multiNotificationConfig = parseConfigFile(parseConfigurationNotifyFile('multiple.notify'));

setup({});

const domain = 'http://slack-service';

const options = {
  path: '/foo?auth_token=mySecretToken',
};

describe('Notifications:: notifyRequest', () => {
  beforeEach(() => {
    nock.cleanAll();
  });
  test('when sending a empty notification', async () => {
    nock(domain).post(options.path).reply(200, { body: 'test' });

    const notificationResponse = await notify({}, {}, createRemoteUser('foo', []), 'bar');
    expect(notificationResponse).toEqual([false]);
  });

  test('when sending a single notification', async () => {
    nock(domain).post(options.path).reply(200, { body: 'test' });
    const notificationResponse = await notify(
      {},
      singleHeaderNotificationConfig,
      createRemoteUser('foo', []),
      'bar'
    );
    expect(notificationResponse).toEqual([true]);
  });

  test('when notification endpoint is missing', async () => {
    nock(domain).post(options.path).reply(200, { body: 'test' });
    const name = 'package';
    const config: Partial<Config> = {
      // @ts-ignore
      notify: {
        method: 'POST',
        endpoint: undefined,
        content: '',
      },
    };
    const notificationResponse = await notify({ name }, config, createRemoteUser('foo', []), 'bar');
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
    // mockClient.intercept(options).reply(200, { body: 'test' });
    // mockClient.intercept(options).reply(400, {});
    // mockClient.intercept(options).reply(500, { message: 'Something bad happened' });

    const name = 'package';
    const responses = await notify({ name }, multiNotificationConfig, { name: 'foo' }, 'bar');
    expect(responses).toEqual([true, false, false]);
  });
});
