import nock from 'nock';
import { createRemoteUser } from '@verdaccio/utils';
import { Config } from '@verdaccio/types';
import { parseConfigFile } from '@verdaccio/config';
import { notify } from '../src/notify';
import { parseConfigurationFile } from './__helper';

const parseConfigurationNotifyFile = (name) => {
  return parseConfigurationFile(`notify/${name}`);
};
const singleHeaderNotificationConfig = parseConfigFile(
  parseConfigurationNotifyFile('single.header.notify')
);
const multiNotificationConfig = parseConfigFile(parseConfigurationNotifyFile('multiple.notify'));

const mockInfo = jest.fn();
jest.mock('@verdaccio/logger', () => ({
  setup: jest.fn(),
  logger: {
    child: jest.fn(),
    debug: jest.fn(),
    trace: jest.fn(),
    warn: jest.fn(),
    info: () => mockInfo(),
    error: jest.fn(),
    fatal: jest.fn(),
  },
}));

const domain = 'http://slack-service';

describe('Notifications:: notifyRequest', () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  test('when sending a empty notification', async () => {
    nock(domain).post('/foo?auth_token=mySecretToken').reply(200, { body: 'test' });

    const notificationResponse = await notify({}, {}, createRemoteUser('foo', []), 'bar');
    expect(notificationResponse).toEqual([false]);
  });

  test('when sending a single notification', async () => {
    nock(domain).post('/foo?auth_token=mySecretToken').reply(200, { body: 'test' });

    const notificationResponse = await notify(
      {},
      singleHeaderNotificationConfig,
      createRemoteUser('foo', []),
      'bar'
    );
    expect(notificationResponse).toEqual([true]);
  });

  test('when notification endpoint is missing', async () => {
    nock(domain).post('/foo?auth_token=mySecretToken').reply(200, { body: 'test' });
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
    nock(domain).post('/foo?auth_token=mySecretToken').reply(200, { body: 'test' });
    nock(domain).post('/foo?auth_token=mySecretToken').reply(400, {});
    nock(domain)
      .post('/foo?auth_token=mySecretToken')
      .reply(500, { message: 'Something bad happened' });

    const name = 'package';
    const responses = await notify({ name }, multiNotificationConfig, { name: 'foo' }, 'bar');
    expect(responses).toEqual([true, false, false]);
  });
});
