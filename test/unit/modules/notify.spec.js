// @flow

import {parseConfigurationFile} from '../__helper';
import {parseConfigFile} from '../../../src/lib/utils';
import {notify} from '../../../src/lib/notify';

import {notifyRequest} from '../../../src/lib/notify/notify-request';

jest.mock('./../../../src/lib/notify/notify-request', () => ({
  notifyRequest: jest.fn((options, content) => Promise.resolve([options, content]))
}));

require('../../../src/lib/logger').setup([]);

const parseConfigurationNotifyFile = (name) => {
  return parseConfigurationFile(`notify/${name}`);
};
const singleNotificationConfig = parseConfigFile(parseConfigurationNotifyFile('single.notify'));
const singleHeaderNotificationConfig = parseConfigFile(parseConfigurationNotifyFile('single.header.notify'));
const packagePatternNotificationConfig = parseConfigFile(parseConfigurationNotifyFile('single.packagePattern.notify'));
const multiNotificationConfig = parseConfigFile(parseConfigurationNotifyFile('multiple.notify'));


describe('Notify', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  //FUTURE: we should add some sort of health check of all props, (not implemented yet)

  test("should not fails if config is not provided", async () => {
    await notify({}, {});

    expect(notifyRequest).toHaveBeenCalledTimes(0);
  });

  test("should send notification", async () => {
    const name: string = 'package';
    const response = await notify({name}, singleNotificationConfig);
    const [options, content] = response;

    expect(options.headers).toBeDefined();
    expect(options.url).toBeDefined();
    expect(options.body).toBeDefined();
    expect(content).toMatch(name);
    expect(response).toBeTruthy();
    expect(notifyRequest).toHaveBeenCalledTimes(1);
  });

  test("should send single header notification", async () => {
    await notify({}, singleHeaderNotificationConfig);

    expect(notifyRequest).toHaveBeenCalledTimes(1);
  });

  test("should send multiple notification", async () => {
    await notify({}, multiNotificationConfig);

    expect(notifyRequest).toHaveBeenCalledTimes(3);
  });

  describe('packagePatternFlags', () => {
    test("should send single notification with packagePatternFlags", async () => {
      const name: string = 'package';
      await notify({name}, packagePatternNotificationConfig);


      expect(notifyRequest).toHaveBeenCalledTimes(1);
    });

    test("should not match on send single notification with packagePatternFlags", async () => {
      const name: string = 'no-mach-name';
      await notify({name}, packagePatternNotificationConfig);

      expect(notifyRequest).toHaveBeenCalledTimes(0);
    });
  })


});
