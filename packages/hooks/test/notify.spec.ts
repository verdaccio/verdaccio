import { parseConfigFile } from '@verdaccio/utils';
import { setup } from '@verdaccio/logger';

import { notify } from '../src';
import { notifyRequest } from '../src/notify-request';
import { parseConfigurationFile } from './__helper';

setup([]);

jest.mock('../src/notify-request', () => ({
  notifyRequest: jest.fn((options, content) => Promise.resolve([options, content])),
}));

const parseConfigurationNotifyFile = (name) => {
  return parseConfigurationFile(`notify/${name}`);
};
const singleNotificationConfig = parseConfigFile(parseConfigurationNotifyFile('single.notify'));
const singleHeaderNotificationConfig = parseConfigFile(
  parseConfigurationNotifyFile('single.header.notify')
);
const packagePatternNotificationConfig = parseConfigFile(
  parseConfigurationNotifyFile('single.packagePattern.notify')
);
const multiNotificationConfig = parseConfigFile(parseConfigurationNotifyFile('multiple.notify'));

describe('Notifications:: Notify', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // FUTURE: we should add some sort of health check of all props, (not implemented yet)

  test('should not fails if config is not provided', async () => {
    // @ts-ignore
    await notify({}, {});

    expect(notifyRequest).toHaveBeenCalledTimes(0);
  });

  test('should send notification', async () => {
    const name = 'package';
    // @ts-ignore
    const response = await notify({ name }, singleNotificationConfig, { name: 'foo' }, 'bar');
    const [options, content] = response;

    expect(options.headers).toBeDefined();
    expect(options.url).toBeDefined();
    expect(options.body).toBeDefined();
    expect(content).toMatch(name);
    expect(response).toBeTruthy();
    expect(notifyRequest).toHaveBeenCalledTimes(1);
  });

  test('should send single header notification', async () => {
    // @ts-ignore
    await notify({}, singleHeaderNotificationConfig, { name: 'foo' }, 'bar');

    expect(notifyRequest).toHaveBeenCalledTimes(1);
  });

  test('should send multiple notification', async () => {
    const name = 'package';
    // @ts-ignore
    await notify({ name }, multiNotificationConfig, { name: 'foo' }, 'bar');

    expect(notifyRequest).toHaveBeenCalled();
    expect(notifyRequest).toHaveBeenCalledTimes(3);
  });

  describe('packagePatternFlags', () => {
    test('should send single notification with packagePatternFlags', async () => {
      const name = 'package';
      // @ts-ignore
      await notify({ name }, packagePatternNotificationConfig, { name: 'foo' }, 'bar');

      expect(notifyRequest).toHaveBeenCalledTimes(1);
    });

    test('should not match on send single notification with packagePatternFlags', async () => {
      const name = 'no-mach-name';
      // @ts-ignore
      await notify({ name }, packagePatternNotificationConfig, { name: 'foo' }, 'bar');

      expect(notifyRequest).toHaveBeenCalledTimes(0);
    });
  });
});
